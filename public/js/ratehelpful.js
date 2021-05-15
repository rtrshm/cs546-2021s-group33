($ => {
    let rateHelpful = document.getElementById('rateHelpful');
    let hiddenId = document.getElementById('hiddenId');
    var requestConfig = {
        method: 'POST',
        url: '/games/rateHelpful/',
        contentType: 'application/json',
        data: JSON.stringify({
            reviewId:hiddenId.innerHTML
        })
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
                url: '/games/unrateHelpful/',
                contentType: 'application/json',
                data: JSON.stringify({
                    reviewId:hiddenId.innerHTML
                })
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
                url: '/games/rateHelpful/',
                contentType: 'application/json',
                data: JSON.stringify({
                    reviewId:hiddenId.innerHTML
                })
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