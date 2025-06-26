//スマホのみTELをリンクにする
if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)) {
    $(function() {
        $('.tel').each(function() {
            let str = $(this).html();
            $(this).html($('<a>').attr('href', 'tel:' + $(this).text().replace(/-/g, '')).append(str + '</a>'));
        });
    });
}

// pagetop
$(function () {
    $("#pagetop").hide();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#pagetop').fadeIn();
        } else {
            $('#pagetop').fadeOut();
        }
    });
    $('#pagetop span').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
});

// ios のみclass追加
$(document).ready(function() {
    if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0) {
        $('.webWrapper').addClass('webWrapper_i');
    }
});

// クーポン・メニューの開閉
$(document).ready(function() {
    let flag = "open";
    $(".webConfirm_select_title").click(function(){
        $("#webConfirm_select_menu").slideToggle();
        if(flag === "close"){
            $('.webConfirm_titleOp').css('display', 'block');
            $('.webConfirm_titleCl').css('display', 'none');
            flag = "open";
        }else{
            $('.webConfirm_titleOp').css('display', 'none');
            $('.webConfirm_titleCl').css('display', 'block');
            flag = "close";
        }
    });
});

//モーダル
$(document).ready(function(){
    $('.modal_open').click(function () {
        $('.modal').hide();
        
        let modal = '#' + $(this).attr('data-target');
        $(modal).fadeIn('slow');
        
        let modal_wrap = $(modal).parent('.modal_wrap');
        let modal_bg = $(modal_wrap).prev('.modal_bg');
        
        $(modal_wrap).css('display', 'flex');
        $(modal_bg).show();
        
        return false;
    });
    $('.modal_close, .modal_wrap').unbind().click(function(){
        $('.modal_bg , .modal_wrap').fadeOut(500);
        return false;
    });
    $('.modal').click(function (event) {
        event.stopPropagation();
    });
});

//スタッフ名など各段の高さを合わせる
function equalBoxHeight(elm, num) {
    $(elm).each(function (i) {
        let height;
        let $this = $(this);
        if (i === 0 || i % num === 0) {
            height = $this.height();
            for (let n = i + 1; n <= i + num - 1; n++) {
                if (height < $(elm).eq(n).height()) {
                    height = $(elm).eq(n).height();
                }
            }
            for (let n = i; n <= i + num - 1; n++) {
                $(elm).eq(n).css("height", height + "px");
            }
        }
    });
}

//POSでは廃止になったJavaScriptでのバリデーションエラー表示用の関数
let webReserveErrorFunction = {
    onError: function(data, options, prefix) {
        let errorPositions = { };
        if ( options && options.errorPositions && $.isPlainObject(options.errorPositions)) {
            errorPositions = options.errorPositions;
        }
        let chainErrorForm = { };
        if ( options && options.chainErrorForm && $.isPlainObject(options.chainErrorForm)) {
            chainErrorForm = options.chainErrorForm;
        }
        if (!prefix) {
            prefix = '';
        }
        $.each(data, function(field, errors) {
            field = prefix + field;
            let isTailCall = false;
            const element = $("#" + field.replace(/_/g, '-'));
            $.each(errors, function(kind, text) {
                if ($.isPlainObject(text)) {
                    if (isNaN(kind)) {
                        let nestData = {};
                        nestData[kind] = text;
                        // belongsTo
                        webReserveErrorFunction.onError(nestData, options, field + '-');
                    } else {
                        // hasMany
                        webReserveErrorFunction.onError(text, options, field + '-' + kind + '-');
                    }
                } else {
                    let targetSelector = element;
                    if (field in errorPositions) {
                        targetSelector = $(errorPositions[field]);
                    }
                    const _insert = $(document.createElement('div')).insertAfter(targetSelector);
                    _insert.addClass('error-message').html(text);
                    isTailCall = true;

                    if (field in chainErrorForm) {
                        if (kind in chainErrorForm[field]) {
                            const selector = chainErrorForm[field][kind];
                            $(selector).addClass('form-error');
                        }
                    }
                }
            });
            if (isTailCall) {
                element.addClass('form-error');
            }
        });
        const errorElement = $('.form-error:first');
        if ( errorElement.length > 0 ) {
            const position = errorElement.offset().top - 50;
            $('html,body').animate({scrollTop: position}, 0);
        }
    },
    errorClear: function(container) {
        $target = $((container ? '#'+container+' .form-error' : '.form-error'));
        if ( $target ) $target.removeClass('form-error');
        $target = $((container ? '#'+container+' .error-message' : '.error-message'));
        if ( $target )$target.remove();
    },
};
