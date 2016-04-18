var template_login = function( static )
{
	$.extend(this, App.Template.emptyTemplate);
	this.static = static;
	this.defaultForm 	= 'frmLogin';
	this.haveData 		= true;
	this.forms =
	{
			frmLogin :
			{
				namespace 	: 'Login',
				buttons 	: ['btnDoLogin'],
				defaults 	: {
					labelSpan 	: '',
					inputSpan 	: ''
				},
				workspace 	: 'Profile',
				choose : function()
				{
					return 'login';
				},
				actions :
				{
					login :
					{
						enable 			: function()
						{
							return true;
						},
						taskAlias 		: $.proxy(function()
						{
							return 'Authenticate';
						}, this),
						task 			: 'Authenticate',
						dataHandler 	: false,
						dataTransform   : function(data)
						{
							return data.Login;
						},
						successHandler 	: $.proxy(function(response) {
							delete App.API.taskContracts['Profile.Login'];
							_w.onActiveAccount(response);
							App.Util.setCookie('UserName', $('#username').val(), 30);
							App.Controller.closeForm('frmHeader');
							if (!response.Data.forcePasswordChange)
							{
								_w.alert('Success', 'You have been logged into the system.', 'success', false);
							}
						}, this),
						errorHandler 	: $.proxy(function(response) {
							_w.notify('Error', response.Message);
							$('#btnDoLogin').prop('disabled', false);
						}, this),
						button : $.extend(true, {}, App.DataElement.Button, {
							id 				: 'btnDoLogin',
							label 			: 'Login',
							btnType: 'submit',
							btnStyle 		: 'btn-edit'
						})
					}
				},
				fields :
				{
					username : $.extend(true, {}, App.DataElement.String, {
						label				: 'Username',
						placeholder			: 'Username',
						inputType 			: 'username',
						inputWrapperStyle 	: 'form-group',
						themeElement        : 'InputWithPrepend',
						prepend             : '<span class="glyphicon glyphicon-user"></span>',
						value 				: App.Util.getCookie('UserName', ''),
						rules 				: { required: true, maxlength: 250 }
					}),
					password : $.extend(true, {}, App.DataElement.Password, {
						label				: 'Password',
						placeholder 		: 'Password',
						inputWrapperStyle 	: 'form-group',
						themeElement        : 'InputWithPrepend',
						prepend             : '<span class="glyphicon glyphicon-lock"></span>',
						strength 			: false,
						rules 				: { required: true, minlength: 3 }
					})
				}
			}
	};
	this.meta = {
			General : {},
			Login : {}
	};
	this.init = function() {};
	this.construct = function()
	{
		if ('' == $('#username').val())
		{
			$('#username').focus();
		}
		else
		{
			$('#password').focus();
		}
	};
	this.destruct = function() {};
};
