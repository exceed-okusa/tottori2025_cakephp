
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
                isShowAddLecture: false,
			},
			methods:{
				goLectures: function(){
					window.location.href = '{$this->Url->build(['controller'=>'Lectures', 'action'=>'index'])}'
				},
                goAttendances: function(){
                    window.location.href = '{$this->Url->build(['controller'=>'Attendances', 'action'=>'index'])}'
                },
                attendancesManagement: function(){
                    window.location.href = '{$this->Url->build(['controller'=>'Attendances','action'=>'edit'])}'
                }
                // logout: function(){
                    // window.location.href = '{$this->Url->build(['controller'=>'login', 'action'=>'index'])}'
                // }
			},
            // 何かの判定を通して、一つの結果を得る
            computed:{
                isShowLectureManagement: function(){
                    return this.authority == {$this->Enum->Authority->TEACHER->value} 
                    || this.authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value};
                    },
                isShowLectureRegistration: function(){
                    return this.authority == {$this->Enum->Authority->STUDENT->value} 
                    || this.authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value};
                },
                isShowCheckTimetable: function(){
                    // Enumは値の説明をしてくれている
                    return this.authority == {$this->Enum->Authority->STUDENT->value} 
                    || this.authority == {$this->Enum->Authority->SYSTEM_ADMINISTRATOR->value};
                },
                isShowAttendances: function(){
                    return this.authority == {$this->Enum->Authority->STUDENT->value} 
                },
                isShowAttendancesManagement: function(){
                    return this.authority == {$this->Enum->Authority->TEACHER->value}
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
    .Account-Color{
        color:red;
        font-weight: bold;
    }
    .btn btn-primary btn-lg{
        /* margin-bottom: 4px; */
    }
</style>

<div id="vm" style="margin-left:25px;">
	<h1>My Page</h1>
    <h4 class="Account-Color">[{$this->Enum->Authority->getTextByValue($user->authority)}用]</h4>
	<h4 v-text="user.family_name +' '+ user.first_name +' さん、こんにちは！'"></h4>
	<div class="col-sm-2">
		<div class="main-button" v-if="isShowLectureManagement">
         	<button class="btn btn-primary btn-lg" @click="goLectures()">講座管理</button>
		</div>		
		<div class="main-button" v-if="isShowLectureRegistration">
			<div class="btn btn-primary btn-lg">履修登録</div>
		</div>
        <div class="main-button" v-if="isShowCheckTimetable">
            <div class="btn btn-primary btn-lg">時間割確認</div>
        </div>
        <div class="main-button" v-if="isShowAttendances">
            <div class="btn btn-primary btn-lg" @click="goAttendances()">出席状況</div>
        </div>
        <div class="main-button" v-if="isShowAttendancesManagement">
            <div class="btn btn-primary btn-lg" @click="attendancesManagement">出席管理</div>
        </div>
	</div>
</div>

