var imageSearchBaseURL = 'https://www.googleapis.com/customsearch/v1'
var cx = '009967352923164700190:bh01lm5iclm'
var apiKey = 'AIzaSyAe2MVdSPyvFehxCdGvrrp98VIL5KeMC_A'

// used for generating unique ids for pictures/thumbnails on waveform
var count = 0

// all the results from the audio stream
// constains objects with the keyword, speechText, and imageLink for each phrase
var results = []

var recognition = new webkitSpeechRecognition()
recognition.continuous = true

recognition.onresult = function(event) {

  // continuous stream appends to the results array,
  // so the last element is the most recent
  var len = event.results.length
  var speechText = event.results[len - 1][0].transcript

  console.log('speechText', speechText)

  // make a request to get the keyword from speechText
  $.ajax({
    url: '/api/getnoun/' + speechText,
    success: function(keyword){

      console.log('keyword', keyword)

      // if no keyword was found, set the picture to black
      // this saves a request to the google image search api
      if (keyword === 'black') {
        var blackImage = 'http://a.tile.stamen.com/toner/12/653/1583.png'
        $('#img').attr('src', blackImage)
        $('#text').text(speechText)

        // update results array
        results.push({
          keyword: keyword,
          speechText: speechText,
          imageLink: blackImage
        })
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
          $('#text').text(speechText)

          var newId = 'img-' + count

          img = '<img id=' + newId + ' src=' + imageLink + '>';
          $( ".thumbs" ).append( img );
          addToThumbnails(newId);
          count++;

          $('.sb-img').attr({
            src: imageLink,
            id: newId
          })
          

          // update results array
          results.push({
            keyword: keyword,
            speechText: speechText,
            imageLink: imageLink
          })
        })
        .fail(function(error) {
          console.log('error', error)
        })
      }
  }})
}

recognition.start();

//Center canvas function
(function() {
  var canvas = document.getElementById('meter')
  var context = canvas.getContext('2d')

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false)

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = 100

    /**
     * Your drawings need to be inside this function otherwise they will be reset when
     * you resize the browser window and the canvas goes will be cleared.
     */
     drawStuff()
   }
   resizeCanvas()

   function drawStuff() {
    // do your drawing stuff here
  }
})()
