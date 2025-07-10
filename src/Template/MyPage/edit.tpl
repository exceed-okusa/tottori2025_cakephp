
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
				user: 	   {$user},
				authority: {$user->authority},
                // isShowAddLecture: false,
			},
			methods:{
				goLectures: function(){
					window.location.href = '{$this->Url->build(['controller'=>'Lectures', 'action'=>'index'])}'
				},
			},
            // 何かしらの判定を通して、1つの結果を得る
            computed: {
                isShowLectureRegistration: function(){
                    return this.authority == {$this->Enum->Authority->STUDENT->value} || authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value};
                },
                isShowCheckTimetable: function(){
                    return this.authority == {$this->Enum->Authority->STUDENT->value} || authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value};
                },
                isShowLectureManagement: function(){
                    return this.authority == {$this->Enum->Authority->TEACHER->value} || authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value};
                }
            }
		});
    //-->
    //]]>
</script>
{$this->end()}

<style>
	.main-button {
		margin :8px 4px;
	}
    .authority-label {
        /* 文字の色変更 */
        color: red;
        /* 太字 */
        font-weight: bold;
        font-size: 18px;
    }
</style>

<div id="vm" style="margin-left:25px;">
	<h1>My Page</h1>    
    <div class="authority-label" >[{$this->Enum->Authority->getTextByValue($user->authority)}用]</div>    
	<h4 v-text="user.family_name +' '+ user.first_name +' さん、こんにちは！'"></h4>
	<div class="col-sm-2">
		<div class="main-button" v-if="authority == {$this->Enum->Authority->STUDENT->value} || authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value}">
			<button class="btn btn-primary btn-lg">履修登録</button>
		</div>
		<div class="main-button" v-if="authority == {$this->Enum->Authority->STUDENT->value} || authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value}">
			<button class="btn btn-primary btn-lg">時間割確認</button>
		</div>
        <div class="main-button" v-if="authority == {$this->Enum->Authority->TEACHER->value} || authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value}">
			<button class="btn btn-primary btn-lg" @click="goLectures()">講座管理</button>
		</div>
	</div>
</div>

