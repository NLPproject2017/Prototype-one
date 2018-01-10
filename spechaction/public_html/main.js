/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*Component 1*/
//speech to text
            var speech = new webkitSpeechRecognition();
            speech.lang = 'en-US';
            speech.continuous = true;
            speech.interimResults = true;
            var rec;
            var pressed;
            var resText = '';

            //SPEECH-TEXT        
            window.onload = function () {

                document.onkeydown = function () {
                    pressed = true;
                    handleKey(pressed);

                };
                document.onkeyup = function () {
                    pressed = false;
                    handleKey(pressed);

                };
                function handleKey(pressed) {
                    if (pressed) {
                        if (!rec) {
                            speech.start();
                        }
                    } else {
                        if (rec) {
                            speech.stop();
                        }
                    }
                }
                speech.onstart = function () {
                    rec = true;
                };
                speech.onresult = function (event) {
                    resText = event.results[event.results.length - 1][0].transcript;
                    document.getElementById('inputText').value = resText;
                    voiceInput = true;
                };
                speech.onend = function () {
                    rec = false;
                };

            }; 
            /*Component 2*/
            //DialogFlow
            var accessToken = "7f42371f1f2b408eb732c69b4838bf9d"; //accesstoken for api.ai
            var URL = "https://api.api.ai/v1/"; //update with new version, api calls here
            var Input; //stores input
            var m1 = "I don't have an answer";
            //---DIALOGFLOW

            //Talk to API.AI (AJAX POST request)
            //----------------------------------
            function send() {
                if (voiceInput) {
                    var text = resText;
                } else {
                    text = document.getElementById('inputText').value;
                }
                //ajax-post request
                $.ajax({
                    type: "POST",
                    url: URL + "query",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {"Authorization": "Bearer " + accessToken}, data: JSON.stringify({query: text, lang: "en", sessionId: "User1"}),
                    success: function (data) {
                        handleRespObj(data);
                    },
                    error: function () {
                        handleError("Error");
                    }
                });

            }
            function resetInput() {
                document.getElementById('inputText').value = "";
                resText = "";
                voiceInput = false;
            }
            //--------------------------------
            //get important stuff from JSON Obj
            function handleRespObj(val) {
                var datafromobj1 = val.result.action;
                var datafromobj2 = val.result.parameters.Note;
                var dialogResText = val.result.speech;
                respond(dialogResText);
                printData(datafromobj1, datafromobj2);
                doAction(datafromobj1, datafromobj2);
            }

            function doAction(datafromobj1, datafromobj2) {
                if (datafromobj1 === "open") {
                    winProp = 'width=400, height=350, location=yes';
                    newWin = open('noteWindow.html', 'win', winProp);
                }
            }
            function printData(datafromobj1, datafromobj2) {
                document.getElementById("outputData").innerHTML = "Action triggered: " + datafromobj1 + "<br> Entities found: " + datafromobj2;

            }
            //handle responses
            function respond(message) {
                //if no response is returned from api.ai (string without meaning)
                if (message === "") {
                    message = m1;
                }
                //print message if it wasn't an empty string
                document.getElementById("outputDialogFlow").innerHTML = message;
                resetInput();
            }
            function handleError(errMessage) {
                document.getElementById("outputDialogFlow").innerHTML = errMessage;
            }

