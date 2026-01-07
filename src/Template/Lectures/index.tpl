
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
            // selectedLectureで設定した要素をlecturesで使えるようにしている
                // ↓sqlで取得した情報を使えるようにしてくれている
				lectures        : {$lectures},
				courseTimes     : {$courseTimes},
				editId          : null,
                selectedLecture : null,
                pageMode        : {$this->Enum->PageMode->LIST->value},
                studyAreaOptions: {$studyAreaOptions},
                isShowSearchArea : '{$isShowSearchArea}',
			},
            // created(){
            //     if(this.lectures.length == 0){
            //         setTimeout(() => {
            //             alert('検索結果が０件でした。条件を変更して再度検索を行ってください。');
            //         }, 1);                    
            //     }
            // },
            mounted(){  
                if(this.lectures.length == 0){
                    setTimeout(() => {
                        const result = alert('検索結果が０件でした。条件を変更して再度検索を行ってください。');
                    }, 1);                    
                }
            },
			methods:{
				goEdit: function(lectureId){
                    // selectedlectureに講座を代入
                    this.pageMode = {$this->Enum->PageMode->EDIT->value};
                    this.editId = lectureId;
                    for(let i=0;i<this.lectures.length; i++){
						if(this.lectures[i].id == lectureId){
							this.selectedLecture = Object.assign({}, this.lectures[i]);
						}
                    }

				},
				goDetail: function(lectureId){
                    // 未完成
                    for(let i=0;i<this.lectures.length; i++){
						if(this.lectures[i].id == lectureId){
							this.selectedLecture = Object.assign({}, this.lectures[i]);
                        }
                    }
                    this.pageMode = {$this->Enum->PageMode->DETAIL->value};
                    console.log(this.lectures)
				},
                goAdd:function(){
                    this.pageMode = {$this->Enum->PageMode->ADD->value};
                    console.log(this.lectures)
                    this.editId = null;
                    this.selectedLecture = {
                        id              : null,
                        lecture_name    : null,
                        class_day       :{$this->Enum->DayOfWeek->MONDAY->value},
                        course_time     : 1,
                        area_of_study_id: null,
                        number_of_frames: 1,
                    };
                },

                deleteConfirm:function(lectureId){
                    // confirmは確認
					this.editId = lectureId;
					const result = window.confirm('削除します。よろしいですか？');
                    if(result){
                        // buildはURLをどこにするかという意味
                        const url = '{$this->Url->build(['action'=>'delete', '_ext'=>'json'])}'; 
                        const data = {
                            editId: this.editId,
                        };
                        const fn = function(dataFromAjax){
                        location.reload();
                        }
						stsAjax(url, data, fn);
                    }
                    this.pageMode = {$this->Enum->PageMode->LIST->value};
                    this.selectedLecture = null;
                },
                
				saveConfirm: function(){		
					const result = window.confirm('この内容で登録します。よろしいですか？');
                    // OKを押すことによってtrue判定になる
					if(result){
                        // 未完成
                        const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
                        const data = {
                            // 編集する講座ID
                            editId: this.editId,
                            // 入力した内容 左のほうはただの名前
                            selectedLecture: this.selectedLecture,
                        };
                        const fn = function(dataFromAjax){
                                // 正常に登録処理を行うときのみ
                                location.reload();
                        }
						stsAjax(url, data, fn);
                        this.pageMode = {$this->Enum->PageMode->LIST->value};
					}
				},

                switchingSearchConditions: function(){
                    // this.isShowSearchAreaとは反対の判定に変更している
                    this.isShowSearchArea = !this.isShowSearchArea;
                },

                clear: function(){
                    console.log('クリアボタンを押しました。')
                    window.location.href = '{$this->Url->build(['action'=>'index'])}'
                },
			},
            // 何かしらの評価(true,false)・処理によって、1つの値を算出したいとき
			computed: {
                // selectedlectureと条件が一致したときにisShowをtrueやfalseに変更する
				isShow: function(){
					return (this.pageMode == {$this->Enum->PageMode->ADD->value} || this.pageMode == {$this->Enum->PageMode->EDIT->value});
				},
                isShowDetail: function(){
                    return (this.pageMode == {$this->Enum->PageMode->DETAIL->value});
                },
                varietyTriangle: function(){
                    if(this.isShowSearchArea){
                        return "▼";
                    }else{
                        return "▶";
                    }
                }

			},
            // watch: {
            //     // 監視
            //     // 何か変更されるたびになにかしら処理を行うもの
            //     // newVal: 変更後の値
            //     // oldVal: 変更前の値
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
            // }
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
.course-list {
	min-width:540px;
}
#search-conditions-area{
 border: black 1px solid; 
 padding: 3px 15px; 
 margin-bottom: 10px   
}

.course-edit {
	margin-left: 200px;
	min-width:350px;
}
label {
	width: 120px;
}
input, select {
	width: 200px;
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
    width:300px;
}
.detail-position{
    margin-left: 200px;
}
</style>

<a href="{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/{$loginUserId}"> <  マイページへ戻る</a>
<div id="vm" style="display:flex;" class="main-size">
	<div class="course-list">
        <div>
            <h1>講座一覧</h1>
            <button @click="goAdd()" class="add-button" style="margin-left: 80px;">追加</button>
        </div>
 {*  *}
        <div id="search-conditions-area">
            {$this->Form->create($isShowSearchArea,['type'=>'get'])}        
            <span @click="switchingSearchConditions()" style="cursor: pointer" v-text="varietyTriangle"></span>
                検索条件
            <div style="padding: 3px 25px;" v-if="isShowSearchArea">
                <div>
                    <label for="lecture-name">
                        講座名
                    </label>
                    <span>
                        {$this->Form->input('lecture_name',['type'=>'get'])}
                    </span>
                </div>
                <div>
                    <label for='area_of_study_name'>
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
                        {$this->Form->input('class_day', ['options' => $this -> Enum -> DayOfWeek -> getValuesAndTexts(), 'empty' => '選択してください'])}
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
                    {* ↓type="submit"が省略されている *}
                    <button>検索</button>
                </div>
                {* ↓input内に入った文字がControllerに送られてもう一度indexが動くようになっている *}
                {$this->Form->end()}
            </div>
        </div>
        <table class="course-list">
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
	<div class="course-edit" v-if="isShow">		
        <h1 v-if='editId !== null'>講座内容 編集</h1>
        <h1 v-else>講座内容 登録</h1>
		<div v-if='editId !== null'>
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
			<label for="area-of-study-id">学問分類</label>
            <select id="area_of_study_id" v-model="selectedLecture.area_of_study_id">
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
    <div v-if='isShowDetail'>
        <div class="detail-position">
            <h1>講座詳細</h1>
            <table id="detail-table">
                <thead>
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
                        {* <td v-text="{$this->Enum->DayOfWeek->getTextByValue($lectures->class_day)}"></td> *}
                    </tr>
                    <tr>
                        <th>開講時限</th>
                        <td v-text="selectedLecture.course_time +'限'"></td>
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
                        {* <td v-if='selectedLecture.insert_user == null'></td>
                        <td v-else v-text="selectedLecture.insert_user.family_name + ' ' + selectedLecture.insert_user.first_name "  ></td> *}
                        <td v-text="selectedLecture.insert_user_name"></td>
                    </tr>
                    <tr>
                        <th>登録日時</th>
                        <td v-text="selectedLecture.insert_date"></td>
                    </tr>
                    <tr>
                        <th>更新ユーザー</th>
                        {* <td v-if='selectedLecture.update_user == null'></td>
                        <td v-else v-text="selectedLecture.update_user.family_name +' ' + selectedLecture.update_user.first_name"></td> *}
                        <td v-text='selectedLecture.update_user_name'></td>
                    </tr>
                    <tr>
                        <th>更新日時</th>
                        <td v-text="selectedLecture.update_date"></td>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</div>

