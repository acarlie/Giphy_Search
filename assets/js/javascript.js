var search = {
    buttonCont: $('#buttons'),
    buttons: ["star wars", "star trek", "battlestar galactica", "dr. who", "stranger things", "x-files"],
    button(text){
        var btn = $('<button>').addClass('btn btn-search').text(text).appendTo(search.buttonCont);
    },
    renderButtons(arr){
        $.each(arr, function(i){
            search.button(arr[i]);
        });
    },
    buttonClick(){
        var searchTerm = $(this).text();
        console.log(searchTerm);
    },
    submit(){
        event.preventDefault();
        var val = $('#input').val().trim();
        search.button(val);

        $('#input').val('');
    }
}

search.renderButtons(search.buttons);

$(document).on('click', '.btn-search', search.buttonClick);
$('#submit').on('click', search.submit)