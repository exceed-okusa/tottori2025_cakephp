{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
                areaOfStudies: {$areaOfStudies},
                editId      : null,
                selectedAreaOfStudy: null,
                pageMode    : {$this->Enum->PageMode->LIST->value},
                isShowSearchArea: '{$isShowSearchArea}',
                isOrderAsc : '{$isOrderAsc}',
                hasOrderColumn : '{$hasOrderColumn}',
			},
			methods:{
                goEdit: function(areaOfStudiesId){
                    this.pageMode = {$this->Enum->PageMode->EDIT->value};
                    this.editId = areaOfStudiesId;
                    for(let i=0;i<this.areaOfStudies.length; i++){
						if(this.areaOfStudies[i].id == areaOfStudiesId){
							this.selectedAreaOfStudy = Object.assign({}, this.areaOfStudies[i]);
                            this.isShow = true;
						}
					};
                },
                goDetail: function(areaOfStudiesId){
                    this.pageMode = {$this->Enum->PageMode->DETAIL->value};
                    // this.isShow = false;
                    // this.isShowDetail = true;
                    for(let i=0;i<this.areaOfStudies.length; i++){
						if(this.areaOfStudies[i].id == areaOfStudiesId){
							this.selectedAreaOfStudy = Object.assign({}, this.areaOfStudies[i]);
                            console.log(this.selectedAreaOfStudy);
						}
					};
				},
                goAdd: function(){
                    this.pageMode = {$this->Enum->PageMode->ADD->value};
                    this.editId = null;
                    this.selectedAreaOfStudy = {
                        id : null,
                        area_of_study_name : '',
                    }
                },
                deleteConfirm: function(areaOfStudiesId){
                    // this.selectedLecture = null;
                    // this.isShow = false;
                    // this.isShowDetail = false;
                    this.editId = areaOfStudiesId;
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
                    this.selectedAreaOfStudy = null;
                },
                saveConfirm: function(){
                    const result = window.confirm('この内容で登録します。よろしいですか？');
                    if(result){
                        const url = '{$this->Url->build(['action'=>'save', '_ext'=>'json'])}';
                        const data = {

                        editId: this.editId,
                        selectedAreaOfStudy: this.selectedAreaOfStudy
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
                switchingDisplayOrder: function(column){
                    if(this.hasOrderColumn == column){
                        // ▲表示箇所とクリックした項目が同じ
                        // 上下切替 
                        // 上向き下向きの三角を切り替えて代入
                        this.isOrderAsc = !this.isOrderAsc;
                    }else{
                        // ▲表示箇所とクリックした項目が異なる
                        // 表示箇所を変更するけど切り替えは行わない
                        // 三角を表示する項目
                        this.hasOrderColumn = column;
                        // 三角を上向きにする
                        this.isOrderAsc = true;
                    }
                    let judgeOrder = 'ASC';
                    if(!this.isOrderAsc){
                        judgeOrder = 'DESC';
                    }
                    window.location.href = '{$this->Url->build(['action'=>'index'])}?sort=' + this.hasOrderColumn + '&direction=' + judgeOrder;
                },
                clear: function(){
                    window.location.href = '{$this->Url->build(['action'=>'index'])}';
                },
			},
        computed: {
            isShow: function(){
                    return (this.pageMode == {$this->Enum->PageMode->ADD->value} || this.pageMode == {$this->Enum->PageMode->EDIT->value});
            },
            isShowDetail: function(){
                    return this.pageMode == {$this->Enum->PageMode->DETAIL->value};
            },
            toggleText: function(){
                    if(this.isShowSearchArea){
                        return '▼';
                    }
                    return '▶';
            },
            displayOrderLabel: function(){
                    if(this.isOrderAsc){
                        return '▲';
                    }
                    return '▼';
                },
        },
        // mounted() {
        //         if(this.lectures.length == 0){
        //             setTimeout(()=>{
        //             alert('検索結果が０件でした。条件を変更して再度検索を行ってください。');
        //             },1);
                    
        //         }
        //     },
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
.pointer {
    cursor : pointer;
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

<a href="{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/{$loginUserId}">< マイページへ戻る</a>
<div id="vm" style="display:flex;">
	<div>
    <div>
        <h1>学問分類一覧</h1>
        <button @click="goAdd()" class="add-button">追加</button>
    </div>

    <div id="search-conditions-area">
    {$this->Form->create($lectureConditions,['type'=>'get'])}
    <span @click="switchingSearchConditions()" class="pointer" v-text="toggleText"></span>
        検索条件
        <div v-if="isShowSearchArea">
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
        </div>
    {$this->Form->end()}
    </div>
    <table>
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
    <div v-if="isShow">
        <h1 v-if="editId !==null">学問分類内容 編集</h1>
        <h1 v-else>学問分類内容 登録</h1>

        <div v-if="editId !==null">
			<label for="areaOfStudy-id">学問分類ID</label>
			<span id="areaOfStudy-id" v-text="selectedAreaOfStudy.id"></span>
		</div>
		<div>
			<label for="areaOfStudy-name">学問分類名</label>
			{$this->Form->input('area_of_study_name',['v-model'=>'selectedAreaOfStudy.area_of_study_name'])}
		</div>
        
		<button @click="saveConfirm()">登録</button>
    </div>
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
