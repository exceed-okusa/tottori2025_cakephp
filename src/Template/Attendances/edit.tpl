
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
                users:            {$users},
                lectures:         {$lectures},
                attendances:      {$attendances},
                valueCheck:       null,
                attendanceStatus: null,
                attendancesForSelectedLecture: [],
                attendanceStatusOptions:       {json_encode($this->Enum->AttendanceStatus->getValuesAndDescriptions())},
                selectedLecture:  "",
                selectedLectureId: '' ,
                students: [],
                status: [],
                originalData : [],
                isChanged : false,
			},
            created(){
                this.selectedLectureId = this.lectures[0].id;
                // for(i=0;i<this.attendances.length;i++){
                //     if(this.selectedLectureId == this.attendances[i]['lecture_id']){
                //         this.attendancesForSelectedLecture = this.attendances[i]['data'];
                //     }
                // }
                    
                this.setAttendancesForSelectedLecture();
            },
			methods:{
				saveConfirm: function(){		
					const result = window.confirm('この内容で登録します。よろしいですか？');
                    // OKを押すことによってtrue判定になる
					if(result){
                        // 未完成
                        const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
                        const data = {
                            // 編集する講座ID
                            editId: this.editId,
                            // 入力した内容
                            selectedLecture: this.selectedLecture,
                        };
			        }
                },
                confirmation: function(){
                    console.log(this.attendanceStatusOptions);
                },
                informationConnect:function() {
                    for(let i = 0; i<2; i++){
                        let statusList = [];
                        for(let j = 0; j<15; j++){
                            
                            statusList.push(
                                { student_attendance: ' ' }
                            );
                        }
                        this.students.push(
                            statusList
                        );
                    }
                },
                setAttendancesForSelectedLecture: function(){
                    for (attendance of this.attendances) {
                        if (attendance.lecture_id == this.selectedLectureId) {
                            this.attendancesForSelectedLecture = attendance.data;

                            for(userStatusList of attendance.data){
                                this.originalData.push({ 
                                    attendance_list:Object.assign({},userStatusList.attendance_list),
                                    student_user_id:userStatusList.student_user_id 
                                });
                            }
                            break;
                        }
                    }
                },
                changeData(){
                    for(aaa of this.attendancesForSelectedLecture){
                        console.log(aaa);
                        for(let i=1; i<=15, i++){
                            if(aaa['attendance_list'][i] != this.originalData['attendance_list'][i]){
                                this.isChanged = true;
                            }else{
                                this.isChanged = false;
                            }
                        }
                    }      
                    console.log(this.isChanged);
                }
            },
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
.buttonClass{
    margin: 30px;
}
</style>

<a href="{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/{$loginUserId}"> <  マイページへ戻る</a>
<div id="vm">
	<h1 style="margin-left:25px;">出席管理</h1>
        <div>
            <select id='lecture-name' v-model='selectedLectureId' @change = "changeLecture()">
                <option v-for="lecture in lectures" v-text="lecture.lecture_name" :value="lecture.id"></option>
            </select>
            <span style="margin-left:25px;">
                {foreach from=$this->Enum->AttendanceStatus->getValues() item=status}
                    {$this->Enum->AttendanceStatus->getDescriptionByValue($status)}:{$this->Enum->AttendanceStatus->getTextByValue($status)}
                {/foreach}
            </span>
            <table class="course-check">
                <thead>
                    <tr class="course-count">
                        <th  class= "leftTopBox"></th>
                        <th  v-for="n in 15" v-text="'第'+n+'回'"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index1) in users" v-if = "user.authority == 0">
                        <td v-text="user.family_name + '  ' + user.first_name" class="subjectName"></td>
                        <td v-for="n in 15" value = 'i'>
                            {* lecture_numberをうまく関連させる *}
                            <select v-model = "attendancesForSelectedLecture[index1]['attendance_list'][n]" style="padding: 2px 6px;"
                                @change="changeData()">
                                <option></option>
                                <option 
                                    v-for='(status, index) in attendanceStatusOptions' 
                                    v-text='status' 
                                    :value= 'index'>
                                </option>
                            </select>
                            <button @click="confirmation()">確認</button>
                        </td>
                    </tr>
                </tbody>                    
            </table>
        </div>
        <div>
            <button class="buttonClass" @click="saveConfirm">登録</button>
        </div>
</div>

