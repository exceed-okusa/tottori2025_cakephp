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
			// console.log('コンテンツ' + oh);
			
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
			
			//var oh4 = $(this).height();
			//console.log('コンテンツaaa' + oh4);
		}
	})
	.trigger('load');
});
//ボタンを押したらiframeの大きさを変える（階層のiframeと、ページネーションのレスポンシブを動かすため）
$(window).load(function () {
	$('.searchHideArea').on('click', '.iframe_close_btn', function(){
		
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
					
					//var oh = $(this).height();
					//console.log('コンテンツ' + oh);
				}
			})
			.trigger('load');
		}, 700);
	});
});

//iframeの親のdivのclassに「iframe_wrap」追加
$(document).ready(function () {
	$('iframe').parent('div').addClass('iframe_wrap');
});


( function( $ ) {//ラジオボタンがチェックされたときlabelにclass追加
    $(function(){
        var radio = $('.btn-group_item');
        $('input', radio).css({'opacity': '0'})
        .each(function(){
            if ($(this).attr('checked') == 'checked') {
                $(this).next().addClass('active');
            }
        });
        $('label', radio).click(function() {
            $(this).parent().each(function() {
                $('label',this).removeClass('active'); 
            });
            $(this).addClass('active');
        });
    });
} )( jQuery );

//初期値でcheckedの親labelにclass「active」追加。
$(document).ready(function () {
	$("input:checked").parent("label").addClass("active");
});

