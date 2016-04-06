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
  }})
}
recognition.start();