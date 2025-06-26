
var sliderEX00101;
var tabQuantity;
var tabExtraDistance;
var tab_length;
// var content_index = 1;
// var startSlide = 0;

var csObj = new Object();
csObj.horizontalScroll=true;

function slideSet() {
    /******************************************
     事前準備
     *******************************************/

    //タブボタンの数を取得
    tabQuantity = $('.tab_button-ex00101').length;
    //タブの長さとボディの長さの差分を取得
    tabExtraDistance = $('#tab_list-ex00101').width() - $('#tabContainer-ex00101').width();
    /******************************************
     スライダー発動
     *******************************************/
    var infiniteLoop = true;
    var touchEnabled = false;
    var slideMode    = 'fade';
    sliderEX00101 = $('#tab_contents-ex00101').bxSlider({
        pager:false,
        controls:false,
        adaptiveHeight: true,
        infiniteLoop: infiniteLoop,
        touchEnabled: touchEnabled,
        mode: slideMode,
        onSlideBefore: function($slideElement, oldIndex, newIndex){
            //スライドする時に関数を呼び出す。newIndexはスライダーの現在地。
            slideChangeEX00101(newIndex);
        }
    });
}

/******************************************
スライドする時に発動する関数。タブの表示調整を行う。
*******************************************/

function slideChangeEX00101(newIndex){
    //クラスを調整
    $('.tab_button-ex00101').removeClass('active');
    //newIndexに1ではなく2を足すのはメニューボタンをまたぐため
    $('#tab_list-ex00101 > li:nth-child(' + ( newIndex + 2 ) + ')').addClass('active');

    const tabContents = $('#tab_contents-ex00101>div');
    tabContents.removeClass('active');
    tabContents.eq(newIndex+1).addClass('active');

    //スクロールするべき距離を取得。タブ全体の長さ / ( タブの個数 - 1 ) * スライドの現在地
    var scrollDestination = ( tabExtraDistance / (tabQuantity - 1) ) * ( newIndex );

    //スクロール位置を調整
    $('#tabContainer-ex00101').animate({ scrollLeft: scrollDestination }, 'slow');
}

( function( $ ) {//タブボタンクリックで発動する関数
    $('.main-container_extracts').on('click','.tab_button-ex00101', function(e) {
        //何番目の要素かを取ってスライドを移動する
        var nth = $('.tab_button-ex00101').index(this);

        sliderEX00101.goToSlide(nth);

        //クリックイベントを無効化
        e.preventDefault();
    });
} )( jQuery );

( function( $ ) {//pagetop
    var pagetop = $('.pagetop');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            pagetop.fadeIn();
        } else {
            pagetop.fadeOut();
        }
    });
    pagetop.click(function () {
        $('body, html').animate({ scrollTop: 0 }, 500);
        return false;
    });
} )( jQuery );


( function( $ ) {//入力モード切替
    $('.mode_select .input_mode a').on('click', function(e) {
        $('.mode_select').css('display', 'none');
        $('.mode_barcode').css('display', 'block');

        //クリックイベントを無効化
        e.preventDefault();

    });

    $('.mode_barcode .input_mode a').on('click', function(e) {
        $('.mode_barcode').css('display', 'none');
        $('.mode_select').css('display', 'block');

        //クリックイベントを無効化
        e.preventDefault();

    });
} )( jQuery );

function unchecked() {
	$('#filter_box input[type="checkbox"]').prop('checked', false);
}