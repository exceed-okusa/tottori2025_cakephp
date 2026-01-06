
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
                students: [
                ],
                status: [
                ],
			},
            created: 
                function informationConnect(index1,index2){
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
                },
                informationConnect:function(index1) {
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
                        <td  class= "leftTopBox"></td>
                        <td  v-for="n in 15" v-text="'第'+n+'回'">
                        </td>
                    </tr>
                    <tr v-for="(user, index1) in users" v-if = "user.authority == 0">
                        <th v-text="user.family_name + '  ' + user.first_name" class="subjectName"></th>
                        <td v-for="(n, index2) in 15" value=n>
                            <select>
                                <option></option>
                                <option value='1'>〇</option>
                                <option value='2'>△</option>
                                <option value='3'>✖</option>
                            </select>
                            <span>
                            </span>
                            <button @click="confirmation(index1,index2)">確認</button>
                        </td>
                    </tr>                
                </thead>
            </table>
        </div>
        <div>
            <button class="buttonClass" @click="saveConfirm">登録</button>
        </div>
</div>

