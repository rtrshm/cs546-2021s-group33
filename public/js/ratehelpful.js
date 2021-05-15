($ => {
    let rateHelpful = document.getElementsByClassName('rateHelpful')[0];
    let hiddenId = document.getElementsByClassName('hiddenId')[0];
    var requestConfig = {
        method: 'POST',
        url: '/games/hasRatedHelpful',
        data: { reviewId:hiddenId.innerHTML }
    };
    $.ajax(requestConfig).then(function(responseMessage) {
        rateHelpful.innerHTML = "Unmark review as helpful";
        if (!responseMessage.bool) {
            rateHelpful.innerHTML="Mark review as helpful";
        }
    });
    rateHelpful.addEventListener('click', (event) => {
        event.preventDefault();
        if (rateHelpful.innerHTML == "Unmark review as helpful") {
            var requestConfig = {
                method: 'POST',
                url: '/games/unrateHelpful',
                data: { reviewId:hiddenId.innerHTML }
            };
            $.ajax(requestConfig).then(function(responseMessage) {
                rateHelpful.innerHTML = "Mark review as helpful";
                if (!responseMessage.bool) {
                    rateHelpful.innerHTML="Unmark review as helpful";
                }
            });
        }
        else {
            var requestConfig = {
                method: 'POST',
                url: '/games/rateHelpful',
                data: {reviewId:hiddenId.innerHTML}
            };
            $.ajax(requestConfig).then(function(responseMessage) {
                rateHelpful.innerHTML = "Unmark review as helpful";
                if (!responseMessage.bool) {
                    rateHelpful.innerHTML="Mark review as helpful";
                }
            });
        }
    });
    })(window.jQuery);