var app = {
    buttonCont: $('#buttons'),
    starred: [],
    starView: false,
    buttons: ["star wars", "star trek", "battlestar galactica", "dr. who", "stranger things", "x-files"],
    button(text){
        var btnWrap = $('<div>').addClass('wrap').appendTo(app.buttonCont);
        var btn = $('<button>').addClass('btn btn-search').text(text).appendTo(btnWrap);
        var close = $('<button>').addClass('fas fa-times btn btn-right btn-close').appendTo(btnWrap);
    },
    renderButtons(arr){
        $.each(arr, function(i){
            app.button(arr[i]);
        });
    },
    renderGif(obj){
        var starredIndex = app.starred.indexOf(obj.id);
        var cardWrap = $('<div>').addClass('card-wrap').prependTo('#results');
        var card = $('<div>').addClass('card bg-dark').appendTo(cardWrap);
        var clickWrap = $('<div>').addClass('card-click').appendTo(card);
        var img = $('<img>').addClass('img').attr('src', obj.images.fixed_height_still.url).attr('data-still', obj.images.fixed_height_still.url).attr('data-gif', obj.images.fixed_height.url).appendTo(clickWrap);
        var list = $('<ul>').addClass('card-info').appendTo(clickWrap);
        var title = $('<li>').text('Title: ' + obj.title);
        var rating = $('<li>').text('Rating: ' + obj.rating);
        var star = $('<button>').addClass('btn btn-star fa-star').attr('data-id', obj.id);
        var copyBtn = $('<button>').addClass('btn btn-copy').text('Copy Link').attr('data-link', obj.embed_url).appendTo(card);
        var copyIcon = $('<span>').addClass('fas fa-link btn-icon').appendTo(copyBtn);


        if (starredIndex === -1){
            star.addClass('far').attr('data-star', 'false');
        } else {
            star.addClass('fas').attr('data-star', 'true');
        }
        
        list.append(title, rating);
        cardWrap.append(star);
    },
    buttonClick(){
        $('#message').empty();

        app.starView = false;
        var searchTerm = $(this).text().replace(' ', '%20');
        var queryUrl = 'https://api.giphy.com/v1/gifs/search?api_key=MhZnLZX3S3AQ3uqSWeeBpsJ8NXZXl54N&q=' + searchTerm + '&limit=15&offset=0&rating=PG&lang=en';

        
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            var results = response.data;
            $('#results').empty();
            $.each(results, function(i){
                app.renderGif(results[i]);
                // console.log(results[i]);

            })
            // ScrollReveal().reveal('.card', { delay: 500 });
        });


    },
    imgClick(){
        var card = $(this);

        card.parent().parent().addClass('hvr-pop')
        
        setTimeout(function(){
            card.parent().parent().removeClass('hvr-pop');
        }, 200);

        var img = card.find('img');
        var still = img.attr('data-still');
        var gif = img.attr('data-gif');
        var src = img.attr('src');

        if (src === still){
            img.attr('src', gif);
            card.parent().removeClass('bg-dark').addClass('bg-light');
        } else {
            img.attr('src', still);
            card.parent().removeClass('bg-light').addClass('bg-dark');
        }


    },
    copyToClipboard(){
        var link = $(this).attr('data-link');
    

        if (document.queryCommandSupported("copy")) {
            var temp = $("<input>");
            $('body').append(temp);
            temp.val(link).select();
            document.execCommand("copy");
            temp.remove();
            // console.log(link);
        } else {
            //modal with link Url
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
        $('#message').empty();
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
            if (app.starView){
                $(this).parent().remove();
                if (app.starred.length === 1){
                    $('#message').text('No more stars :-(');
                }
            } else {
                $(this).attr('data-star', 'false').removeClass('fas').addClass('far');
                console.log('not starred' + id);
            }
            app.starred = app.arrayRemove(app.starred, id);
        }
        console.log(app.starred);
        console.log('--------------');
    },
    viewStarred(){
        event.preventDefault();
        app.starView = true;

        if (app.starred.length > 0) {
            $('#results').empty();
            $.each(app.starred, function(i){
                var queryUrl = 'https://api.giphy.com/v1/gifs/' + app.starred[i] + '?api_key=MhZnLZX3S3AQ3uqSWeeBpsJ8NXZXl54N';
                console.log(queryUrl);
                $.ajax({
                    url: queryUrl,
                    method: "GET"
                }).then(function(response){
                    app.renderGif(response.data);
                });

            });

        } else {
            $('#results').empty();
            $('#message').text('No stars yet :-(');
        }
    }
}


$(document).ready(function(){
    app.renderButtons(app.buttons);

    $(document).on('click', '.btn-search', app.buttonClick);
    $(document).on('click', '.btn-close', app.close);
    $(document).on('click', '.btn-star', app.star)
    $(document).on('click', '.card-click', app.imgClick);
    $(document).on('click', '.btn-copy', app.copyToClipboard)
    
    $('#submit').on('click', app.submit);
    $('#starred').on('click', app.viewStarred);
    $('#clear').on('click', app.clear);
});
