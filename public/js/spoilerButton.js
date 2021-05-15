($ => {
    // attach handler to spoiler buttons
    $(".revealSpoiler").click(function() {
        $(this).hide();
        $(this).next().children().show();
    });
})(window.jQuery);