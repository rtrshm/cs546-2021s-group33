($ => {
    // attach handler to spoiler buttons
    $(".revealSpoiler").click(function() {
        $(this).hide();
        $(this).siblings(".reviewPoints").show()
    });
})(window.jQuery);