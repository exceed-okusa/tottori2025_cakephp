
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
                areaOfStudies             : {$areaOfStudies},
                pageMode                  : {$this->Enum->PageMode->LIST->value},
                editId                    : null,
                selectedAreaOfStudy       : null,
                isShowSearchArea          : '{$isShowSearchArea}',
                sortTriangle              : true,
                hasOrderColumn            : 'area_of_study_id',
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
                    // OKを押すことによってtrue判定になる
					if(result){
                        // 未完成
                        const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
                        const data = {
                            // 編集する講座ID
                            editId: this.editId,
                            // 入力した内容 左のほうはただの名前
                            selectedAreaOfStudy: this.selectedAreaOfStudy,
                        };
                        const fn = function(dataFromAjax){
                                // 正常に登録処理を行うときのみ
                                location.reload();
                        }
						stsAjax(url, data, fn);
                        this.pageMode = {$this->Enum->PageMode->LIST->value};
					}
				},
                goAdd:function(){
                    this.pageMode = {$this->Enum->PageMode->ADD->value};
                    this.editId = null;
                    this.selectedAreaOfStudy = {
                        id                : null,
                        area_of_study_name: null,
                    };
                },
                goDetail: function(areaOfStudyId){
                    // 未完成
                    for(let i=0;i<this.areaOfStudies.length; i++){
						if(this.areaOfStudies[i].id == areaOfStudyId){
							this.selectedAreaOfStudy = Object.assign({}, this.areaOfStudies[i]);
                            console.log(this.selectedAreaOfStudy);
                        }
                    }
                    this.pageMode = {$this->Enum->PageMode->DETAIL->value};
				},
                deleteConfirm:function(areaOfStudyId){
                    // confirmは確認
					this.editId = areaOfStudyId;
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
                    this.selectedAreaOfStudy = null;
                },
                switchingSearchConditions: function(){
                    // this.isShowSearchAreaとは反対の判定に変更している
                    this.isShowSearchArea = !this.isShowSearchArea;
                },
                clear: function(){
                    console.log('クリアボタンを押しました。');
                    window.location.href = '{$this->Url->build(['action'=>'index'])}';
                },
                onChangeTrianglePositionName: function(column){                   
                    if(this.hasOrderColumn == column){
                        this.sortTriangle = !this.sortTriangle;
                    }else{
                        this.hasOrderColumn = column;
                        this.sortTriangle = true;
                    }    
                    let judgeOrder = 'ASC';
                    if(!this.sortTriangle){
                        judgeOrder = 'DESC';
                    }
                    window.location.href = '{$this->Url->build(['action'=>'index'])}?sort=' + this.hasOrderColumn + '&direction=' + judgeOrder;
                },
            },
            computed:{
                isShow: function(){
                    return (this.pageMode == {$this->Enum->PageMode->ADD->value} || this.pageMode == {$this->Enum->PageMode->EDIT->value})
                },
                isShowDetail: function(){
                    return (this.pageMode == {$this->Enum->PageMode->DETAIL->value});
                },
                triangleDirection: function(){
                     if(this.isShowSearchArea){
                        return  '▼';
                     }else{
                        return  '▶';
                    }
                },
                triangleMark: function(){
                    if(this.sortTriangle){
                        return "▲";
                    }else{
                        return "▼";
                    }
                }
            },
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
.pointer {
    cursor: pointer;
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
            <h1>学問分類一覧</h1>
            <button @click="goAdd()" class="add-button"  >追加</button>
        </div>
{*  *}
        <div id="search-conditions-area">
            {$this->Form->create($lectureConditions,['type'=>'get'])}        
            <span @click="switchingSearchConditions()" class="pointer" v-text="triangleDirection"></span>
                検索条件
            <div style="padding: 3px 25px;" v-if = "isShowSearchArea">
                <div>
                    <label for="area_of_study_name">
                        学問分類名
                    </label>
                    <span>
                        {$this->Form->input('area_of_study_name',['type'=>'text'])}
                    </span>
                </div>
                <div style="text-align: right;">
                    <button type = "button" @click="clear()">クリア</button>
                    <button>検索</button>
                </div> 
                 {* ↓input内に入った文字がControllerに送られてもう一度indexが動くようになっている *}
                {$this->Form->end()}
            </div>
        </div>
        <table class="course-list">
            <thead>
                <tr>
                    <th>
                        <span class="pointer" @click="onChangeTrianglePositionName('area_of_study_id')">学問分類ID</span>
                        <span class="pointer" @click="onChangeTrianglePositionName('area_of_study_id')" v-text='triangleMark' v-show="hasOrderColumn == 'area_of_study_id'"></span>
                    </th>
                    <th>
                        <span class="pointer" @click="onChangeTrianglePositionName('area_of_study_name')">学問分類名</span>
                        <span class="pointer" @click="onChangeTrianglePositionName('area_of_study_name')" v-show="hasOrderColumn == 'area_of_study_name'" v-text='triangleMark'></span>
                    </th>
                    <th></th>
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
    <div class="course-edit" v-if="isShow">		
        <h1 v-if='editId !== null'>学問分類内容 編集</h1>
        <h1 v-else>学問分類内容 登録</h1>
		<div v-if='editId !== null'>
			<label for="areaOfStudy-id">学問分類ID</label>
			<span id="areaOfStudy-id" v-text="selectedAreaOfStudy.id"></span>
		</div>
		<div>
			<label for="areaOfStudy-name">学問分類名</label>
			{$this->Form->input('area_of_study_name',['v-model'=>'selectedAreaOfStudy.area_of_study_name'])}
		</div>
		<button @click="saveConfirm()">登録</button>
    </div>
    <div v-if='isShowDetail'>
        <div class="detail-position">
            <h1>学問分類詳細</h1>
            <table id="detail-table">
                <thead>
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
                        <td v-text='selectedAreaOfStudy.update_user_name'></td>
                    </tr>
                    <tr>
                        <th>更新日時</th>
                        <td v-text="selectedAreaOfStudy.update_date"></td>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</div>{*  *}
