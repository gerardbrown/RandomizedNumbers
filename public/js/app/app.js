;
(function ()
{

	window._App = function ()
	{

		this.initialize();

	};

	window._App.prototype =
	{

		projectId: null,
		activePage: false,
		started: false,
		allowedSection: 'brochure',

		initialize: function ()
		{
			this.Config = new _App.Config();
			this.Controller = new _App.Controller({
				$_el: $('#PageContent')
			});
			this.Router = new _App.Router();
			this.Ajax = new _App.Ajax();
			this.Util = new _App.Util();
			this.Event = new _App.Event();
			this.API = new _App.API();
			this.DataElement = new _App.DataElement();
			this.DataStruct = new _App.DataStruct();
			this.DataStore = new _App.DataStore();
			this.Theme = new _App.Theme();
			this.Template = new _App.Template();
			this.TemplateElement = new _App.TemplateElement();
			this.ElementLibrary = new _App.ElementLibrary();
			this.Container = new _App.Container();

			_App = null;
		},

		start: function ()
		{
			if (this.started)
			{
				return;
			}
			_w.init();
			this.started = true;
			this.Router.handleHashChange();
		},


	};

})();