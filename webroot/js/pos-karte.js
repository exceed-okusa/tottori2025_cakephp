
var slider;
var tabQuantity;
var tabExtraDistance;
var itemslider;
var itemtabQuantity;
var itemtabExtraDistance;
var tab_length;
var startSlide = 0;

var csObj = new Object();
csObj.horizontalScroll=true;

(function($){
    $(window).on("load",function(){
        // $(".scrollbar_content").mCustomScrollbar();
    });
})(jQuery);

/******************************************
 スライドする時に発動する関数。タブの表示調整を行う。
 *******************************************/

function slideChange(newIndex){

    //クラスを調整
    $('.tab_button-ef00201').removeClass('active');
    $('.tab_list-ef00201 > li:nth-child(' + ( newIndex + 1 ) + ')').addClass('active');

    $('#tab_contents-ef00201>div').removeClass('active');
    $('#tab_contents-ef00201>div').eq(newIndex).addClass('active');

    //スクロールするべき距離を取得。タブ全体の長さ / ( タブの個数 - 1 ) * スライドの現在地
    var scrollDestination = ( tabExtraDistance / (tabQuantity - 1) ) * ( newIndex );

    //スクロール位置を調整
    $('.tabContainer-ef00201').animate({ scrollLeft: scrollDestination }, 'slow');

}

function itemslideChange(newIndex){

    //クラスを調整
    // $('#colorbox .large_classification_tab').removeClass('active');
    // $('#colorbox .large_classification_list > li:nth-child(' + ( newIndex + 1 ) + ')').addClass('active');

    //スクロールするべき距離を取得。タブ全体の長さ / ( タブの個数 - 1 ) * スライドの現在地
    var scrollDestination = ( itemtabExtraDistance / (itemtabQuantity - 1) ) * ( newIndex );

    //スクロール位置を調整
    $('#colorbox .large_classification').animate({ scrollLeft: scrollDestination }, 'slow');

}

( function( $ ) {//タブボタンクリックで発動する関数

    $('.tab_list-ef00201').on('click','.tab_button-ef00201', function(e) {

        //何番目の要素かを取ってスライドを移動する
        var nth = $('.tab_button-ef00201').index(this);

        if ( slider ) slider.goToSlide(nth);

        //クリックイベントを無効化
        e.preventDefault();

    });

} )( jQuery );

( function( $ ) {//タブボタンクリックで発動する関数

    $(document).on('click', '#colorbox .large_classification_tab' ,function(e) {

        //何番目の要素かを取ってスライドを移動する
        var nth = $('#colorbox .large_classification_tab').index(this);

        itemslider.goToSlide(nth);

        //クリックイベントを無効化
        e.preventDefault();

    });
} )( jQuery );

$(function() {
    $('.color_box').colorbox({
        inline:true,
        width: 560,
        height: "90%",
        opacity: 0.5,
        closeButton: false,
        arrowKey: false
    });
    $('.close_btn').on('click', function() {
        parent.$.fn.colorbox.close(); return false;
    });
    $('#tab_content02 .preview_btn_list li a').colorbox({
        inline:true,
        width: 640,
        height: "98%",
        opacity: 0.5,
        onComplete: previewSlideSet,
        onClosed: previewDestroy,
        closeButton: false
    });
});

function slideSet() {
    /******************************************
     事前準備
     *******************************************/

    //タブボタンの数を取得
    tabQuantity = $('.tab_button-ef00201').length;
    //タブの長さとボディの長さの差分を取得
    tabExtraDistance = $('.tab_list-ef00201').width() - $('.tabContainer-ef00201').width();
    /******************************************
     スライダー発動
     *******************************************/

    slider = $('#tab_contents-ef00201').bxSlider({
        pager:false,
        controls:false,
        adaptiveHeight: true,
        infiniteLoop: true,
        touchEnabled: false,
        mode: 'fade',
        onSlideBefore: function($slideElement, oldIndex, newIndex){
            //スライドする時に関数を呼び出す。newIndexはスライダーの現在地。
            slideChange(newIndex);
        }
    });

}

function slideDestroy () {
    slider.destroySlider();
}

function previewSlideSet() {

    /******************************************
     スライダー発動
     *******************************************/

    previewSlider = $('#colorbox #karte_memo_preview_list').bxSlider({
        pager:false,
        // 「次へ」ボタンのテキストを指定する
        nextText: '<i class="fa fa-angle-right" aria-hidden="true"></i>', // 'Next'

        // 「前へ」ボタンのテキストを指定する
        prevText: '<i class="fa fa-angle-left" aria-hidden="true"></i>', // 'Prev'
        startSlide:startSlide,
    });

}

function previewDestroy () {
    previewSlider.destroySlider();
}

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

( function( $ ) {//売上履歴タブ
    $('.history_tab_btn a').on('click', function(e) {
        //何番目の要素かを取ってタブを移動する
        var history_index = $('.history_tab_btn a').index(this);

        $('.history_content').css('display', 'none');

        $('.history_content').eq(history_index).css('display', 'block');

        $('.history_tab_btn a').removeClass('active');
        $('.history_tab_btn a').eq(history_index).addClass('active');
        //クリックイベントを無効化
        e.preventDefault();

    });
} )( jQuery );

( function( $ ) {//来店サイクル横スクロール
    $('.cycle_table_wrap').on('scroll', function() {
        $('.cycle_table thead th:nth-of-type(1)').css('left', $(this).scrollLeft());
        $('.cycle_table tbody th:nth-of-type(1)').css('left', $(this).scrollLeft());
        $('.cycle_table thead th:nth-of-type(2)').css('left', $(this).scrollLeft() + 94);
        $('.cycle_table tbody th:nth-of-type(2)').css('left', $(this).scrollLeft() + 94);
        $('.cycle_table thead th:nth-of-type(3)').css('left', $(this).scrollLeft() + 164);
        $('.cycle_table tbody th:nth-of-type(3)').css('left', $(this).scrollLeft() + 164);
    });
} )( jQuery );

function unchecked() {
    $('#filter_box input[type="checkbox"]').prop('checked', false);
}