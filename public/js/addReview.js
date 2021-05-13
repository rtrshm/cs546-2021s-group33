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

        let requestConfig = {
            method: 'POST',
            url: `/game/addReview/${gameId}`,
            data: JSON.stringify(reviewObj)
        };

        $.ajax(requestConfig).then(response => {
            if (response) {
                // TODO: render review on page after request is successful
            }
        });
    });

})(window.jQuery)