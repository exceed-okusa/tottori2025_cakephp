
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="content-language" content="ja">
    <meta name="viewport" content="width=device-width, maximum-scale=1">
    <title>タイトル(仮)</title>

    <script type="text/javascript">
        //<![CDATA[
        {'<!--'}

        let vm = {
            component: { },
            modal: { },
        };

        //-->
        //]]>
    </script>

    {$this->Html->css('jquery-ui/jquery-ui.min.css')}
    {$this->Html->css('bootstrap.min')}
    {$this->Html->css('cloud-main')}
    {$this->Html->css('ico')}

    {$this->Html->script(['jquery-2.2.3.min'])}
    {$this->Html->script(['jquery-ui/jquery-ui.min'])}
    {$this->Html->script(['vue'])}
    {$this->Html->script(['common'])}
</head>
<body>
{if !($this->request->params['controller']=='Login' && $this->request->params['action']=='index')}
    <div>
    {$this->Html->link('ログアウト',['controller' => 'Login', 'action' => 'index'],['class' => 'btn btn-danger','style' => 'margin : 5px;'])}
    </div>
{{/if}}
{$this->fetch('content')}

{$this->fetch('scriptBottom')}
</body>
</html>
