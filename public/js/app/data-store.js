;
(function ()
{

	_App.DataStore = function ()
	{
		this.initialize();
	};

	_App.DataStore.prototype =
	{

		metaStore: {},
		dataStore: {},
		itemStore: {},
		listenerStore: {},
		autoRemoveData: {},
		autoAddData: {},
		reverse: {'years': true},

		initialize: function ()
		{
			_r.DataStore = {};
			this.listenerStore = {};
		},


		clearAutoRemove: function (dataId)
		{
			if (undefined != this.autoRemoveData[dataId])
			{
				delete this.autoRemoveData[dataId];
			}
		},

		autoRemoveItem: function (dataId, id)
		{
			if (undefined == this.autoRemoveData[dataId])
			{
				this.autoRemoveData[dataId] = {};
			}
			this.autoRemoveData[dataId][id] = true;
			if (undefined != this.dataStore[dataId])
			{
				var updated = false;
				for (var i in this.dataStore[dataId])
				{
					if (this.autoRemoveData[dataId][this.dataStore[dataId][i].value])
					{
						updated = true;
						delete this.dataStore[dataId][i];
					}
				}
				if (updated)
				{
					if (this.listenerStore[dataId])
					{
						for (var id in this.listenerStore[dataId])
						{
							this.listenerStore[dataId][id]["callback"](dataId, this.dataStore[dataId]);
						}
					}
				}
			}
		},

		autoAddItem: function (dataId, id, label)
		{
			if (undefined != this.dataStore[dataId])
			{
				var updated = true;
				for (var i in this.dataStore[dataId])
				{
					if (this.dataStore[dataId][i].value == id)
					{
						updated = false;
					}
				}

				if (updated)
				{
					this.dataStore[dataId].push({'value': id, 'label': label});
					if (this.listenerStore[dataId])
					{
						for (var id in this.listenerStore[dataId])
						{
							this.listenerStore[dataId][id]["callback"](dataId, this.dataStore[dataId]);
						}
					}
				}
			}
		},

		/**
		 * Set param for storage.
		 * @param param
		 * @param value
		 */
		setItem: function (param, value)
		{
			this.itemStore[param] = value;
		},

		/**
		 * Set param for storage.
		 * @param param
		 * @param value
		 */
		incrementItem: function (param, step)
		{
			step = (undefined == step)
				? 1
				: step;
			this.itemStore[param] += step;
		},

		/**
		 * Set param for storage.
		 * @param param
		 * @param value
		 */
		itemCeil: function (param, value)
		{
			if (undefined == this.itemStore[param] || isNaN(this.itemStore[param]))
			{
				this.itemStore[param] = value;
			}
			else if (value > this.itemStore[param])
			{
				this.itemStore[param] = value;
			}
		},

		/**
		 * Retrieve param from storage
		 * @param param
		 * @param defaultValue
		 * @returns
		 */
		getItem: function (param, defaultValue)
		{
			return null != this.itemStore[param] && undefined != this.itemStore[param]
				? this.itemStore[param]
				: defaultValue;
		},

		/**
		 * Remove param from storage
		 * @param param
		 */
		removeItem: function (param)
		{
			if (undefined != this.itemStore[param])
			{
				delete this.itemStore[param];
			}
		},

		/**
		 * Register an Event Listener.
		 * @param id
		 * @param dataId
		 * @param callback
		 * @param type
		 */
		listen: function (id, dataId, callback, type)
		{
			if (!this.listenerStore[dataId])
			{
				this.listenerStore[dataId] = {};
			}
			this.listenerStore[dataId][id] = {
				"callback": callback,
				"type": (type ? type : "UseOnce")
			};
			if (this.dataStore[dataId])
			{
				this.listenerStore[dataId][id]["callback"](dataId, this.dataStore[dataId]);
				if ("UseOnce" == this.listenerStore[dataId][id]['type'])
				{
					delete this.listenerStore[dataId][id];
				}
			}
		},

		/**
		 * Remove a registered Event Listener.
		 * @param id
		 * @param dataId
		 */
		removeListener: function (id, dataId)
		{
			if (this.listenerStore[dataId] && this.listenerStore[dataId][id])
			{
				delete this.listenerStore[dataId][id];
			}
		},

		/**
		 * Set dataset.
		 * @param dataId
		 * @param data
		 */
		setData: function (dataId, data, noSwap)
		{
			if (typeof data === "function")
			{
				data = data();
			}
			if (!noSwap && this.reverse[dataId])
			{
				data.reverse();
			}
			if (this.autoRemoveData[dataId])
			{
				var newData = [];
				for (var i in data)
				{
					if (!this.autoRemoveData[dataId][data[i].value])
					{
						newData.push(data[i]);
					}
				}
				data = newData;
			}

			this.dataStore[dataId] = data;
			if (this.listenerStore[dataId])
			{
				for (var id in this.listenerStore[dataId])
				{
					this.listenerStore[dataId][id]["callback"](dataId, data);
					if ("UseOnce" == this.listenerStore[dataId][id]["type"])
					{
						delete this.listenerStore[dataId][id];
					}
				}
			}
		},

		/**
		 * Retrieve dataset.
		 * @param dataId
		 */
		getData: function (dataId, exclude)
		{
			if (undefined != this.dataStore[dataId] && undefined != exclude)
			{
				var filtered = [];
				for (var i in this.dataStore[dataId])
				{
					var match = false;
					for (var field in exclude)
					{
						if (this.dataStore[dataId][i][field] == exclude[field])
						{
							var match = true;
						}
					}
					if (!match)
					{
						filtered.push(this.dataStore[dataId][i]);
					}
				}
				return filtered;
			}
			return undefined != this.dataStore[dataId]
				? this.dataStore[dataId]
				: [];
		},

		/**
		 * Retrieve label for value from select list.
		 * @param dataId
		 * @param value
		 * @param defaultValue
		 */
		getLabelFromValue: function (dataId, value, defaultValue)
		{
			if (undefined != this.dataStore[dataId])
			{
				for (var i in this.dataStore[dataId])
				{
					if (value == this.dataStore[dataId][i].value)
					{
						return this.dataStore[dataId][i].label;
					}
				}
			}
			return undefined == defaultValue
				? null
				: defaultValue;
		},

		/**
		 * Extract data from api response and set to dataStore.
		 * @param dataId
		 * @param apiResponse
		 */
		setDataFromApiResponse: function (dataId, callback, apiResponse)
		{
			delete _r[dataId];
			this.setData(dataId,
				(apiResponse.Data.DataSet)
					? apiResponse.Data.DataSet
					: apiResponse.Data
			);
			if (undefined != callback)
			{
				callback();
			}
		},

		/**
		 * Load a select list dataset via api.
		 * @param dataId
		 * @param isStatic
		 * @param workspace
		 * @param task
		 * @param jobId
		 * @param data
		 * @param options
		 */
		loadSelectListData: function (dataId, isStatic, workspace, task, jobId, data, options, callback)
		{
			if (_r[dataId])
			{
				return;
			}
			_r[dataId] = true;
			if (isStatic && App.DataStore.dataStore[dataId])
			{
				App.DataStore.setData(dataId, App.DataStore.dataStore[dataId], true);
				return;
			}

			if ('function' == typeof data)
			{
				data = data();
			}

			App.DataStore.metaStore[dataId] = {};
			App.DataStore.metaStore[dataId].data = data
				? data
				: {};
			App.DataStore.metaStore[dataId].options = options
				? options
				: {};
			var apiTask = App.API.taskContract('DataStore.' + dataId);

			if (!apiTask || !apiTask.Hash || apiTask.Response.Task != task)
			{
				App.API.getTask(
					'DataStore.' + dataId, workspace, task, jobId,
					{},
					$.proxy(App.DataStore._loadData, this, dataId, isStatic, callback),
					_w.taskContractError
				);
			}
			else
			{
				App.DataStore._loadData(dataId, isStatic, callback);
			}
		},

		_loadData: function (dataId, isStatic, callback)
		{
			App.API.execTask(
				'DataStore.' + dataId,
				App.DataStore.metaStore[dataId].data,
				App.DataStore.metaStore[dataId].options,
				$.proxy(App.DataStore.setDataFromApiResponse, this, dataId, callback),
				_w.taskExecError
			);
		}

	};

})();
