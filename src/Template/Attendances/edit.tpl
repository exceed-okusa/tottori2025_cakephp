
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
                selectedLectureId        : null,
                lectures                 : {$lectures},
                lectureNumberMax          : 15,
                attendances              : {$attendances},
                attendanceStatusOptions  : {json_encode($this->Enum->AttendanceStatus->getValuesAndDescriptions())},
                users                    : {$users},
                attendanceStatuses       : [],
                attendanceStatusesBefore : [],
                isChangedData            : false,
                // lectureを変更する毎に初期化する・save時にlectureの情報も一緒にControllerに渡す
                // attendanceStatuses = [{ semester:1, lecture_number:1, attendances: [] },{},・・・]
			},
			methods:{
				saveConfirm: function(){
                    const result = window.confirm('この内容で登録します。よろしいですか？');
					if(result){
                        const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
                        const data = {
                            lecture_id: this.selectedLectureId,
                            user_status_list: []
                        };
                        this.attendanceStatuses.forEach((attendanceStatus, lectureIdx) => {
                            // 講座の各回でループ
                            attendanceStatus.attendances.forEach((student)=>{
                                // 各学生でループ
                                if(student.change_flag == {$this->Enum->ChangeFlag->CHANGED->value}){
                                    data.user_status_list.push({
                                        semester      : attendanceStatus.semester,
                                        user_id       : student.user_id,
                                        status        : student.status,
                                        lecture_number: lectureIdx + 1
                                    });
                                }
                            });
                        });
                        const fn = function(dataFromAjax){
                            // 画面再描画
                            location.reload();
                        }
						stsAjax(url, data, fn);
					}
                },
                changeData: function(lectureNumber, userIndex){
                    // 元のデータと差異があるか確認(対象データのみの判定)
                    const val = this.attendanceStatuses[lectureNumber-1].attendances[userIndex].status === this.attendanceStatusesBefore[lectureNumber-1].attendances[userIndex].status
                                ? {$this->Enum->ChangeFlag->NOT_CHANGED->value}
                                : {$this->Enum->ChangeFlag->CHANGED->value};
                    this.attendanceStatuses[lectureNumber-1].attendances[userIndex].change_flag = val;

                    // 元のデータと差異があるか確認(全体の判定)
                    for(let i=0; i<this.attendanceStatuses.length; i++){
                        for(let j=0; j<this.attendanceStatuses[i].attendances.length; j++){
                            if(this.attendanceStatuses[i].attendances[j].change_flag == {$this->Enum->ChangeFlag->CHANGED->value}){
                                this.isChangedData = true;
                                return;
                            }
                        }
                    }
                    this.isChangedData = false;
                },
                setDefaultStatuses: function(lectureId){
                    this.attendanceStatuses = [];
                    this.attendanceStatusesBefore = [];
                    // 授業回数分ループ
                    for(let i=1; i<=this.lectureNumberMax; i++){
                        // 各講座の出席簿作成(初期化)
                        attendances = [];
                        this.users.forEach((user) => {
                            attendances.push({
                                user_id     : user.id,
                                status      : '',
                                change_flag : {$this->Enum->ChangeFlag->NOT_CHANGED->value},
                            });
                        });
                        this.attendanceStatuses.push({
                            semester       : 1,
                            lecture_number : i,
                            attendances    : attendances,
                        });
                    }

                    // その後、データがあればセット
                    // 【例】attendances:[{ lecture_id:8,semester:1,student_user_id:3,attendance_status:1,lecture_number:1 }, ・・・]
                    this.attendances.forEach((attendance) => {
                        // ★ いずれ講座を限定したい (semester一旦無視)
                        if(attendance.lecture_id == lectureId){
                            // ★ this.$setがいいか確認
                            this.attendanceStatuses[attendance.lecture_number - 1].attendances.forEach((userStatus) => {
                                if(userStatus.user_id == attendance.student_user_id){
                                    userStatus.status = attendance.attendance_status;
                                }
                            });
                        }
                    });
                    // コピーをとり、isChangedDataの判定に利用(配列なので参照渡しにならないよう注意) slice/配列内各要素をpushでObject.assignもダメ
                    // ★ 参考URL https://cly7796.net/blog/javascript/copy-array-value/
                    this.attendanceStatusesBefore = JSON.parse(JSON.stringify(this.attendanceStatuses));
                }
			},
            created() {
                this.selectedLectureId = this.lectures[0].id;
                this.setDefaultStatuses(this.selectedLectureId);
            },
            watch: {
                selectedLectureId: function(newId){
                    this.setDefaultStatuses(newId);
                    this.isChangedData = false;
                }
            },
		});
    //-->
    //]]>
</script>
{$this->end()}

<style>

</style>

<div id="vm">
    <a href="{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/{$loginUserId}">< マイページへ戻る</a>
    <h1>出席管理</h1>
    <div>
        <label for="lecture-name">講座名</label>
        <select id="lecture-name" v-model="selectedLectureId">
            <option v-for="lecture in lectures"
                    :value="lecture.id"
                    v-text="lecture.lecture_name">
            </option>
        </select>
    </div>
    <div style="overflow-x: scroll;">
        <table style="table-layout: fixed;">
            <tbody>
                <tr>
                    <th></th>
                    <th v-for="i in lectureNumberMax" v-text="'第'+ i +'回'" nowrap></th>
                </tr>
                <tr v-for="(user, idx) in users">
                    <td nowrap v-text="user.family_name + ' ' + user.first_name"></td>
                    <td v-for="i in lectureNumberMax">
                        {* 配列のindexと授業回が1ズレるため *}
                        <select v-model="attendanceStatuses[i-1].attendances[idx].status" style="padding: 2px 6px;" @change="changeData(i, idx)">
                            <option value=""></option>
                            <option v-for="(statusOption, value) in attendanceStatusOptions"
                                    v-text="statusOption"
                                    :value="value">
                            </option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div style="text-align:center; margin: 15px;">
        <button class="btn btn-primary btn-lg" @click="saveConfirm()" :disabled="!isChangedData">登録</button>
    </div>
</div>

