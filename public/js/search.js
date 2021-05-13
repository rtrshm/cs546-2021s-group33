($ => {
    let myGame = document.getElementById('title');
    let myForm = document.getElementById('game-search');
    let err = document.getElementById('error');
    
    myForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let game = myGame.value;
        if (!game || typeof(game) !== "string" || game.trim().length == 0) {
            err.innerHTML = "No game provided or game is not a valid string.";
            myGame.focus();
            return;
        }
    
        var requestConfig = {
            method: 'POST',
            url: '/games/exists',
            contentType: 'application/json',
            data: JSON.stringify({
                title : game,
            })
        };
        
        $.ajax(requestConfig).then(function(responseMessage) {
            //console.log(responseMessage);
            if (!responseMessage.bool){
                err.innerHTML = "No results were found.";
                myGame.focus();
                return;
            }
            document.search.submit();            
        }
        );

      });
})(window.jQuery);