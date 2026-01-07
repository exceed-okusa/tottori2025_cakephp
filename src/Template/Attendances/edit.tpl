
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
                
                
                
                
            }
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
            

</div>