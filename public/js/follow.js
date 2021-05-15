($ => {
    let followUser = document.getElementById('followUser');
    let hiddenName = document.getElementById('hiddenName');
    var requestConfig = {
        method: 'POST',
        url: '/following/isFollowing/',
        contentType: 'application/json',
        data: JSON.stringify({
            followedUser:hiddenName.innerHTML
        })
    };
    $.ajax(requestConfig).then(function(responseMessage) {
        followUser.innerHTML = "Unfollow";
        if (!responseMessage.bool) {
            followUser.innerHTML="Follow";
        }
    });
    followUser.addEventListener('click', (event) => {
        event.preventDefault();
        if (followUser.innerHTML == "Unfollow") {
            var requestConfig = {
                method: 'POST',
                url: '/following/unfollow/',
                contentType: 'application/json',
                data: JSON.stringify({
                    followedUser:hiddenName.innerHTML
                })
            };
            $.ajax(requestConfig).then(function(responseMessage) {
                followUser.innerHTML = "Follow";
                if (!responseMessage.bool) {
                    followUser.innerHTML="Unfollow";
                }
            });
        }
        else {
            var requestConfig = {
                method: 'POST',
                url: '/following/follow/',
                contentType: 'application/json',
                data: JSON.stringify({
                    followedUser:hiddenName.innerHTML
                })
            };
            $.ajax(requestConfig).then(function(responseMessage) {
                followUser.innerHTML = "Unfollow";
                if (!responseMessage.bool) {
                    followUser.innerHTML="Follow";
                }
            });
        }
    });
    })(window.jQuery);