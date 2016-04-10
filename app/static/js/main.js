/*call api to get trends
var noun = "/api/getnoun/" + input_phrase
$.ajax({
    url: cityUrl,
    success: function(result){
    // do stuff here with result !
}
*/


var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.onresult = function(event) { 
  len = event['results']['length']
  speech_text = event['results'][len - 1][0]['transcript'];
  //do ajax call with result to do POS tagging
  url = "/api/getnoun/" + speech_text
  $.ajax({
    url: url,
    success: function(result){
      console.log(result)
      // do stuff here with result !
      // add image to list
      src = "http://stuffpoint.com/baby-farm-animals/image/374865-baby-farm-animals-and-this-little-piggy.jpg";
      id = "0"
      img = '<img id= ' + id + ' width="300" height="300" src=' + src + ' alt="piggy">'
      $( "body" ).append( img );
      //add to dom so we can draw it on the waveform

      addToThumbnails(id);
  }})
}
recognition.start();


//Center canvas function
(function() {
    var canvas = document.getElementById('meter'),
            context = canvas.getContext('2d');

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            /**
             * Your drawings need to be inside this function otherwise they will be reset when 
             * you resize the browser window and the canvas goes will be cleared.
             */
            drawStuff(); 
    }
    resizeCanvas();

    function drawStuff() {
            // do your drawing stuff here
    }
})();






