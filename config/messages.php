<?php

use Cake\Core\Configure;
use Cake\I18n\Number;

// JavaScriptで文字置換を使う場合、田邊さん定義の関数 $.sprintf() が使えます。動きはphp関数の sprintf() と同じです。
// この場合、置換対象は %1$s , %2$s のような書き方ではなく、{0} , {1} のような書き方にしてください。
function setMessage()
{
    Configure::write(
        'CLOUD_MESSAGES',
        []
    );
}

setMessage();