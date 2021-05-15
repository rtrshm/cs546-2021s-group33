($ => {
    // attach handler to spoiler buttons
    $(".revealSpoiler").click(function() {
        $(this).hide();
        $(this).parent().next().children('.reviewPoints').show();
    });
})(window.jQuery);