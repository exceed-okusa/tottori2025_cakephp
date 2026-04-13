
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
                areaOfStudies: {$areaOfStudies},
                editId: null,
                pageMode: {$this->Enum->PageMode->LIST->value},
                selectedAreaOfStudy: null,
                isShowSearchArea : '{$isShowSearchArea}',
                isOrderAsc       : '{$isOrderAsc}', // 昇順かどうか
                hasOrderColumn   : '{$hasOrderColumn}', // 講座ID:'lecture_id',講座名:'lecture_name',学問分類名:'study_area_name'
			},
			methods:{
                goEdit: function(areaOfStudyId){
                    this.pageMode = {$this->Enum->PageMode->EDIT->value};
                    this.editId = areaOfStudyId;
                    for(let i=0;i<this.areaOfStudies.length; i++){
						if(this.areaOfStudies[i].id == areaOfStudyId){
							this.selectedAreaOfStudy = Object.assign({}, this.areaOfStudies[i]);
						}
					}
                },
                saveConfirm: function(){		
					const result = window.confirm('この内容で登録します。よろしいですか？');
					if(result){
                        const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
                        const data = {
                            // 編集する学問分類ID(追加の時はnull)
                            editId: this.editId,
                            // 入力した内容
                            selectedAreaOfStudy: this.selectedAreaOfStudy,
                        };
                        const fn = function(dataFromAjax){
                            // 画面再描画(正常に登録処理を行うときのみ)
                            location.reload();
                        }
						stsAjax(url, data, fn);
					}
				},
                goAdd: function(){
                    this.pageMode = {$this->Enum->PageMode->ADD->value};
                    this.editId = null;
                    this.selectedAreaOfStudy = {
                        id: null,
                        area_of_study_name: '',
                    };
                },
                goDetail: function(areaOfStudyId){
                    this.pageMode = {$this->Enum->PageMode->DETAIL->value};
                    this.editId = areaOfStudyId;
                    for(let i=0;i<this.areaOfStudies.length; i++){
						if(this.areaOfStudies[i].id == areaOfStudyId){
							this.selectedAreaOfStudy = Object.assign({}, this.areaOfStudies[i]);
						}
					}
				},
                deleteConfirm: function(areaOfStudyId){
                    this.editId = areaOfStudyId;
                    const result = window.confirm('削除します。よろしいですか？');
                    if(result){
                        const url = '{$this->Url->build(['action'=>'delete', '_ext'=>'json'])}';
                        const data = {
                            // 編集する学問分類ID
                            editId: this.editId,
                        };
                        const fn = function(dataFromAjax){
                            // 画面再描画
                            location.reload();
                        }
						stsAjax(url, data, fn);
					}
                    // 右側の表示を非表示にするため
                    this.pageMode = {$this->Enum->PageMode->LIST->value};
                    this.selectedAreaOfStudy = null;
                },
                switchingSearchConditions: function () {
                    this.isShowSearchArea = !this.isShowSearchArea;
                },
                clear: function () {
                    window.location.href = '{$this->Url->build(['action'=>'index'])}';
                },
                switchingDisplayOrder: function (column) {
                    if (this.hasOrderColumn == column) {
                        this.isOrderAsc = !this.isOrderAsc;
                    } else {
                        this.hasOrderColumn = column;
                        this.isOrderAsc = true;
                    }

                    const order = (this.isOrderAsc ? 'ASC' : 'DESC'); // 三項演算子 (条件 ? trueの場合 : falseの場合)
                    window.location.href = '{$this->Url->build(['action'=>'index'])}?sort=' + this.hasOrderColumn + '&direction=' + order;
                },
			},
            computed: {
                isShow: function(){
                    return (this.pageMode == {$this->Enum->PageMode->ADD->value}
                        || this.pageMode == {$this->Enum->PageMode->EDIT->value});
                },
                isShowDetail: function(){
                    return this.pageMode == {$this->Enum->PageMode->DETAIL->value};
                },
                toggleText: function() {
                    if (this.isShowSearchArea) {
                        return '▼';
                    }
                    return '▶';
                },
                displayOrderLabel: function() {
                    if (this.isOrderAsc) {
                        return '▲';
                    }
                    return '▼';
                },
            },
		});
    //-->
    //]]>
</script>
{$this->end()}

<style>
#lectures-header {
    /* 子要素を横並びにさせる */
    display: flex; 
    align-items: center;
}
.add-button {
    margin-left: 80px;
}

.course-list {
	min-width:540px;
}
/* 検索条件部分 */
#search-conditions-area {
    border: black 1px solid;
    padding: 3px 15px;
    margin-bottom: 10px;
}
.pointer {
    cursor: pointer;
}
.sub-menu-title {
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
    width: 300px;
}
</style>

<a href="{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/{$loginUserId}">< マイページへ戻る</a>
<div id="vm" style="display:flex;">
    <div class="course-list">
        <div id="lectures-header">
            <h1>学問分類一覧</h1>
            <button @click="goAdd()" class="add-button">追加</button>
        </div>

        <div id="search-conditions-area">
            <span @click="switchingSearchConditions()" class="pointer" v-text="toggleText"></span>
            <span>検索条件</span>
            <div style="padding: 3px 25px;" v-show="isShowSearchArea">
                {$this->Form->create($lectureConditions,['type'=>'get'])}
                <div>
                    <label for="area-of-study-name">
                        学問分類名
                    </label>
                    <span>
                        {$this->Form->input('area_of_study_name', ['type'=> 'text'])}
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
                        <span class="pointer" @click="switchingDisplayOrder('area_of_study_id')">学問分類ID</span>
                        <span class="pointer" v-show="hasOrderColumn == 'area_of_study_id'" @click="switchingDisplayOrder('area_of_study_id')" v-text="displayOrderLabel"></span>
                    </th>
                    <th>
                        <span class="pointer" @click="switchingDisplayOrder('area_of_study_name')">学問分類名</span>
                        <span class="pointer" v-show="hasOrderColumn == 'area_of_study_name'" @click="switchingDisplayOrder('area_of_study_name')" v-text="displayOrderLabel"></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="areaOfStudy in areaOfStudies">
                    <td v-text="areaOfStudy.id"></td>
                    <td v-text="areaOfStudy.area_of_study_name"></td>
                    <td>
                        <button style="margin:0 10px;" @click="goEdit(areaOfStudy.id)">編集</button>
                        <button style="margin:0 10px;" @click="goDetail(areaOfStudy.id)">詳細</button>
                        <button style="margin:0 10px;" @click="deleteConfirm(areaOfStudy.id)">削除</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="sub-menu-title" v-if="isShow">
        <h1 v-if="editId == null">学問分類内容 登録</h1>
        <h1 v-else>学問分類内容 編集</h1>
        <div v-if="editId != null">
            <label for="area-of-study-id">ID</label>
            <span id="area-of-study-id" v-text="selectedAreaOfStudy.id"></span>
        </div>

        <div>
            <label for="area-of-study-name">学問分類名</label>
            {$this->Form->input('area_of_study_name',['v-model'=>'selectedAreaOfStudy.area_of_study_name'])}
        </div>
        <button @click="saveConfirm()">登録</button>
    </div>
        {* 詳細 *}
    <div class="sub-menu-title" v-if="isShowDetail">
        <h1>学問分類詳細</h1>
        <table id="detail-table">
            <tbody>
                <tr>
                    <th>学問分類ID</th>
                    <td v-text="selectedAreaOfStudy.id"></td>
                </tr>
                <tr>
                    <th>学問分類名</th>
                    <td v-text="selectedAreaOfStudy.area_of_study_name"></td>
                </tr>
                <tr>
                    <th>登録ユーザー</th>
                    <td v-text="selectedAreaOfStudy.insert_user_name"></td>
                </tr>
                <tr>
                    <th>登録日時</th>
                    <td v-text="selectedAreaOfStudy.insert_date"></td>
                </tr>
                <tr>
                    <th>更新ユーザー</th>
                    <td v-text="selectedAreaOfStudy.update_user_name"></td>
                </tr>
                <tr>
                    <th>更新日時</th>
                    <td v-text="selectedAreaOfStudy.update_date"></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>