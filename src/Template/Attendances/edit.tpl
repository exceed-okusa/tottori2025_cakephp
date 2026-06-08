
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
                lectureNumberMax         : 15,
                attendances              : {$attendances},
                attendanceStatusOptions  : {json_encode($this->Enum->AttendanceStatus->getValuesAndDescriptions())},
                users                    : {$users},
                attendancesForSelectedLecture : [],
                originalData             : [],
                isChanged                : false,
			},
			methods:{
                changeLecture() {
                    this.setAttendancesForSelectedLecture();
                },
                changeData(){
                    // attendancesForSelectedLecture と originalData に差異があるか？

                    for (user of this.users) {
                        for (let i=1; i<=15; i++) {
                            // ★★★★★★★★
                        }
                    }

                    this.isChanged = (this.attendancesForSelectedLecture[0].attendance_status_list[1] != this.originalData[0].attendance_status_list[1]);
                },
                setAttendancesForSelectedLecture() {
                    // 全出欠データから講座に対応するものをセットする
                    for (attendance of this.attendances) {
                        if (attendance.lecture_id == this.selectedLectureId) {
                            // 画面に表示するデータの特定
                            this.attendancesForSelectedLecture = attendance.data;
                            // this.originalData = Object.assign({}, attendance.data); ★失敗例

                            // ★★★★★★★ここから
                            for (userStatusList of attendance.data) {
                                this.originalData.push({
                                    attendance_status_list: Object.assign({}, userStatusList.attendance_status_list), 
                                    student_user_id: userStatusList.student_user_id 
                                });
                            }
                            
                            break;
                        }
                    }
                },
			},
            created() {
                this.selectedLectureId = this.lectures[0].id;
                this.setAttendancesForSelectedLecture();
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
    <div style="display:flex; gap:60px;">
        <div>
            <label for="lecture-name">講座名</label>
            <select id="lecture-name" v-model="selectedLectureId" @change="changeLecture()">
                <option v-for="lecture in lectures"
                        :value="lecture.id"
                        v-text="lecture.lecture_name">
                </option>
            </select>
        </div>
        <div>
            {* 記号の読み方 [0,1,2] 1こ1こを$statusと扱ってOK *}
            {foreach from=$this->Enum->AttendanceStatus->getValues() item=status}
                {$this->Enum->AttendanceStatus->getDescriptionByValue($status)}：{$this->Enum->AttendanceStatus->getTextByValue($status)}
            {/foreach}
        </div>
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
                        <select style="padding: 2px 6px;" v-model="attendancesForSelectedLecture[idx].attendance_status_list[i]"
                            @change="changeData()"
                        >
                            <option value=""></option>
                            <option v-for="(status, index) in attendanceStatusOptions"
                                    v-text="status"
                                    :value="index"
                            ></option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div style="text-align:center; margin: 15px;">
        <button class="btn btn-primary btn-lg">登録</button>
    </div>
</div>

