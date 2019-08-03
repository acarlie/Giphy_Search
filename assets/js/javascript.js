var app = {
    buttonCont: $('#buttons'),
    starred: [],
    buttons: ["star wars", "star trek", "battlestar galactica", "dr. who", "stranger things", "x-files"],
    button(text){
        var btnWrap = $('<div>').addClass('btn-wrap').appendTo(app.buttonCont);
        var btn = $('<button>').addClass('btn btn-search').text(text).appendTo(btnWrap);
        var close = $('<button>').addClass('fas fa-times btn btn-close').appendTo(btnWrap);
    },
    renderButtons(arr){
        $.each(arr, function(i){
            app.button(arr[i]);
        });
    },
    renderGif(obj, star, className){
        var card = $('<div>').addClass('card').prependTo('#results');
        var img = $('<img>').addClass('img').attr('src', obj.images.fixed_height_still.url).attr('data-still', obj.images.fixed_height_still.url).attr('data-gif', obj.images.fixed_height.url).appendTo(card);
        var list = $('<ul>').addClass('card-info').appendTo(card);
        var title = $('<li>').text('Title: ' + obj.title);
        var rating = $('<li>').text('Rating: ' + obj.rating);
        var star = $('<button>').addClass(className).addClass('btn btn-star fa-star').attr('data-id', obj.id).attr('data-star', star).appendTo(card);
        list.append(title, rating);

    },
    buttonClick(){
        var searchTerm = $(this).text().replace(' ', '%20');
        var queryUrl = 'https://api.giphy.com/v1/gifs/search?api_key=MhZnLZX3S3AQ3uqSWeeBpsJ8NXZXl54N&q=' + searchTerm + '&limit=15&offset=0&rating=PG&lang=en';

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            var results = response.data;
            $('#results').empty();
            $.each(results, function(i){
                app.renderGif(results[i], 'false', 'far');
                // console.log(results[i]);
            })
        });

    },
    imgClick(){
        var still = $(this).attr('data-still');
        var gif = $(this).attr('data-gif');
        var src = $(this).attr('src');

        if (src === still){
            $(this).attr('src', gif);
            $(this).parent().css('background-color', '#444');
        } else {
            $(this).attr('src', still);
            $(this).parent().css('background-color', '#222');
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
    close(){
        $(this).parent().remove();
    },
    clear(){
        event.preventDefault();
        $('#results').empty();
    },
    arrayRemove(arr, value) {
        return arr.filter(function(ele){
            return ele != value;
        });
    },
    star(){
        var id = $(this).attr('data-id');
        var starred = $(this).attr('data-star');

        if (starred === 'false'){
            $(this).attr('data-star', 'true').removeClass('far').addClass('fas');
            console.log('starred' + id);
            app.starred.push(id);

        } else {
            $(this).attr('data-star', 'false').removeClass('fas').addClass('far');
            console.log('not starred' + id);
            app.starred = app.arrayRemove(app.starred, id);

        }
        console.log(app.starred);
        console.log('--------------');
    },
    viewStarred(){
        event.preventDefault();
        if (app.starred.length > 0) {
            $('#results').empty();
            $.each(app.starred, function(i){
                var queryUrl = 'https://api.giphy.com/v1/gifs/' + app.starred[i] + '?api_key=MhZnLZX3S3AQ3uqSWeeBpsJ8NXZXl54N';
                console.log(queryUrl);
                $.ajax({
                    url: queryUrl,
                    method: "GET"
                }).then(function(response){
                    app.renderGif(response.data, 'true', 'fas');
                });

            });

        } else {
            $('#results').empty().html('<h2>No stars yet :-(</h2>');

        }
    }

}

$(document).ready(function(){
    app.renderButtons(app.buttons);

    $(document).on('click', '.btn-search', app.buttonClick);
    $(document).on('click', '.btn-close', app.close);
    $(document).on('click', '.btn-star', app.star)
    $(document).on('click', '.img', app.imgClick);
    
    $('#submit').on('click', app.submit);
    $('#starred').on('click', app.viewStarred);
    $('#clear').on('click', app.clear);
});
