var imageSearchBaseURL = 'https://www.googleapis.com/customsearch/v1'
var cx = '009967352923164700190:bh01lm5iclm'
var apiKey = 'AIzaSyAe2MVdSPyvFehxCdGvrrp98VIL5KeMC_A'

var recognition = new webkitSpeechRecognition()
recognition.continuous = true

recognition.onresult = function(event) {

  // continuous stream appends to the results array,
  // so the last element is the most recent
  var len = event.results.length
  var speechText = event.results[len - 1][0].transcript

  // make a request to get the keyword from speechText
  $.ajax({
<<<<<<< HEAD
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






=======
    url: '/api/getnoun/' + speechText,
    success: function(keyword){

      // if no keyword was found, set the picture to black
      // this saves a request to the google image search api
      if (keyword === 'black') {
        $('#img').attr('src', 'http://a.tile.stamen.com/toner/12/653/1583.png')
        $('#text').text(speechText)
      } else {
        // make a request to get the first google image result with the given keyword
        $.ajax({
          url: imageSearchBaseURL,
          type: 'GET',
          data: {
            q: keyword,
            num: 1,
            imgSize: 'large',
            searchType: 'image',
            key: apiKey,
            cx: cx
          }
        })
        .done(function(data) {
          var imageLink = data.items[0].link
          $('#img').attr('src', imageLink)
          $('#text').text(speechText)
        })
        .fail(function(error) {
          console.log('error', error)
        })
      }
  }})
}

recognition.start()
>>>>>>> origin/varun
