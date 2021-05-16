($ => {

    $('.rateHelpful').each(function() {
        // get hidden id from next <li> entry
        var reviewId = $(this).parent().next().children().text();
        console.log(reviewId);
        var requestConfig = {
            method: 'POST',
            url: '/games/hasRatedHelpful',
            data: { reviewId }
        };
        var button = $(this)
        $.ajax(requestConfig).then(function(responseMessage) {
            console.log(responseMessage);
            button.text("Unmark review as helpful");
            if (!responseMessage.bool) {
                button.text("Mark review as helpful");
            }
        });
    })

    $('.rateHelpful').click(function(event) {
        event.preventDefault();
        var reviewId = $(this).parent().next().children().text(),
            button = $(this)
        if (button.text() == "Unmark review as helpful") {
            var requestConfig = {
                method: 'POST',
                url: '/games/unrateHelpful',
                data: { reviewId }
            };
            $.ajax(requestConfig).then(function(responseMessage) {
                button.text("Mark review as helpful");
                if (!responseMessage.bool) {
                    button.text("Unmark review as helpful");
                }
            });
        }
        else {
            var requestConfig = {
                method: 'POST',
                url: '/games/rateHelpful',
                data: {reviewId}
            };
            $.ajax(requestConfig).then(function(responseMessage) {
                button.text("Unmark review as helpful");
                if (!responseMessage.bool) 
                    button.text("Mark review as helpful");
            });
        }
    })
})(window.jQuery);