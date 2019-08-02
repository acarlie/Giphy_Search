var app = {
    buttonCont: $('#buttons'),
    buttons: ["star wars", "star trek", "battlestar galactica", "dr. who", "stranger things", "x-files"],
    button(text){
        var btn = $('<button>').addClass('btn btn-search').text(text).appendTo(app.buttonCont);
    },
    renderButtons(arr){
        $.each(arr, function(i){
            app.button(arr[i]);
        });
    },
    renderGif(obj){
        var card = $('<div>').addClass('card').prependTo('#results');
        var img = $('<img>').addClass('img').attr('src', obj.images.fixed_height_still.url).attr('data-still', obj.images.fixed_height_still.url).attr('data-gif', obj.images.fixed_height.url).appendTo(card);
    },
    buttonClick(){
        var searchTerm = $(this).text().replace(' ', '%20');
        var queryUrl = 'https://api.giphy.com/v1/gifs/search?api_key=MhZnLZX3S3AQ3uqSWeeBpsJ8NXZXl54N&q=' + searchTerm + '&limit=10&offset=0&rating=G&lang=en';

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            var results = response.data;
            $('#results').empty();
            $.each(results, function(i){
                app.renderGif(results[i]);
                console.log(results[i]);
            })
        });

    },
    imgClick(){
        var still = $(this).attr('data-still');
        var gif = $(this).attr('data-gif');
        var src = $(this).attr('src');

        if (src === still){
            $(this).attr('src', gif);
        } else {
            $(this).attr('src', still);
        }
    },
    submit(){
        event.preventDefault();
        var val = $('#input').val().trim();
        if (val !== ''){
            app.button(val);
            $('#input').val('');
        }
    },
    clear(){
        $('#results').empty();
    }
}
$(document).ready(function(){
    app.renderButtons(app.buttons);

    $(document).on('click', '.btn-search', app.buttonClick);
    $(document).on('click', '.img', app.imgClick);
    
    $('#submit').on('click', app.submit);
    $('#clear').on('click', app.clear);
});
