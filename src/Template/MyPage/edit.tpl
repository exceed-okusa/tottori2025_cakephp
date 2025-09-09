
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
                logout : function(){
                    window.location.href = '{$this->Url->build(['controller'=>'Login', 'action'=>'index'])}'

                }
			},
            computed: {
                isShowLectureRegistration :function(){
                    return this.authority=={$this->Enum->Authority->STUDENT->value} ||
                    this.authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value}
                },
                isShowCheckTimetable :function(){
                    return this.authority=={$this->Enum->Authority->STUDENT->value} ||
                    this.authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value}
                },
                isShowLectureManagement :function(){
                    return this.authority=={$this->Enum->Authority->TEACHER->value} ||
                    this.authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value}
                },
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
    .authority-label{
        color: red;
        font-size: large;
        font-weight: bold;
    }
</style>

<div id="vm" style="margin-left:25px;">
	<h1>My Page</h1>
    <div class="authority-label">{$this->Enum->Authority->getTextByValue($user->authority)}用</div>
	<h4 v-text="user.family_name +' '+ user.first_name +' さん、こんにちは！'"></h4>
	<div class="col-sm-2">
		<div class="main-button" v-if="isShowLectureRegistration">
			<button class="btn btn-primary btn-lg">履修登録</button>
		</div>
		<div class="main-button" v-if="isShowCheckTimetable">
			<button class="btn btn-primary btn-lg">時間割確認</button>
		</div>
        <div class="main-button" v-if="isShowLectureManagement">
        <button class="btn btn-primary btn-lg" @click="goLectures()">講座管理</button>
        </div>
        <div><button class="btn btn-primary btn-lg" @click="logout()">ログアウト</button>
        </div>
	</div>
</div>

