"use strict";
function createFlashMsg(message, state = "primary") {
    const alertClass = `alert-${state}`;
    const flashMessage = $('<div></div>')
        .addClass('flash-message alert d-flex justify-content-between align-items-center')
        .addClass(alertClass) //
        .attr('role', 'alert')
        .text(message);
    // Close Button
    const closeButton = $('<button></button>').attr({
        type: 'button',
        'aria-label': 'Close'
    }).addClass('close alert-close-btn-lg').click(function () {
        flashMessage.fadeOut(500, function () {
            $(this).remove(); // fadeOut 완료 후 요소 제거
        });
    });
    const closeIcon = $('<span></span>').attr('aria-hidden', 'true').html('&times;');
    closeButton.append(closeIcon);
    flashMessage.append(closeButton);
    return flashMessage;
}
