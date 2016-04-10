
/*

The MIT License (MIT)

Copyright (c) 2014 Chris Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH= 0;
var HEIGHT=200;
var rafID = null;
var audioData = null;
var pictureThumbnails = new Array(0);
var pictureThumbnailLocations = new Array(0);
var pictureThumbsLength = 0;

window.onload = function() {
    WIDTH= $('#meter').width();
    audioData = new Array(WIDTH);

    // grab our canvas
  canvasContext = document.getElementById( "meter" ).getContext("2d");

    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}

function addToThumbnails(new_pic){
    pictureThumbnails.push(document.getElementById(new_pic));
    // console.log(new_pic)
    // console.log(document.getElementById(new_pic))
    // console.log(pictureThumbnails)
}

function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    drawLoop();
}

//modified original code to give a waveform instead of a single bar
function drawLoop( time ) {
    //var WIDTH= $('#meter').height();
    if (pictureThumbsLength != pictureThumbnails.length){
        //add to pic array
        loc = audioData.length;
        pictureThumbnailLocations[pictureThumbsLength] = audioData.length
        pictureThumbsLength += 1;
    }
    // clear the background
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);
    canvasContext.fillStyle = "#F6F6FF";

    audioData[audioData.length] = meter.volume;
    audioData.shift();
    // draw a bar based on the current volume
    for(var i = 0; i < audioData.length; i++ ){
      canvasContext.fillRect(i, 0, 1, audioData[i]*HEIGHT);
    }
    for(var i = 0; i < pictureThumbnails.length; i++ ){
      //draw pics?
      pictureThumbnailLocations[i] = pictureThumbnailLocations[i] - 1;
      canvasContext.drawImage(pictureThumbnails[i],pictureThumbnailLocations[i],0,50,50);
    }
    //console.log(audioData)
    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );
}


