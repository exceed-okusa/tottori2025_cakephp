
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
            data:{
                students : {$users},
                lectures :{$lectures},
                studentId :null,
                editId      : null,
                selectedLecture: null,
                selectedLectureId: null,
                attendances : {$attendances},
                test_status :1,
                statusList :[],
                attendanceStatusOptions : {json_encode($this->Enum->AttendanceStatus->getValuesAndDescriptions())},
                users :{$users}, 
                attendancesForSelectedLecture : [],               
                attendanceList :'{$attendanceList}',
                attendancesGrouped :'{$attendancesGrouped}',
            },
            created(){
                
                // for(let j=0;j<2;j++){
                //     const row = [];
                //     for(let i=0;i<15;i++){
                //         row.push('');
                //     }
                //     this.statusList.push(row);
                // }
                // this.statusList.push(2);

                this.selectedLectureId = this.lectures[0].id;
                    for(let i=0; i<this.attendances.length; i++){
                        if(this.attendances[i].lecture_id == this.selectedLectureId){
                            this.attendancesForSelectedLecture = this.attendances[i].data;
                            break;
                        }
                    }
                

            },
            methods:{
                saveData: function(){
                    const result = window.confirm('登録します。よろしいですか？');
                    if(result){

                        const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
                        const data = {

                            editId: this.editId,
                            selectedAttendance: this.selectedAttendance
                        };
                        const fn = function(dataFromAjax){
                            location.reload();
                        }
                        stsAjax(url, data, fn);
                    }
                },
            },
            computed: {
                isShow: function(){
                    return (this.pageMode == {$this->Enum->PageMode->ADD->value} || this.pageMode == {$this->Enum->PageMode->EDIT->value});
                },
            },
        });
    //-->
    //]]>
</script>
{$this->end()}

<a href="{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/{$loginUserId}">＜マイページへ戻る</a>
<div id="vm">
    <div id="attendance-management">
        <h1>出席管理</h1>
    </div>
    <select name="lecture_name" v-model="selectedLectureId">
        <option v-for="lecture in lectures" v-text="lecture.lecture_name" :value="lecture.id" v-text="lecture.lecture_name"></option>

    </select>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th v-for="n in 15" v-text="'第'+ n +'回'"></th>
                    </tr>

                    
                    <tr v-for="(student, index) in students"> 
                        <td v-text="student.family_name + ' ' + student.first_name"></td>
                        <td v-for="n in 15">
                            <select {* v-model="test_status" *} v-model="attendancesForSelectedLecture[idx].attendance_status_list[i]">
                                <option value=""></option>
                                <option v-for="(status,index) in attendanceStatusOptions"
                                        v-text="status"
                                        :value="index"
                                ></option>
                                        
                                {* <option value></option>
                                <option value="0">〇</option>
                                <option value="1">△</option>
                                <option value="2">✕</option> *}
                            </select>
                        </td>
                        

                    </tr>
                </thead>
            </table>
            <button @click="saveData()">登録</button>
</div>
{* <div class="sub-menu-title" id="course-edit" v-if="isShow">
		<h1 v-if="editId !==null">出席内容 編集</h1>
        <h1 v-else>出席内容 登録</h1>
		<div v-if="editId !==null">
			<label for="attendance-id">出席ID</label>
			<span id="attendance-id" v-text="selectedAttendance.id"></span>
		</div>
</div> *}