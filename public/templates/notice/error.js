var template_error = function( static )
{
	$.extend(this, App.Template.emptyTemplate);
	this.static = static;
	this.errorLib = {
			pagePermissionDenied: 'You do not have the correct permissions to access the requested page.',
			noSuchPage 			: 'The requested page does not exist.'
	};
	this.elements = {};
	this.meta = {
			General :
			{
				'errorNotice' : $.extend(true, {}, App.DataElement.Text, {
					value 	: '...'
				})
			}
	};
	this.init = function() {};
	this.construct = function()
	{
		var notice = App.Util.getUrlParam('error');
		notice = this.errorLib[notice]
			? this.errorLib[notice]
			: 'An application error occured.';
		this.ti.hydrateParam('errorNotice', { value : notice });
	};
	this.destruct = function() {};
};
