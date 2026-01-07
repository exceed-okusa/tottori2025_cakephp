
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
            // データを書いておくとき
			data:{
				lectures    : {$lectures},
				courseTimes : {$courseTimes},
                studyAreaOptions : {$studyAreaOptions},
				editId      : null,
                selectedLecture: null,
                // isShow      : false,
                // isShowDetail: false,
                pageMode    : {$this->Enum->PageMode->LIST->value},
                isShowSearchArea: '{$isShowSearchArea}',
			},
            // 登録ボタンとか作るとき
			methods:{
				goEdit: function(lectureId){
                    this.pageMode = {$this->Enum->PageMode->EDIT->value};
                    // this.isShowDetail = false;
					this.editId = lectureId;
                    for(let i=0;i<this.lectures.length; i++){
						if(this.lectures[i].id == lectureId){
							this.selectedLecture = Object.assign({}, this.lectures[i]);
                            this.isShow = true;
						}
					};
				},
				goDetail: function(lectureId){
                    this.pageMode = {$this->Enum->PageMode->DETAIL->value};
                    // this.isShow = false;
                    // this.isShowDetail = true;
                    for(let i=0;i<this.lectures.length; i++){
						if(this.lectures[i].id == lectureId){
							this.selectedLecture = Object.assign({}, this.lectures[i]);
						}
					};
				},
                goAdd: function(){
                    this.pageMode = {$this->Enum->PageMode->ADD->value};
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
                    // this.selectedLecture = null;
                    // this.isShow = false;
                    // this.isShowDetail = false;
                    this.editId = lectureId;
                    const result = window.confirm('削除します。よろしいですか？');
                    if(result){
                        // this.selectedLecture = null;

                        const url = '{$this->Url->build(['action'=>'delete', '_ext'=>'json'])}'
                        const data = {
                            editId: this.editId,
                        };
                        const fn = function(dataFromAjax){
                            location.reload();
                            
                        
                        }
						stsAjax(url, data, fn);
					}
                    // 一覧を設定する
                    // 削除を押したら詳細や編集などの右側の表示を見えなくしたいから、一覧だけを表示するために書く                    
                    this.pageMode = {$this->Enum->PageMode->LIST->value};
                    // 表がなくなったから何も選ばれてない状態にしよう
                    this.selectedLecture = null;
                },
				saveConfirm: function(){		
					const result = window.confirm('この内容で登録します。よろしいですか？');
					if(result){
                        // 未完成
                        const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
                        const data = {

                        editId: this.editId,
                        selectedLecture: this.selectedLecture
                        };
                        const fn = function(dataFromAjax){
                            location.reload();
                        }
						stsAjax(url, data, fn);
				    }
			    },
                switchingSearchConditions: function(){
                    // console.log('aaa');
                    this.isShowSearchArea = !this.isShowSearchArea;
                },
                clear: function(){
                    window.location.href = '{$this->Url->build(['action'=>'index'])}';
                },
            },
            computed: {
                isShow: function(){
                    return (this.pageMode == {$this->Enum->PageMode->ADD->value} || this.pageMode == {$this->Enum->PageMode->EDIT->value});
                    // if(this.pageMode == 3 || this.pageMode == 4){
                    //     return true;
                    // }
                    // return false;
                },
                isShowDetail: function(){
                    return this.pageMode == {$this->Enum->PageMode->DETAIL->value};
                    // if(this.pageMode == 2 || this.pageMode == 1){
                    //     return true;
                    // }
                    // return false;
                },
                toggleText: function(){
                    if(this.isShowSearchArea){
                        return '▼';
                    }
                    return '▶';
                }
                // returnの後 文字列、判定結果、条件に対してtrueかfalseかを返す、オブジェクトが来る
            },
            
            mounted() {
                if(this.lectures.length == 0){
                    setTimeout(()=>{
                    alert('検索結果が０件でした。条件を変更して再度検索を行ってください。');
                    },1);
                    
                }
            },
            // created() {
            //     if(this.lectures.length == 0){
            //         setTimeout(() => {
            //         alert('検索結果が０件でした。条件を変更して再度検索を行ってください。');
            //         },1);
                    
            //     }    
            // },

			// computed: {
            //     // 何かしらの評価・処理によって、一つの値を算出したいとき
			// 	isShow: function(){
			// 		return this.selectedLecture != null;
			// 	}
			// },
            // watch: {
            //     editId: function(newVal, oldVal){
            //         // 途中です
            //         console.log(newVal);
            //         console.log(oldVal);
            //         for(let i=0;i<this.lectures.length; i++){
			// 			if(this.lectures[i].id == newVal){
			// 				this.selectedLecture = Object.assign({}, this.lectures[i]);
			// 			}
			// 		};
			// 		return null;
			// 	},
            // },
		});
    //-->
    //]]>
</script>
{$this->end()}

<style>
#lectures-header {
    display: flex;
    align-items: center;
}
.add-button {
    margin-left: 80px;
}
#course-list, #course-list-table {
	min-width:540px;
}
#search-conditions-area {
    border: 1px black solid;
    padding: 3px 15px;
    margin-bottom: 10px;
    transition: 
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
.sub-menu-title {
    margin-left: 200px;
    min-width:350px;
}

#detail-table {
    border: 2px black solid;
}
#detail-table th {
    background-color: bisque;
    border-right: 2px black solid;
}
#detail-table td {
    background-color: white;
    text-align: left;
    width: 300px;
}

</style>
<a href="{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/{$loginUserId}">＜マイページへ戻る</a>
{*display:flex; 子要素を全部横並びにする *}
<div id="vm" style="display:flex;">    
	<div id="course-list">
        <div style="display:flex; align-items:center;">
		<h1>講座一覧</h1>
		<button @click="goAdd()" class="add-button" style="margin-left: 80px;">追加</button>
	</div>
    
    <div id="search-conditions-area">
    {$this->Form->create($lectureConditions,['type'=>'get'])}
    <span @click="switchingSearchConditions()" style="cursor: pointer;" v-text="toggleText"></span>
        検索条件
        <div v-if="isShowSearchArea">
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
                    {$this->Form->input('class_day', ['options' => $this->Enum->DayOfWeek->getValuesAndTexts(),'empty' => '選択してください'])}
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
            
        </div>
        
    {$this->Form->end()}
    </div>
        
			<table id="course-list-table">
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
	<div class="sub-menu-title" id="course-edit" v-if="isShow">
		<h1 v-if="editId !==null">講座内容 編集</h1>
        <h1 v-else>講座内容 登録</h1>
		<div v-if="editId !==null">
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
        {* ブラウザで「学問分類」をクリックしたときにセレクトボックスが反応するようにするためにlabel forとidの名前を同じにしないといけない *}
			<label for="area-of-study-id">学問分類</label>
            <select id="area-of-study-id" v-model="selectedLecture.area_of_study_id">
                <option v-for="studyAreaOption in studyAreaOptions" :value="studyAreaOption.value" v-text="studyAreaOption.text"></option>
            </select>
		</div>
		<div>
			<label for="number-of-frames">コマ数</label>
			<select id="number-of-frames" v-model="selectedLecture.number_of_frames">
				<option v-for="courseTime in courseTimes" :value="courseTime.value" v-text="courseTime.value"></option>
			</select>
		</div>
		<button @click="saveConfirm()">登録</button>
	</div>
    <div class="sub-menu-title" v-if="isShowDetail">
        <h1>講座詳細</h1>
        <table id="detail-table">
            <tbody>
                <tr>
                    <th>講座ID</th>
                    <td v-text="selectedLecture.id"></td>
                </tr>
                <tr>
                    <th>講座名</th>
                    <td v-text="selectedLecture.lecture_name"></td>
                </tr>
                <tr>
                    <th>開講曜日</th>
                    <td v-text="selectedLecture.class_day_label"></td>
                    {* {$this->Enum->DayOfWeek->getTextByValue(selectedLecture.class_day)} *}
                </tr>
                <tr>
                    <th>開講時限</th>
                    <td v-text="selectedLecture.course_time + '限'"></td>
                </tr>
                <tr>
                    <th>学問分類名</th>
                    <td v-text="selectedLecture.area_of_study.area_of_study_name"></td>
                </tr>
                <tr>
                    <th>コマ数</th>
                    <td v-text="selectedLecture.number_of_frames"></td>
                </tr>
                <tr>
                    <th>登録ユーザー</th>
                    {* <td v-if="selectedLecture.insert_user == null"></td>
                    <td v-else v-text="selectedLecture.insert_user.family_name + ' ' + selectedLecture.insert_user.first_name"></td> *}
                    
                    <td v-text="selectedLecture.insert_user_name"></td>
                </tr>
                <tr>
                    <th>登録日時</th>
                    <td v-text="selectedLecture.insert_date"></td>
                </tr>
                <tr>
                    <th>更新ユーザーID</th>
                    <td v-text="selectedLecture.update_user_id"></td>
                </tr>
                <tr>
                    <th>更新ユーザー</th>
                    {* <td v-if="selectedLecture.update_user == null"></td>
                    <td v-else v-text="selectedLecture.update_user.family_name + ' ' + selectedLecture.update_user.first_name"></td> *}
                    <td v-text="selectedLecture.update_user_name"></td>
                </tr>
                <tr>
                    <th>更新日時</th>
                    <td v-text="selectedLecture.update_date"></td>
                </tr>    
            </tbody>
        </table>
    </div>
</div>