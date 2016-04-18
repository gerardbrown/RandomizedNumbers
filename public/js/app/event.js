;
(function ()
{

	_App.Event = function ()
	{
		this.initialize();
	};

	_App.Event.prototype =
	{

		listenerStore: {},

		initialize: function ()
		{
			this.listenerStore = {};
		},

		/**
		 * Register an Event Listener.
		 * @param id
		 * @param event
		 * @param callback
		 * @param type
		 */
		listen: function (id, event, callback, type)
		{
			if (!this.listenerStore[event])
			{
				this.listenerStore[event] = {};
			}
			this.listenerStore[event][id] = {
				"callback": callback,
				"type": (type ? type : "UseOnce")
			};
		},

		/**
		 * Remove a registered Event Listener.
		 * @param id
		 * @param event
		 */
		removeListener: function (id, event)
		{
			if (this.listenerStore[event] && this.listenerStore[event][id])
			{
				delete this.listenerStore[event][id];
			}
		},

		/**
		 * Trigger an event.
		 * @param event
		 * @param data
		 */
		trigger: function (event, data)
		{
			if (this.listenerStore[event])
			{
				for (var id in this.listenerStore[event])
				{
					this.listenerStore[event][id]["callback"](event, data);
					if ("UseOnce" == this.listenerStore[event][id]["type"])
					{
						delete this.listenerStore[event][id];
					}
				}
			}
		}

	};

})();