
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
                lectures: {$lectures},
				account: '',
				password: '',
				loginErrorMessage: '',
                loginErrorCount: 0,
                isShow: false,
                // loginErrorCountMessage: ''
			},
			methods:{
			}
		});
    //-->
    //]]>
</script>
{$this->end()}

<style>
.leftTopBox {
    border-top: 1px white solid;
    border-left:1px white solid;
}
label {
	width: 120px;
}
.subjectName{
    background-color: white;
    width: 200px;
}
.course-count{
    width: 400px;
    text-align: left;
}
.course-check{
    margin: top 100px;
    text-align: left;
}
.markMean{
    margin: left 100px;
}
</style>

<a href="{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/{$loginUserId}"> <  マイページへ戻る</a>
<div id="vm">
	<h1 style="margin-left:25px;">出席状況</h1>
        <div>
            <div class="markMean">〇：出席 △：遅刻 ✖：欠席</div>
            <table class="course-check">
                <thead>
                    <tr class="course-count">
                        <td  class= "leftTopBox"></td>
                        <td  v-for="n in 15" v-text="'第'+n+'回'"></td>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="lecture in lectures" >
                        <th v-text="lecture.lecture_name" class="subjectName"></th>
                        <td v-for="n in 15"></td>
                    </tr>                
                </tbody>
            </table>
        </div>
</div>

