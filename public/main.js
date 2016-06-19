$(document).ready(function() {
    doYouLikeMeme.init();
})

var doYouLikeMeme = {
    url: 'http://tiny-tiny.herokuapp.com/collections/doyoulikememe',
    urlmemes: 'http://tiny-tiny.herokuapp.com/collections/doyoulikememevotes',
    comments: [],
    thumbclicks: [],
    init: function() {
        doYouLikeMeme.styling();
        doYouLikeMeme.events();
    },
    styling: function() {
        doYouLikeMeme.getPost();
    },
    events: function() {
        //New Comment
        $('form').submit(function() {
                event.preventDefault();
                if ($('input').val() !== '') {
                    var input_value = $(this).find('.messageval').val();
                    var user_value = $(this).find('.usernameval').val();
                    var thingToCreate = {
                        text: input_value,
                        author: user_value
                    }
                    doYouLikeMeme.createPost(thingToCreate)
                    $('.comments').append(`<li>${user_value}${input_value}<a href=""> x</a></li>`);
                };
                $('input').val('');
                return false;
            })
            // delete comment
        $('.deletebutton').on('click', function(element) {
            event.preventDefault();
            var commentId = $(this).parent().data('id'); ////id needs to point to id of comment
            console.log("ID", commentId)
            window.glob = $(this);
            $(this).parent().remove();
            doYouLikeMeme.deletePost(commentId);
        });

        ////editing a comment
        var newLiVal;
        $("ul").on('dblclick', 'li', function() {
            newLiVal = $(this).text();
            $(this).text("");
            $("<input type='text'"+ $(this).data('id') + "'>").appendTo(this).focus();
        });
        $("ul").on('focusout', 'li > input', function() {
            var $this = $(this);
            var newLiVal = $this.val()
            $this.text($this.val());
            $(this).parent().text($this.val()).append('<a href=""> ✓</a>');
            $this.remove();
            doYouLikeMeme.editPost({
                text: newLiVal,
                id: $this.data('id')
            })
        });
        $('.best').on('click', function() {
            event.preventDefault();
            console.log("you clicked best");
            $('.fivepics').removeClass('hidden');
            $('.images').addClass('hidden');
            $('.thumbs').addClass('hidden');
            $('.commentforms').addClass('hidden');
            $('h2').text("Top Memes");
        });
        $('.worst').on('click', function() {
            event.preventDefault();
            console.log("you clicked worst");
            $('.fivepics').removeClass('hidden');
            $('.images').addClass('hidden');
            $('.thumbs').addClass('hidden');
            $('.commentforms').addClass('hidden');
            $('h2').text("Worst Memes");

        });
        //////Reload the page when clicking on the header. This is to return to the homescreen when on "top memes" or "worst memes" page//
        $('.top').on('click', function (){
          event.preventDefault();
          window.location.reload();
        })
        ////This begins the click events for thumbs up and thumbs down. On the click of thumbs up, we post a 1 to the server data. On the click of thumbs down, we post a -1 to the server data.
        $('.thumbsup').on('click', function(event) {
            event.preventDefault();
            var imageurl = ['images/hide.png', 'images/sleep.png', 'images/baby.png', 'images/codeworks.png', 'images/front.png', ];
            ///looop to get random image
            console.log(imageurl[3]);
            document.getElementById("memeimage").src="images/sleep.png";////replace image with image from array ie imageurl[2]

            var element = event.currentTarget;
            element.clicks = (element.clicks || 0) + 1;
            console.log(element.clicks);
            // .getElementById(data.)
            var thingToPost = {
                    clicks: Number(1),
                    // meme: imageurl
                }
            doYouLikeMeme.createClick(thingToPost)
        });
        $('.thumbsdown').on('click', function(event) {
            event.preventDefault();
            var element = event.currentTarget;
            // element.clicks = (element.clicks || 0) - 1;
            var total_clicks = element.clicks;
            var thingToPost = {
                clicks: Number(-1)
            }
            doYouLikeMeme.createClick(thingToPost)
        });


        /////getting images off of the page1image
        var img = document.getElementsByTagName('img');
        var image = img; /////this returns an array of images
        console.log(image[1]); /////this returns the second image in the array
    },

    ///begin ajax

    createPost: function(thingCommented) {
        $.ajax({
            url: doYouLikeMeme.url,
            method: "POST",
            data: thingCommented,
            success: function(data) {
                console.log("works", data);
                // doYouLikeMeme.create(JSON.stringify(thingCommented));
                doYouLikeMeme.comments.push(data);
                doYouLikeMeme.getPost();
            },
            error: function(err) {
                console.error("OH CRAP", err);
            }
        })
    },
    createClick: function(thingClicked) {
        $.ajax({
            url: doYouLikeMeme.urlmemes,
            method: "POST",
            data: thingClicked,
            success: function(data) {
                console.log("works", data);
                doYouLikeMeme.thumbclicks.push(data);
                doYouLikeMeme.getPost();
            },
            error: function(err) {
                console.error("OH CRAP", err);
            }
        })
    },
// data-id="${element.id}" ///from line153 after li
    getPost: function() {
        $.ajax({
            url: doYouLikeMeme.url,
            method: "GET",
            success: function(data) {
                 console.log("WE GOT SOMETHING", data);
                // data = JSON.parse(data);
                $(".totalcomments").find('h5').text("Total Comments: " + data.length); ///num of list items
                $('.comments').html("");
                console.log("help", data);
                data.forEach(function(element, idx) {
                    console.log("this is the author",element.author);
                    var toDoStr = `<li > ${element.author}: ${element.text}<a href=""> x</a></li>`
                    $('.comments').append(toDoStr)
                    doYouLikeMeme.comments.push(element);
                });
            },
            error: function(err) {
                console.error("ugh", err);
            }
        })
    },
    getClick: function() {
        $.ajax({
            url: doYouLikeMeme.urlmemes,
            method: "GET",
            success: function(data) {
                console.log("WE GOT SOMETHING", data);
                doYouLikeMeme.thumbclicks.push('');
            },
            error: function(err) {
                console.error("ugh", err);
            }
        })
    },
    deletePost: function(commentId) {
        var DeletePost = doYouLikeMeme.url + "/" + commentId;
        $.ajax({
            url: DeletePost,
            method: "DELETE",
            success: function(data) {
                console.log("WE DELETED SOMETHING", data);
                doYouLikeMeme.getPost();

            },
            error: function(err) {
                console.error("ugh", err);
            }
        })
    },

    editPost: function(thingToEdit) {
        console.log("THING TO EDIT", thingToEdit);
        $.ajax({
            url: doYouLikeMeme.url + "/" + thingToEdit.id,
            method: "PUT",
            data: thingToEdit,
            success: function(data) {
                console.log("edited!!!!!", data)
                doYouLikeMeme.getPost();
            },
            error: function(err) {
                console.error("OH CRAP", err);
            }
        })
    },


};




// var memes {
//
//  memename: $(img).data('id')
//  upvote: 1,
//  downvote: 0
// }

////update data


// $('img')[0].src = "http://www.fillmurray.com/200/300"
