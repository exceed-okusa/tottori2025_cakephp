
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
				lectures         : {$lectures},
				courseTimes      : {$courseTimes},
                studyAreaOptions : {$studyAreaOptions},
				editId           : null,
                selectedLecture  : null,
                pageMode         : {$this->Enum->PageMode->LIST->value},
                isShowSearchArea : '{$isShowSearchArea}',
                isOrderAsc       : '{$isOrderAsc}', // 昇順かどうか
                hasOrderColumn   : '{$hasOrderColumn}', // 講座ID:'lecture_id',講座名:'lecture_name',学問分類名:'study_area_name'
			},
			methods:{
				goEdit: function(lectureId){
					this.editId = lectureId;
				},
				goDetail: function(){
                    // 未完成
				},
				deleteConfirm: function(){
                    // 未完成
				},
				saveConfirm: function(){		
					const result = window.confirm('この内容で登録します。よろしいですか？');
					if(result){
						// 未完成
						const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
						const data = {
							editId: this.editId,
              selectedLecture: this.selectedLecture,
						};
						const fn = function(dataFromAjax){
							location.reload();
						}
						stsAjax(url, data, fn);
					}
				},
                switchingSearchConditions: function () {
                    this.isShowSearchArea = !this.isShowSearchArea;
                },
                switchingDisplayOrder: function (column) {
                    if (this.hasOrderColumn == column) {
                        this.isOrderAsc = !this.isOrderAsc;
                    } else {
                        this.hasOrderColumn = column;
                        this.isOrderAsc = true;
                    }
                },
                clear: function () {
                    window.location.href = '{$this->Url->build(['action'=>'index'])}';
                },
                test: function () {
                    const order = (this.isOrderAsc ? 'ASC' : 'DESC'); // 三項演算子 (条件 ? trueの場合 : falseの場合)
                    window.location.href = '{$this->Url->build(['action'=>'index'])}?sort=' + this.hasOrderColumn + '&direction=' + order;
                },
			},
			computed: {
				isShow: function(){
					return this.selectedLecture != null;
				}
			},
      watch: {
        editId: function(newVal, oldVal){
          for(let i=0;i<this.lectures.length; i++){
						if(this.lectures[i].id == newVal){
							this.selectedLecture = Object.assign({}, this.lectures[i]);
						}
					}
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
	<div class="course-list">
        <div id="lectures-header">
            <h1>講座一覧</h1>
            <button @click="goAdd()" class="add-button">追加</button>
            <button @click="test()">テスト</button>
        </div>
        <div id="search-conditions-area">
            <span @click="switchingSearchConditions()" class="pointer" v-text="toggleText"></span>
            <span>検索条件</span>
            <div style="padding: 3px 25px;" v-show="isShowSearchArea">
                {$this->Form->create($lectureConditions,['type'=>'get'])}
                <div>
                    <label for="lecture-name">
                        講座名
                    </label>
                    <span>
                        {$this->Form->input('lecture_name', ['type'=> 'text'])}
                    </span>
                </div>
                <div>
                    <label for="area-of-study-name">
                        学問分類名
                    </label>
                    <span>
                        {$this->Form->input('area_of_study_name', ['type'=> 'text'])}
                    </span>
                </div>
                <div>
                    <label for="class-day">
                        開講曜日
                    </label>
                    <span>
                        {$this->Form->input('class_day', ['options' => $this->Enum->DayOfWeek->getValuesAndTexts(), 'empty' => '選択してください'])}
                    </span>
                </div>
                <div>
                    <label for="course-time">
                        開講時限
                    </label>
                    <span>
                        {$this->Form->input('course_time', ['type'=> 'text'])}
                    </span>
                </div>
                <div>
                    <label for="number-of-frames">
                        コマ数
                    </label>
                    <span>
                        {$this->Form->input('number_of_frames', ['type'=> 'text'])}
                    </span>
                </div>
                <div style="text-align: right;">
                    <button type="button" @click="clear()">クリア</button>
                    <button>検索</button> 
                </div>
                {$this->Form->end()}
            </div>
        </div>
        <table class="course-list">
            <thead>
                <tr>
                    <th>
                        <span class="pointer" @click="switchingDisplayOrder('lecture_id')">講座ID</span>
                        <span class="pointer" v-show="hasOrderColumn == 'lecture_id'" @click="switchingDisplayOrder('lecture_id')" v-text="displayOrderLabel"></span>
                    </th>
                    <th>
                        <span class="pointer" @click="switchingDisplayOrder('lecture_name')">講座名</span>
                        <span class="pointer" v-show="hasOrderColumn == 'lecture_name'" @click="switchingDisplayOrder('lecture_name')" v-text="displayOrderLabel"></span>
                    </th>
                    <th>
                        <span class="pointer" @click="switchingDisplayOrder('study_area_name')">学問分類名</span>
                        <span class="pointer" v-show="hasOrderColumn == 'study_area_name'" @click="switchingDisplayOrder('study_area_name')" v-text="displayOrderLabel"></span>
                    </th>
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

