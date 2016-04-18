;
(function ()
{

	_App.Router = function ()
	{
		this.initialize();
	};

	_App.Router.prototype =
	{

		routes: {},

		requireAuth: {},

		initialize: function ()
		{
			if (!window.location.hash.length)
			{
				window.location.hash = '/';
			}
			this.setupHashChangeListener();
		},

		setupHashChangeListener: function ()
		{
			if (!( 'onhashchange' in window ))
			{
				this.pollHash();
			}
			$(window).on('hashchange', $.proxy(this.handleHashChange, this));
		},

		pollHash: function ()
		{
			var currentHash = window.location.hash;
			setInterval(function ()
			{
				if (window.location.hash != currentHash)
				{
					$(window).trigger('hashchange');
					currentHash = window.location.hash;
				}
			}, 250);
		},

		handleHashChange: function ()
		{
			$('.btn[data-role="end"]').click();
			var hashLocQuery = window.location.hash.split("?");
			var hashLoc = hashLocQuery[0].split("/");
			App.allowedSection = App.allowedSection
				? App.allowedSection
				: 'brochure';
			if (hashLoc[2] && '' != hashLoc[2])
			{
				var section = hashLoc[1];
				var page = hashLoc[2];
			}
			else if (hashLoc[1] && '' != hashLoc[1])
			{
				var section = App.allowedSection;
				var page = hashLoc[1];
			}
			else
			{
				var section = 'brochure';
				var page = 'home';
			}
			if (App.userData && App.userData.forcePasswordChange
			    && 'change-password' != page)
			{
				window.location.hash = '/change-password';
				return;
			}
			if (App.allowedSection != section
			    && 'brochure' != section
			    && 'notice' != section)
			{
				if (!App.redirect
				    && 'login' != page
				    && 'forgot-password' != page
				    && 'change-password' != page)
				{
					var query = hashLocQuery[1]
						? '?' + hashLocQuery[1]
						: '';
					App.redirect = '/' + section + '/' + page + query;
				}
				window.location.hash = '/notice/error?error=pagePermissionDenied';
				return;
			}
			App.Template.instanceCounter = 0;
			App.Controller.changePage(section, page);
			$(window).trigger('pageChange');
		}

	};

})();
