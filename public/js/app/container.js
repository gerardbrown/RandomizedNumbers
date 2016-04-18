;
(function ()
{

	_App.Container = function (args)
	{
		//this.initialize( args );
	};

	_App.Container.prototype =
	{

		containers: {},

		register: function (containerId, contentTarget, setTitle, show, hide, params)
		{
			this.containers[containerId] = params
				? params
				: {};
			this.containers[containerId].contentTarget = contentTarget;
			this.containers[containerId].setTitle = setTitle;
			this.containers[containerId].show = show;
			this.containers[containerId].hide = hide;
		},

		remove: function (containerId)
		{
			if (this.containers[containerId])
			{
				delete this.containers[containerId];
			}
		},

		get: function (containerId)
		{
			if (this.containers[containerId])
			{
				return this.containers[containerId];
			}
		}

	};

})();