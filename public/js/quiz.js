/** Game schema
 *   const newGame = {
    title: title,
    img: img,
    dateReleased: dateReleased,
    genres: genres,
    developers: developers,
    publishers: publishers,
    averageRating: 0.0,
    numberOfReviews: 0,
    reviews: [],
    ageRating: ageRating,
    platforms: platforms,
    purchaseLinks: purchaseLinks,
  };
 */

($ => {
    let quizForm = $('#quizForm'),
        quizResult = $('#quizResult'),
        secondaryResults=$('#secondaryResults');

    quizResult.hide();

    let listResults = results => {
        if (results.length == 0) {
            quizResult.append($('<p>No matches were found!' + 
                ' This might be Artur\'s fault!</p>'));
        } else 
            quizResult.append(renderGame(results[0]));

        for (let game of results.slice(1)) 
            // links that will lead to each game
            secondaryResults.append(`<a href="/game/${game._id}"/>`);
    
        quizResult.show();
    }

    /**
     * Generates a div that displays a game
     * according to which attributes are present
     * 
     * Returns a <div> element with a list of fields
     */
    let renderGame = game => {
        let gameDiv = $('<div id="primaryResult"></div>');

        gameDiv.append($(`<img alt="No image found" src=${game.img} class="gameimage">`));
        
        let attrList = $('<dl></dl>');

        // go through all attributes of game and list them
        // depending on what type the attribute is
        for (let field of [
            ['Title', game.title],
            ['Date Released', game.dateReleased],
            ['Genres', game.genres],
            ['Developers', game.developers],
            ['Publishers', game.publishers],
            ['Average Rating', game.averageRating],
            ['Platforms', game.platforms],
            ['Purchase links', game.purchaseLinks]]) {
                if (field[1]) {
                    attrList.append($(`<dt>${field[0]}</dt>`));
                    let dd = $('<dd></dd>');

                    // if attribute is an array, display an itemized list
                    if (Array.isArray(field[1])) {
                        let uldd = $('<ul></ul>');
                        for (let entry of field[1]) 
                            uldd.append($(`<li>${entry}</li>`));
                        dd.append(uldd);
                        attrList.append(dd);

                    // otherwise, just display the item as string
                    } else {
                        dd.append(`${field[1]}`);
                        attrList.append(dd);
                    }
                }
            }
        gameDiv.append(attrList);
        return gameDiv;
        };

    quizForm.submit(event => {
        event.preventDefault();
        quizResult.hide();
        let genres = $.map($('input[type="radio"]:checked'), elem => {
            if ($(elem).val()) return $(elem).val()
        })
        let platforms = $.map($("input[name='platform']:checked"), elem => $(elem).val());
        let data = {genres, platforms};

        let requestConfig = {
            method: 'POST',
            url: '/games/quiz',
            dataType: 'json',
            data
        }

        $.ajax(requestConfig)
            .then(result => {
                quizForm.hide();
                listResults(result);
            });
    });

}
)(window.jQuery);