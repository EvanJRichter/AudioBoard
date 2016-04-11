var imageSearchBaseURL = 'https://www.googleapis.com/customsearch/v1'
var cx = '009967352923164700190:bh01lm5iclm'
var apiKey = 'AIzaSyAe2MVdSPyvFehxCdGvrrp98VIL5KeMC_A'

// used for generating unique ids for pictures/thumbnails on waveform
var count = 0

// all the results from the audio stream
// constains objects with the keyword, speechText, and imageLink for each phrase
var results = []

/**
 * Stores the image link for the given keyword in localstorage
 * Saves requests to the google search api and should load faster
 * @param {String} keyword   [keyword/key for cache]
 * @param {String} imageLink [link to picture for given keyword/value for cache]
 */
function setCache(keyword, imageLink) {
  var cache = JSON.parse(localStorage.getItem('cache'))
  cache[keyword] = imageLink
  localStorage.setItem('cache', JSON.stringify(cache))
}

/**
 * Retrieves the image link for the given keyword
 * @param  {String} keyword [keyword/key for cache]
 * @return {String}         [link to picture for given keyword/value for cache]
 */
function getCache(keyword) {
  var cache = JSON.parse(localStorage.getItem('cache'))
  return cache[keyword]
}

/**
 * Creates and appends a thumbnail to the waveform
 * @param  {String} newId     [id for the img tag]
 * @param  {String} imageLink [link to picture]
 */
function createThumbnail(newId, imageLink) {
  var $thumbnail = $('<img />', {
    id: newId,
    src: imageLink
  })
  $('.thumbs').append($thumbnail)
  addToThumbnails(newId)
}

/**
 * Updates the current live view with the new phrase and image
 * @param  {String} speechText [a phrase detected from the user]
 * @param  {String} imageLink  [link to picture for the given speechText/keyword]
 */
function updateCurrentView(speechText, imageLink) {
  $('#text').text(speechText)
  $('.sb-img').attr('src', imageLink)
}

// initialize cache if it doesn't already exist
if (!localStorage.getItem('cache')) {
  localStorage.setItem('cache', JSON.stringify({}))
}

// set the default black image for the keyword 'black'
// (what's returned from TextBlob if no keyword is found)
setCache('black', 'http://a.tile.stamen.com/toner/12/653/1583.png')

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

      var cachedImageLink = getCache(keyword)
      var newId = 'img-' + count

      if (cachedImageLink) {
        updateCurrentView(speechText, cachedImageLink)
        createThumbnail(newId, cachedImageLink)
        count++
        results.push({
          keyword: keyword,
          speechText: speechText,
          imageLink: cachedImageLink
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
          updateCurrentView(speechText, imageLink)
          createThumbnail(newId, imageLink)
          count++
          setCache(keyword, imageLink)
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


//--------  button functions ----------- //

$(document).ready(function() {
  //$( "#recording" ).hide();
  $( "#recording" ).css("visibility", "hidden");

  initFancyBox();

  $( "#start" ).click(function() {
    recognition.start();
    $( this ).hide();
    $( "#recording" ).css("visibility", "visible");
  });

  $( "#stop" ).click(function() {
    recognition.continuous = false
    recognition.stop();
    timeline(results);

    //show other stuff, hide original stuff
    console.log("done!");
    console.log('results:', results)

    $(  "#recording" ).hide();
    $("#btns").removeClass("hide");
    $("#collage-btn").click(function() {
        $(".Collage").removeClass("hide");
          collage();
          $('.Collage').collageCaption();
    })
    $("#timeline-btn").click(function() {
        $(".Collage").addClass("hide");
    })
  });
});


//--------  collagePlus javascript functions ----------- //

    // Here we apply the actual CollagePlus plugin
    function collage() {
        console.log("collage");
        $('.Collage').removeWhitespace().collagePlus(
            {
                'fadeSpeed'     : 2000,
                'targetHeight'  : 200
            }
        );
    };

    // This is just for the case that the browser window is resized
    var resizeTimer = null;
    $(window).bind('resize', function() {
        // hide all the images until we resize them
        $('.Collage .Image_Wrapper').css("opacity", 0);
        // set a timer to re-apply the plugin
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(collage, 200);
    });


//--------  Center canvas function ----------- //

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


//--------  Timeline javascript functions ----------- //


// All images need to be loaded for this plugin to work so
    // we end up waiting for the whole window to load in this example

  function initFancyBox() {
    $(".fancybox").fancybox({
        maxWidth: 800,
        nextSpeed: 200,
        nextEffect: 'fade',
        prevEffect: 'fade',
        helpers: {
          thumbs: {
            width: 50,
            height: 50
          }
        }
      });
  }

    // Here we apply the actual CollagePlus plugin
  function timeline(results) {
    if (results.length == 0)
      return

    $('#timeline-btn').attr("href", results[0].imageLink)
    $('#timeline-btn').attr("title", results[0].speechText)

    var text = "";
    for (i=1; i < results.length; i++) {
      text += "<a class=\"fancybox\" href=" + results[i].imageLink + " rel=\"timeline_gallery\" title=" + results[i].speechText + "></a>";
    }
    console.log(text);

    $('.Timeline').html(text)
  };




