var triggerBtnFile = function(btn) {
    $(btn).on('click', function() {
        console.log(this);

        $(this).parents('form').find('.filehidden').trigger('click');

    });
}
$(document).ready(function() {
    triggerBtnFile('.btn-file');
    $('.clear-all').on('click', function() {
        var datas = []
        $('.posts-content .post-checkbox').each(function() {
            var check = $(this).prop("checked");
            if (check) {
                var data = $(this).data('post');
                datas.push(data);
            }

        })

        datas.toString();
        var updata = JSON.stringify({
            user: datas
        });
        $.ajax({
            url: "/delete/trung",
            type: 'POST',
            contentType: 'application/json',
            data: updata //stringify is important
                ,
            success: 'ok'
        });
        location.reload();

    });
});