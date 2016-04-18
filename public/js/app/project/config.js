;
(function ()
{

	_App.Config = function ()
	{

		this.initialize();

	};

	_App.Config.prototype =
	{

		dataManglerCs: false,

		appKey: 'MUKURU',

		sectionLandingPage: {
			Brochure: '/',
			Portal: '/logout',
			Admin: '/randomizeconfig'
		},

		isDevEnvironment: (window.location.hostname == 'randomizer.local'
		                   || window.location.hostname == 'randomizer.local'),

		initialize: function () {}

	};

})();