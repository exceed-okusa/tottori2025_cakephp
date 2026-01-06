
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
                lectures               : {$lectures},
                lectureIds             : {$lectureIds},
                lectureNumberMax       : 15,
                attendances            : {$attendances},
                // ★ 全然うまく取れていない！！
                attendancesForTemplate : {$attendancesForTemplate},
			},
			methods:{

			},
            created() {

            },
		});
    //-->
    //]]>
</script>
{$this->end()}

<style>

</style>

<div id="vm">
    <a href="{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/{$loginUserId}">< マイページへ戻る</a>
    <h1>出席状況</h1>
    <div style="overflow-x: scroll;">
        <table style="table-layout: fixed;">
            <tbody>
                <tr>
                    <th></th>
                    <th v-for="i in lectureNumberMax" v-text="'第'+ i +'回'" nowrap></th>
                </tr>
                <tr v-for="lecture in lectures">
                    <td v-text="lecture.lecture_name" nowrap></td>
                    <td v-for="i in lectureNumberMax"></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

