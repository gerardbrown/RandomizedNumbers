;
(function ()
{

	$(document).ready(function ()
	{
		window._c = {}; // Constructor workspace
		window._t = {}; // Template workspace
		window._r = {}; // Registry
		window.App = new _App();

		var hashLoc = window.location.hash.split("#");
		hashLoc = hashLoc[1]
			? hashLoc[1]
			: '/';
		if ('/' != hashLoc && null != hashLoc
		    && '/login' != hashLoc
		    && '/forgot-password' != hashLoc
		    && '/change-password' != hashLoc)
		{
            console.log('hashLoc',hashLoc);

			App.redirect = hashLoc;
		}
		App.API.execTask(
			'getActiveAccount', 'Profile', 'GetAuthenticatedUser', {}, _w.onActiveAccount, _w.onActiveAccountFailure
		);
		_w.onLoad();
	});

})();