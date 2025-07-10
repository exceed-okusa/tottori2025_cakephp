
{$this->start('scriptBottom')}
{$this->fetch('scriptBottom')}
<script type="text/javascript">
    //<![CDATA[
    {'<!--'}
		const vmMain = new Vue({
			el:'#vm',
			data:{
				account: '',
				password: '',
				loginErrorMessage: '',
                //失敗回数
                loginErrorCount: 0,
                isShowCount:false
			},
			methods:{
				login: function(){
					const url = '{$this->Url->build(['action'=>'login', '_ext'=>'json'])}';
					const data = {
						account: this.account,
						password: this.password,
                        //失敗回数
                        loginErrorCount:0,
					}; 
					const fn = function(dataFromAjax){
						console.log('結果:', dataFromAjax);
						if (dataFromAjax.status == 'success') {
							const userId = dataFromAjax.user.id;
							location.href = '{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/'+ userId;
						} else {
							vmMain.loginErrorMessage = dataFromAjax.message;
                            vmMain.isShowCount=true;
                            vmMain.loginErrorCount++;
                        }
					}
					stsAjax(url, data, fn);
				}
			},
		});
    //-->
    //]]>
</script>
{$this->end()}

<style>
	label {
		width: 100px;
	}
	#login-main {
		justify-content: center;
		display: grid;
	}
	#button-login {
		margin: 0 auto;
	}
	#error-message {
		margin-top	:20px;
		color		:red;
        text-align: center;
		font-weight	:bold;
	}

    #count-message {
		margin-top	:20px;
		color		:red;
        text-align: center;
		font-weight	:bold;
        border: solid 1px;
	}

</style>

<div id="vm">
	<h1 style="margin-left:25px;">Timetable system</h1>
	<div id="login-main">
		<div class="form-group">
			<label for="login-account">アカウント</label>
			<input type="text" id="login-account" v-model="account" />
		</div>
		<div class="form-group">
			<label for="login-password">パスワード</label>
			<input type="password" id="login-password" v-model="password" />
		</div>
		<div id="button-login">
			<button class="btn btn-primary btn-lg" @click="login()">ログイン</button>
		</div>
		<div id="error-message" v-text="loginErrorMessage"></div>
        <div v-if="isShowCount" id="count-message" v-text="'Login Failed : ' + loginErrorCount "></div>
	</div>
</div>


