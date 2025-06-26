//iframe
$(window).load(function () {
	$('[id^=frm]').on('load', function(){
		
		if($(this).closest('div').hasClass('active') || $("#selectEnumListArea")[0] ) {//表示メッセージ等の「言語」のみdivの形が違うので。
			//iframeの高さを自動で取得
			try {
				$(this).height(0);
				$(this).height(this.contentWindow.document.documentElement.scrollHeight);
			} catch (e) {
			}
			
			var oh = $(this).height();
			
			var pBody = $(document).find("body");
			if(pBody.hasClass("search_body")){
				$('[id^=frm]' ,parent.parent.document).height(oh + 70);
				$(this).contents().find(':button[value="閉じる"] , :button[value="クリア"] ,:button[value="選択"]').addClass('iframe_close_btn');
			}
		} else {
			//iframeの高さを自動で取得（iframeが最初からloadされてる場合）
			try {
				$(this).closest('div').css('display', 'block');
				$(this).height(0);
				$(this).height(this.contentWindow.document.documentElement.scrollHeight);
				$(this).closest('div').css('display', 'none');
			} catch (e) {
			}
			
		}
	})
	.trigger('load');
});

//ボタンを押したらiframeの大きさを変える
$(window).load(function () {
	$('.searchHideArea , .iframeHeightArea').on('change click', '.iframe_height', function(){
		
		var timer2 = false;
		if (timer2 !== false) {
			clearTimeout(timer2);
		}
		timer2 = setTimeout(function() {
		
			$('[id^=frm]' ,parent.parent.document).on('load', function(){
				
				if($(this).closest('div').hasClass('active')) {
					//iframeの高さを自動で取得
					try {
						$(this).height(0);
						$(this).height(this.contentWindow.document.documentElement.scrollHeight);
					} catch (e) {
					}
				}
			})
			.trigger('load');
		}, 600);
	});
});
//iframeの親のdivのclassに「iframe_wrap」追加
$(document).ready(function () {
	$('iframe').parent('div').addClass('iframe_wrap');
});

//ページネーションをレスポンシブに。
$(document).ready(function () {
    if ($(".pagination").rPage) {
        $(".pagination").rPage();
	}
	
});

//ショップミーティングの月選択でiphoneではキーボードを出さない
$(function() {
	var sw = $(window).width();
	var sx = 768;
	if (sw <= sx) {
		$('#target-year-month').attr('readonly',true);
		$('#target-year-month').css('background','#fff');
	}
});

//add_pleaseSelectがあるselectに自動で「選択してください」が入るようにする
$(document).ready(function () {
    $('.add_pleaseSelect').prepend( function(){
        if( $(this).children('option[value=""]').size() == 0) {
            if($(this).children('option[selected="selected"]').size() == 0) {
                 return $('<option val="" selected="selected">選択してください</option>');
            } else {
                 return $('<option val="">選択してください</option>');
            }
        }
    });
    
});

//ipadのキーボードを出さない
$(document).ready(function () {
    $(document).on('click', '.mobileKeyboard_no , .calendar_ico_inline input , #ui-datepicker-div' , function(){
        if ( navigator.userAgent.indexOf('iPad') > 0 ) {
            $(this).blur();
            $(this).attr('readonly',true);
        }
    });
});

//tbodyをスクロールさせるtable（karte_table）で、iosではない場合class追加
$(document).ready(function () {
    const ua = navigator.userAgent
    const isIOS = ua.indexOf("iPhone") >= 0
      || ua.indexOf("iPad") >= 0
      || navigator.userAgent.indexOf("iPod") >= 0
    
    if ( !isIOS ) {
        $(".karte_table").addClass("karte_table_scroll");
    };
});

//左メニューの子メニューの親に閉じる・開くボタン
$(document).ready(function () {
    $('.menu_list_sub:has(li)').prev('a').append('<i class="ico icon-angle-right"></i>');
    $(document).on('click','.menu_list li i.icon-angle-right', function() {
        event.preventDefault();
        $(this).toggleClass('icon-angle-down');
        $(this).parent('a').next('.menu_list_sub').slideToggle(500);
    });
});

//チェックボックスがcheckedの時labelにclass追加
$(document).ready(function () {
    $('.checkbox input[type="checkbox"]:disabled').parent('label').addClass('checkbox_disabled');
    $('.checkbox input[type="checkbox"]:checked').parent('label').addClass('checkbox_on');
    $('body').on('change', '.checkbox input[type="checkbox"]', function(){
        if ($(this).prop('checked')) {
            $(this).parent('label').addClass('checkbox_on');
        } else {
            $(this).parent('label').removeClass('checkbox_on');
        }
    });
});

//rowspanで連結されたtableを交互に色変える
$(function() {
    var numTh = $(".table_rowColor").find("th").length;
    var isEven = true;
    $(".table_rowColor tr").each(function() {
        if (numTh == $(this).find("td").length) {
            isEven = !isEven;
        }
        $(this).find("td").addClass(isEven ? "even" : "odd");
    });
});