
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
				lectures    : {$lectures},
				courseTimes : {$courseTimes},
				editId      : null,
                selectedLecture: null,
                isShow      : false,
                isShowDetail: false,
			},
			methods:{
				goEdit: function(lectureId){
                    this.isShowDetail = false;
					this.editId = lectureId;
                    for(let i=0;i<this.lectures.length; i++){
						if(this.lectures[i].id == lectureId){
							this.selectedLecture = Object.assign({}, this.lectures[i]);
                            this.isShow = true;
						}
					};
				},
				goDetail: function(lectureId){
                    this.isShow = false;
                    this.isShowDetail = true;
                    for(let i=0;i<this.lectures.length; i++){
						if(this.lectures[i].id == lectureId){
							this.selectedLecture = Object.assign({}, this.lectures[i]);
						}
					};
				},
                goAdd: function(){
                    this.editId = null;
                    this.selectedLecture = {
                    id               : null,
                    lecture_name     : null,
                    class_day        : {$this->Enum->DayOfWeek->MONDAY->value},
                    course_time      : 1,
                    area_of_study_id : null,
                    number_of_frames : 1,
                    };
                    this.isShow = true;
                    this.isShowDetail = false;
				},
                deleteConfirm: function(lectureId){
                    this.selectedLecture = null;
					const result = window.confirm('削除しますか？');
                    if(result){
                        const url = '{$this->Url->build(['action'=>'delete', '_ext'=>'json'])}';
                        const data = {
                        editId : lectureId,
                        };
                        const fn = function(dataFromAjax){
                            location.reload();
                        }
						stsAjax(url, data, fn);
					}
				},
				saveConfirm: function(){		
					const result = window.confirm('この内容で登録します。よろしいですか？');
					if(result){
                        const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
                        const data = {
                        editId : this.editId,
                        selectedLecture : this.selectedLecture,
                        };
                        const fn = function(dataFromAjax){
                        
                        }
						stsAjax(url, data, fn);
					}
				},
			},
		});

</script>
{$this->end()}

<style>
#course-right {
	min-width:460px;
    margin-right: 60px;
}

#course-left {
	min-width:460px;
    margin-left: 60px;
}

#course-left th {
    background-color: antiquewhite;
    padding: 4px 15px;
}

#course-left td {
    background-color: white;
width: 300px;
}
#header-size {
    font-size: 2em;
    font-weight: bold;
    margin: 0.67em 0;
    margin-right: 100px;
}
#course-edit {
	margin-left: 200px;
	min-width:350px;
}
label {
	width: 120px;
}
input, select {
	width: 200px;
}
</style>

<div id="vm" style="display:flex;">
	<div id="course-right">
		<b id="header-size">講座一覧</b>
        <span><button style="margin:0 10px;" @click="goAdd()">追加</button></span>
			<table>
				<thead>
					<tr>
						<th>講座ID</th>
						<th>講座名</th>
						<th>学問分類名</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="lecture in lectures">
						<td v-text="lecture.id"></td>
						<td v-text="lecture.lecture_name"></td>
						<td v-text="lecture.area_of_study.area_of_study_name"></td>
						<td>
							<button style="margin:0 10px;" @click="goEdit(lecture.id)">編集</button>
							<button style="margin:0 10px;" @click="goDetail(lecture.id)">詳細</button>
                            <button style="margin:0 10px;" @click="deleteConfirm(lecture.id)">削除</button>
						</td>
					</tr>
				</tbody>
			</table>
	</div>
	<div id="course-edit" v-if="isShow">
        <h1 v-if='editId == null'>講座内容 登録</h1>
		<h1 v-else>講座内容 編集</h1>
		<div>
			<label for="lecture-id" v-if='editId != null' >講座ID</label>
			<span id="lecture-id" v-text="selectedLecture.id"></span>
		</div>
		<div>
			<label for="lecture-name">講座名</label>
			{$this->Form->input('lecture_name',['v-model'=>'selectedLecture.lecture_name'])}
		</div>
		<div>
			<label for="class-day">開講曜日</label>
			{$this->Form->input('class_day',['options'=>$this->Enum->DayOfWeek->getValuesAndTexts(), 'v-model'=>'selectedLecture.class_day'])}		
		</div>
		<div>
			<label for="course-time">開講時限</label>
			<select id="course-time" v-model="selectedLecture.course_time">
				<option v-for="courseTime in courseTimes" :value="courseTime.value" v-text="courseTime.text"></option>
			</select>
		</div>
		<div>
			<label for="area-of-study-id">学問分類ID</label>
			<input id="area-of-study-id" v-model="selectedLecture.area_of_study_id"/>
		</div>
		<div>
			<label for="number-of-frames">コマ数</label>
			<select id="number-of-frames" v-model="selectedLecture.number_of_frames">
				<option v-for="courseTime in courseTimes" :value="courseTime.value" v-text="courseTime.value"></option>
			</select>
		</div>
		<button @click="saveConfirm()">登録</button>
	</div>
    <div  id="course-left" v-if='isShowDetail'>
    <b id="header-size">講座詳細</b>
    <table>
        <tr>
        <th>講座ID</th><td  v-text="selectedLecture.id"></td>
        </tr>
        <tr>
        <th>講座名</th><td v-text='selectedLecture.name'></td>
        </tr>
        <tr>
        <th>開講曜日</th><td v-text='selectedLecture.class_day'></td>
        </tr>
        <tr>
        <th>開講時限</th><td v-text='selectedLecture.course_time'></td>
        </tr>
        <tr>
        <th>学問分類ID</th><td v-text='selectedLecture.area_of_study_id'></td>
        </tr>
        <tr>
        <th>コマ数</th><td v-text='selectedLecture.number_of_frames'></td>
        </tr>
        <tr>
        <th>ユーザーID</th><td v-text='selectedLecture.insert_user_id'></td>
        </tr>
        <tr>
        <th>登録日時</th><td v-text='selectedLecture.insert_date'></td>
        </tr>
        <tr>
        <th>更新ユーザーID</th><td v-text='selectedLecture.update_user_id'></td>
        </tr>
        <tr>
        <th>更新日時</th><td v-text='selectedLecture.update_date'></td>
        </tr>
    </table>
    </div>
</div>


