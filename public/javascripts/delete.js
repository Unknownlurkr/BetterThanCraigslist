$(document).ready(function () {
    $('.deleteForm').on('submit', function (e) {
        var currentForm = $(this).parent().parent();
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/delete/' + $(this).attr('id'),
            success: function (data) {
                currentForm.fadeOut();
                setTimeout(function () {
                    alert(data.success);
                }, 3000);
            }
        });
    });
});