($ => {
    var gameId = $('#gameId').text();
    var requestConfig = {
        method: 'POST',
        url: '/games/generateSuggestions',
        data: {gameId}
    };

    $.ajax(requestConfig).then( response => {
        if (response.suggestions) 
            generateSuggestions(response.suggestions)
    })

    let generateSuggestions = suggestions => {
        var gameSuggestions = $('#gameSuggestions');
        gameSuggestions.append($('<p>You gave this game a positive review. You might like:</p>'));
        for (let game of suggestions) 
            gameSuggestions.append($(`<li><a href="/games/game/${game._id.toString()}">${game.title}</a></li>`));
        gameSuggestions.show();
    }
})(window.jQuery);