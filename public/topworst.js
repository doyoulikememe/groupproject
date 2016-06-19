////Clicking on the Top Memes Tab from Nav Bar
$('.best').on('click', function() {
    event.preventDefault();
    console.log("you clicked best");
    $('.fivepics').removeClass('hidden');
    $('.images').addClass('hidden');
    $('.thumbs').addClass('hidden');
    $('.commentforms').addClass('hidden');
    $('h2').text("Top Memes");
});
////Clicking on the Worst Memes Tab from Nav Bar
$('.worst').on('click', function() {
    event.preventDefault();
    console.log("you clicked worst");
    $('.fivepics').removeClass('hidden');
    $('.images').addClass('hidden');
    $('.thumbs').addClass('hidden');
    $('.commentforms').addClass('hidden');
    $('h2').text("Worst Memes");
});
