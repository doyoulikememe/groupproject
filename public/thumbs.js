////This begins the click events for thumbs up and thumbs down. On the click of thumbs up, we post a 1 to the server data. On the click of thumbs down, we post a -1 to the server data. Also changes to random meme (new img src) on click of either thumbs up or thumbs down.
$('.thumbsup').on('click', function(event) {
    event.preventDefault();
///Random Meme Generator. Back end will have memes in their data, my array is for testing/////
    function randomMeme(anyMemes){
        var randomNumber= Math.random();
        var howManyMemes= anyMemes.length;
        var guessMeme= Math.floor(randomNumber * howManyMemes);
        return anyMemes[guessMeme];
      }
    document.getElementById("memeimage").src=randomMeme(imageurl);
    var element = event.currentTarget;
    element.clicks = (element.clicks || 0) + 1;
    console.log(element.clicks);
    // .getElementById(data.)
    var url = randomMeme(imageurl);
    console.log("This is the image url ", url);
    var thingToPost = {
            clicks: Number(1),
            meme: url
        }
    doYouLikeMeme.createClick(thingToPost)
});
$('.thumbsdown').on('click', function(event) {
    event.preventDefault();
    function randomMeme(anyMemes){
        var randomNumber= Math.random();
        var howManyMemes= anyMemes.length;
        var guessMeme= Math.floor(randomNumber * howManyMemes);
        return anyMemes[guessMeme];
      }
    document.getElementById("memeimage").src=randomMeme(imageurl);
    var element = event.currentTarget;
    // element.clicks = (element.clicks || 0) - 1;
    var total_clicks = element.clicks;
    var url = randomMeme(imageurl);
    console.log("This is the image url ", url);
    var thingToPost = {
        clicks: Number(-1),
        meme: url
    }
    doYouLikeMeme.createClick(thingToPost)
});
