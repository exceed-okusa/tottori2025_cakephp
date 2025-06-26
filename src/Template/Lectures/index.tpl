
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
			},
			methods:{
				goEdit: function(lectureId){
					this.editId = lectureId;
				},
				goDetail: function(){
                    // 未完成
				},
				saveConfirm: function(){		
					const result = window.confirm('この内容で登録します。よろしいですか？');
					if(result){
                        // 未完成
                        const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
                        const data = {

                        };
                        const fn = function(dataFromAjax){
                        
                        }
						stsAjax(url, data, fn);
					}
				},
			},
			computed: {
				isShow: function(){
					return this.selectedLecture != null;
				}
			},
            watch: {
                editId: function(newVal, oldVal){
                    // 途中です
                    console.log(newVal);
                    console.log(oldVal);
                    for(let i=0;i<this.lectures.length; i++){
						if(this.lectures[i].id == newVal){
							this.selectedLecture = Object.assign({}, this.lectures[i]);
						}
					};
					return null;
				},
            }
		});
    //-->
    //]]>
</script>
{$this->end()}

<style>
#course-list {
	min-width:460px;
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
	<div id="course-list">
		<h1>講座一覧</h1>
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
						</td>
					</tr>
				</tbody>
			</table>
	</div>
	<div id="course-edit" v-if="isShow">
		<h1>講座内容 編集</h1>
		<div>
			<label for="lecture-id">講座ID</label>
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
</div>

