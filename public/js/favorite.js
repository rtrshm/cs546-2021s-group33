($ => {
    let hiddenGameId = document.getElementById('gameId');
    let addFavorite = document.getElementById('addFavorite');
    var requestConfig = {
        method: 'POST',
        url: '/games/hasFavorited/',
        contentType: 'application/json',
        data: JSON.stringify({
            gameId:hiddenGameId.innerHTML
        })
    };
    $.ajax(requestConfig).then(function(responseMessage) {
        addFavorite.innerHTML = "Remove from favorites";
        if (!responseMessage.bool) {
            console.log('reaching addfavorite')
            addFavorite.innerHTML="Add to favorites";
        }
    });
    addFavorite.addEventListener('click', (event) => {
        event.preventDefault();
        if (addFavorite.innerHTML == "Remove from favorites") {
            var requestConfig = {
                method: 'POST',
                url: '/games/unfavorite/',
                contentType: 'application/json',
                data: JSON.stringify({
                    gameId:hiddenGameId.innerHTML
                })
            };
            $.ajax(requestConfig).then(function(responseMessage) {
                addFavorite.innerHTML = "Add to favorites";
                if (!responseMessage.bool) {
                    addFavorite.innerHTML="Remove from favorites";
                }
            });
        }
        else {
            var requestConfig = {
                method: 'POST',
                url: '/games/favorite/',
                contentType: 'application/json',
                data: JSON.stringify({
                    gameId:hiddenGameId.innerHTML
                })
            };
            $.ajax(requestConfig).then(function(responseMessage) {
                addFavorite.innerHTML = "Remove from favorites";
                if (!responseMessage.bool) {
                    addFavorite.innerHTML="Add to favorites";
                }
            });
        }
    });
    })(window.jQuery);