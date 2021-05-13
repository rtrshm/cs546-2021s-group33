($ => {

    var openReview = $('#displayAddReview'),
        reviewDiv = $('#review'),
        reviewTitle = $('#reviewTitle'),
        reviewText = $('#addReview'),
        reviewForm = $('#addReviewForm'),
        reviewErrorText = $('#reviewErrorText'),
        gameId = $('#gameId').text(),
        reviewList = $('#reviewList');

    reviewDiv.hide();

    openReview.on("click", () => {
        reviewDiv.show();
        openReview.hide();
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
            url: `/games/addReview/${gameId}`,
            data: JSON.stringify(reviewObj)
        };

        // if review is added successfully, it's instantly rendered below other reviews (maybe needs changing?)
        $.ajax(requestConfig).then(response => {
            if (response)
                reviewList.append(renderReview(reviewObj));
            else reviewErrorText.append(`<p>Review could not be added successfully.</p>`)
        });
    });
})(window.jQuery);