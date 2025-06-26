
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

/******************************************
 スライドする時に発動する関数。タブの表示調整を行う。
 *******************************************/

function slideChange(newIndex){

    //クラスを調整
    $('.tab_button').removeClass('active');
    $('.tab_list > li:nth-child(' + ( newIndex + 1 ) + ')').addClass('active');

    $('#tab_contents>div').removeClass('active');
    $('#tab_contents>div').eq(newIndex).addClass('active');

    //スクロールするべき距離を取得。タブ全体の長さ / ( タブの個数 - 1 ) * スライドの現在地
    var scrollDestination = ( tabExtraDistance / (tabQuantity - 1) ) * ( newIndex );

    //スクロール位置を調整
    $('.tabContainer').animate({ scrollLeft: scrollDestination }, 'slow');

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

    $('.main-container').on('click','.tab_button', function(e) {

        //何番目の要素かを取ってスライドを移動する
        var nth = $('.tab_button').index(this);

        slider.goToSlide(nth);

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


function slideSet() {
    /******************************************
     事前準備
     *******************************************/

    //タブボタンの数を取得
    tabQuantity = $('.tab_button').length;
    //タブの長さとボディの長さの差分を取得
    tabExtraDistance = $('.tab_list').width() - $('.tabContainer').width();

    /******************************************
     スライダー発動
     *******************************************/
    slider = $('#tab_contents').bxSlider({
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

