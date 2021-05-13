($ => {
    let openReview = $('#displayAddReview'),
        reviewDiv = $('#review'),
        reviewTitle = $('reviewTitle'),
        reviewText = $('#addReview'),
        reviewForm = $('#addReviewForm'),
        reviewErrorText = $('#reviewErrorText'),
        gameId = $('#gameId').text(),
        reviewList = $('#reviewList');

    openReview.click(event => {
        openReview.hide();
        reviewDiv.show();
    });

    let renderReview = (review) => {
        let parent = $('<ul class="review"></ul>');
        parent.append($(`<li>${review.reviewTitle}`));
        parent.append($(`<li>${review.reivewTextContent}`));
        parent.append($(`<li>Rating: ${review.rating}`));
        parent.append($(`<li>Recommended: ${review.recommended ? "Yes" : "No"}</li>`));
        return parent;
    }

    reviewForm.submit(event => {

        let reviewObj = {};

        let titleTextContent = reviewTitle.val();
        if (!titleTextContent || titleTextContent.replace(/ +/, '') == "") {
            reviewErrorText.append($('<p>Please give your review a title!</p>'));
            return;
        }

        let reviewTextContent = reviewText.val();
        if (!reviewTextContent || reviewTextContent.replace(/ +/, '') == "") {
            reviewErrorText.append($('<p>Please add some text to your review!</p>'));
            return;
        }

        reviewObj.reviewContent = reviewTextContent;

        let recommended = $("input[name='recommended']:checked").val();
        let spoiler = $("input[name='spoiler']:checked").val();

        reviewObj.recommended = (recommended == "yes");
        reviewObj.spoiler = (spoiler == "yes");

        if (!gameId) {
            console.log ('gameId not found on page');
            return;
        }

        reviewObj.timestamp = Date.now();

        let requestConfig = {
            method: 'POST',
            url: `/game/addReview/${gameId}`,
            data: JSON.stringify(reviewObj)
        };

        // if review is added successfully, it's instantly rendered at the bottom of the page
        $.ajax(requestConfig).then(response => reviewList.append(renderReview(reviewObj)))
            // if the route rejects or fails, give some error text
            .reject(error => reviewErrorText.append($(`<p>Your review could not be added: ${error}</p>`)));            
    });

})(window.jQuery);