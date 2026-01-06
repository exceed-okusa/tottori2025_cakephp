
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
			},
			methods:{

			},
            // 何かしらの判定を通して、１つの結果を得る
            computed: {
                isShowLectureRegistration: function(){
                    return this.authority == {$this->Enum->Authority->STUDENT->value}
                        || this.authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value};
                },
                isShowCheckTimetable: function(){
                    return this.authority == {$this->Enum->Authority->STUDENT->value}
                        || this.authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value};
                },
                isShowLectureManagement: function(){
                    return this.authority == {$this->Enum->Authority->TEACHER->value}
                        || this.authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value};
                },
                isShowAttendanceManagement: function(){
                    return this.authority == {$this->Enum->Authority->TEACHER->value}
                        || this.authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value};
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
    color: red;
    font-weight: bold;
		font-size: 18px;
  }
</style>

<div id="vm" style="margin-left:25px;">
	<h1>My Page</h1>
	<div class="authority-label">[{$this->Enum->Authority->getTextByValue($user->authority)}用]</div>
	<h4 v-text="user.family_name +' '+ user.first_name +' さん、こんにちは！'"></h4>
	<div class="col-sm-2">
		<div class="main-button" v-if="isShowLectureRegistration">
			<button class="btn btn-primary btn-lg">履修登録</button>
		</div>
		<div class="main-button" v-if="isShowCheckTimetable">
			<button class="btn btn-primary btn-lg">時間割確認</button>
		</div>
        <div class="main-button" v-if="isShowLectureManagement">
            {$this->Html->link('講座管理',['controller' => 'Lectures', 'action' => 'index'],['class' => 'btn btn-primary btn-lg'])}
		</div>
        <div class="main-button" v-if="isShowAttendanceManagement">
            {$this->Html->link('出席管理',['controller' => 'Attendances', 'action' => 'edit'],['class' => 'btn btn-primary btn-lg'])}
		</div>
        <div class="main-button" v-else>
            {$this->Html->link('出席状況',['controller' => 'Attendances', 'action' => 'index'],['class' => 'btn btn-primary btn-lg'])}
		</div>
	</div>
</div>

