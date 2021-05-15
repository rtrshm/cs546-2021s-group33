($ => {
    // attach handler to spoiler buttons
    $(".revealSpoiler").click(function() {
        $(this).hide();
        $(this).next().next().show();
    });
})(window.jQuery);