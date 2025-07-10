
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
                loginErrorCount: 0, // ログイン失敗回数
                isShow: false       // ログイン失敗回数メッセージを表示するかどうか
			},
			methods:{
				login: function(){
					const url = '{$this->Url->build(['action'=>'login', '_ext'=>'json'])}';
					const data = {
						account         : this.account,
						password        : this.password,
                        // loginErrorCount : this.loginErrorCount,(使っても使わなくても)
					}; 
					const fn = function(dataFromAjax){
						console.log('結果:', dataFromAjax);
						if (dataFromAjax.status == 'success') {
							const userId = dataFromAjax.user.id;
							location.href = '{$this->Url->build(['controller'=>'MyPage', 'action'=>'edit'])}/'+ userId;
						} else {
	    					// ログイン失敗のときの処理	
                            vmMain.loginErrorMessage = dataFromAjax.message;
                            vmMain.isShow = true;
                            vmMain.loginErrorCount ++ ;
						}
					}
					stsAjax(url, data, fn);
				}
			}
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
		font-weight	:bold;
	}
    #error-message-count {
		color		:red;
		font-weight	:bold;
        border: solid 5px red;
        text-align: center;
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
        <div id="error-message-count" v-if="isShow" v-text="'Login Failed： ' + loginErrorCount"></div>
	</div>
</div>

