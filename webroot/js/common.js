/* 
	Ajax処理(勉強会用 Study Session : sts)
	url  : JSONの送信先
	data : 送信するデータ
	fn   : Ajaxが返ってきたときに発火する処理を記載する関数
 */
function stsAjax(url, data, fn){
	// JSON文字列へ変換
	const dataForSend = JSON.stringify(data);
	const xhr = new XMLHttpRequest();
	// 通信方式(GETまたはPOST)・リクエストの送信先を設定
	xhr.open('POST', url);
	xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
	// Ajax通信を開始
	xhr.send(dataForSend);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			// データを取得して通信が終了している状態
			if (xhr.status === 200) {
				// 特に問題なく通信が成功した状態
				// 文字列をJSONとして解析
				const res = JSON.parse(xhr.responseText);
				fn(res.data);
			} else {
				console.error('通信エラー', xhr.status);
			}
		}
	};
}


