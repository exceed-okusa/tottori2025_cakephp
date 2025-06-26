
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
				user: 	   {$user},
				authority: {$user->authority},
			},
			methods:{
				goLectures: function(){
					window.location.href = '{$this->Url->build(['controller'=>'Lectures', 'action'=>'index'])}'
				},
			},
		});
    //-->
    //]]>
</script>
{$this->end()}

<style>
	.main-button {
		margin :8px 4px;
	}
</style>

<div id="vm" style="margin-left:25px;">
	<h1>My Page</h1>
	<h4 v-text="user.family_name +' '+ user.first_name +' さん、こんにちは！'"></h4>
	<div class="col-sm-2">
		<div class="main-button" v-if="authority == {$this->Enum->Authority->TEACHER->value}">
			<button class="btn btn-primary btn-lg" @click="goLectures()">講座登録</button>
		</div>
		<div class="main-button">
			<button class="btn btn-primary btn-lg">履修登録</button>
		</div>
		<div class="main-button">
			<button class="btn btn-primary btn-lg">時間割確認</button>
		</div>
	</div>
</div>

