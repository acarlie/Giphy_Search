var app = {
    buttonCont: $('#buttons'),
    starred: [],
    starView: false,
    buttons: ["star wars", "star trek", "battlestar galactica", "dr. who", "stranger things", "x-files"],
    button(text){
        var btnWrap = $('<div>').addClass('wrap').prependTo(this.buttonCont);
        var btn = $('<button>').addClass('btn btn-search').text(text);
        var close = $('<button>').addClass('fas fa-times btn btn-right btn-close');
        
        btnWrap.append(btn, close)
    },
    renderButtons(arr){
        $.each(arr, function(i){
            app.button(arr[i]);
        });
    },
    renderCards(obj){
        var date = this.formatDate(obj.import_datetime);
        var starredIndex = this.starred.indexOf(obj.id);

        var cardWrap = $('<div>').addClass('card-wrap').prependTo('#results');
        var card = $('<div>').addClass('card bg-dark');
        var star = $('<button>').addClass('btn btn-star fa-star').attr('data-id', obj.id);

        var clickWrap = $('<div>').addClass('card-click');
        var imgWrap = $('<div>').addClass('img-wrap');
        var play = $('<div>').addClass('img-play').html('<span class="fas fa-play"></span>');
        var img = $('<img>').addClass('img').attr('src', obj.images.fixed_height_still.url).attr('data-still', obj.images.fixed_height_still.url).attr('data-gif', obj.images.fixed_height.url);
        var info = $('<p>').addClass('card-info');
        var date = $('<span>').text(date);
        var rating = $('<span>').text('Rating: ' + obj.rating.toUpperCase());
        
        var copyBtn = $('<button>').addClass('btn btn-copy').attr('data-link', obj.embed_url);
        var copyText = $('<span>').addClass('btn-copy-text').text('Copy Link');
        var copyIcon = $('<span>').addClass('fas fa-link btn-icon');

        if (starredIndex === -1){
            star.addClass('far').attr('data-star', 'false');
        } else {
            star.addClass('fas').attr('data-star', 'true');
        }
        
        copyBtn.append(copyText, copyIcon);
        info.append(rating, date);
        imgWrap.append(img, play);
        clickWrap.append(imgWrap, info);
        card.append(clickWrap);

        if (document.queryCommandSupported("copy")){
            card.append(copyBtn);
        }

        cardWrap.append(card, star);
    },
    getByTerm(term){
        var searchTerm = term.replace(' ', '%20');
        var queryUrl = 'https://api.giphy.com/v1/gifs/search?api_key=MhZnLZX3S3AQ3uqSWeeBpsJ8NXZXl54N&q=' + searchTerm + '&limit=15&offset=0&rating=PG&lang=en';

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response){
            var results = response.data;
            $('#results').empty();
            $.each(results, function(i){
                app.renderCards(results[i]);
            })
        });
    },
    buttonClick(){
        $('#message').empty();

        app.starView = false;
        var term = $(this).text();

        app.getByTerm(term);
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
        var btnText = $(this).children('.btn-copy-text');    

        var temp = $("<input>");
        $('body').append(temp);
        temp.val(link).select();
        document.execCommand("copy");
        temp.remove();

        btnText.text('Copied!');

        setTimeout(function(){
            btnText.text('Copy Link');
        }, 3000);

    },
    formatDate(date){
        var d = new Date(date);
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();

        return month + '/' + day + '/' + year;
    },
    search(){
        event.preventDefault();
        var val = $('#input').val().trim();
        if (val !== ''){
            app.button(val);
            $('#input').val('');
            app.getByTerm(val);
        }
    },
    delete(){
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
            app.starred.push(id);

        } else {
            if (app.starView){
                $(this).parent().remove();
                if (app.starred.length === 1){
                    $('#message').text('No more stars :-(');
                }
            } else {
                $(this).attr('data-star', 'false').removeClass('fas').addClass('far');
            }
            app.starred = app.arrayRemove(app.starred, id);
        }
    },
    viewStarred(){
        event.preventDefault();
        app.starView = true;

        if (app.starred.length > 0) {
            $('#results').empty();
            $.each(app.starred, function(i){
                var queryUrl = 'https://api.giphy.com/v1/gifs/' + app.starred[i] + '?api_key=MhZnLZX3S3AQ3uqSWeeBpsJ8NXZXl54N';
                $.ajax({
                    url: queryUrl,
                    method: "GET"
                }).then(function(response){
                    app.renderCards(response.data);
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
    $(document).on('click', '.btn-close', app.delete);
    $(document).on('click', '.btn-star', app.star)
    $(document).on('click', '.card-click', app.imgClick);
    $(document).on('click', '.btn-copy', app.copyToClipboard)
    
    $('#search').on('click', app.search);
    $('#starred').on('click', app.viewStarred);
    $('#clear').on('click', app.clear);
});
