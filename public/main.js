$(document).ready(function() {
    doYouLikeMeme.init();
})

var doYouLikeMeme = {
////Need to insert links for back end /comment /meme. tiny tiny for testing
    url: 'http://tiny-tiny.herokuapp.com/collections/doyoulikememe',
    urlmemes: 'http://tiny-tiny.herokuapp.com/collections/doyoulikememevotes',
// FOR BACK END
//     url: '/comment',
//     urlmemes: '/meme',
    comments: [],
    thumbclicks: [],
    meme: [],
    init: function() {
        doYouLikeMeme.styling();
        doYouLikeMeme.events();
    },
    styling: function() {
        doYouLikeMeme.getPost();
    },
    events: function() {
        //Creating a New Comment on Meme. Appends author:text
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
                    $('.comments').append(`<li>${user_value}${input_value}<a href="">     (delete)</a></li>`);
                };
                $('input').val('');
                return false;
            })
        // Delete Comment From a Meme
        $('.comments').on('click', 'a', function (element) {
          event.preventDefault();
          var commentId = $(this).parent().data('id');
          console.log("ID", commentId)
          window.glob = $(this);
          $(this).parent().remove();
          doYouLikeMeme.deletePost(commentId);
        });
        ////Editing a Comment. Double click and 'enter' key to edit.
        var newLiVal;
        $("ul").on('dblclick', 'li', function() {
            newLiVal = $(this).text();
            $(this).text("");
            $("<input type='text' data-id='"+ $(this).data('id') + "'>").appendTo(this).focus();
        });
        $("ul").on('focusout', 'li > input', function() {
            var $this = $(this);
            var newLiVal = $this.val()
            $this.text($this.val());
            $(this).parent().text($this.val()).append('<a href="">     (delete)</a>');
            $this.remove();
            doYouLikeMeme.editPost({
                text: newLiVal,
                id: $this.data('id')
            })
        });
        //////Reload the page when clicking on the header. This is to return to the homescreen when on "top memes" or "worst memes" page//
        $('.top').on('click', function (){
          event.preventDefault();
          window.location.reload();
        })
    },
    ///Begin GET, POST, DELETE, PUT
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
                doYouLikeMeme.thumbclicks.meme.push(data);
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
                console.log("data", data);
                data.forEach(function(element, idx) {
                    // console.log("this is the author",element.author);
                    var toDoStr = `<li data-id="${element._id}"> ${element.author}: ${element.text}<a href="">      (delete)</a></li>`
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
                doYouLikeMeme.thumbclicks.meme.push('');
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
