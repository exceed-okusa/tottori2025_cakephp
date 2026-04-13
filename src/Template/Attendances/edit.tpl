
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
            data:{
                students :{$students},
                lectures :{$lectures},
                studentId :{$studentId},
                editId      : null,
                selectedLecture: null,
                test_status :1,
                statusList :[],
                
            },
            created(){
                
                for(let j=0;j<2;j++){
                    const row = [];
                    for(let i=0;i<15;i++){
                        row.push('');
                    }
                    this.statusList.push(row);
                }
                // this.statusList.push(2);
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
    <select name="lecture_name">
        <option v-for="lecture in lectures" v-text="lecture.lecture_name"></option>
    </select>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th v-for="n in 15" v-text="'第'+ n +'回'"></th>
                    </tr>
                    {* <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>〇</td>
                    </tr> *}
                    
                    <tr v-for="student in students">
                        <td v-text="student.family_name + ' ' + student.first_name"></td>
                        <td v-for="n in 15">
                            <select {* v-model="test_status" *}>
                                <option value="0">〇</option>
                                <option value="1">△</option>
                                <option value="2">✕</option>
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