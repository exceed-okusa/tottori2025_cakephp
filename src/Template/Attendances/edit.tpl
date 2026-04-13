
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
                selectedLecture:  "",
                students: [
                ],
                status: [
                ],
			},
            created:
            // // if(){

            // // } 
            // //     for(let i=0;i<this.attendances.length; i++){
            // //         this.selectedLecture = Object.assign({}, this.attendances[i]);
            // //     }
                function informationConnect(index1,index2){
                    for(let i = 0; i<this.attendances.length; i++){
                        let statusList = [];
                        for(let j = 0; j<this.attendances; j++){  
                            statusList.push(
                                { student_attendance: this.attendances.attendance_status }
                            );
                        }
                        this.students.push(
                            statusList
                        );
                    }
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
                confirmation: function(index1,index2){
                    console.log(index1)
                    console.log(index2)
                    console.log(this.students)
                    console.log(this.attendances)
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
                onSelectChange: function(index1,index2){
                    if(index2 == 'attendances[index1].lecture_number'){
                        this.selectedLecture = "attendances[index1].attendance_status";
                        console.log('aaa')
                    }else{
                        this.selectedLecture =  null;
                    }
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
            <select>
                <option v-for="lecture in lectures" v-text="lecture.lecture_name" value=""></option>
            </select>
            <div class="markMean">〇：出席 △：遅刻 ✖：欠席</div>
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
                        <td v-for="(n, index2) in 15" value = 'i'>
                            {* lecture_numberをうまく関連させる *}
                            <select v-model = "selectedLecture">
                                <option></option>
                                <option value='1'>〇</option>
                                <option value='2'>△</option>
                                <option value='3'>✖</option>
                            </select>
                            <button @click="confirmation(index1,index2)">確認</button>
                        </td>
                    </tr>
                </tbody>                    
            </table>
        </div>
        <div>
            <button class="buttonClass" @click="saveConfirm">登録</button>
        </div>
</div>

