;
(function ()
{

	_App.API = function ()
	{
		this.initialize();
	};

	_App.API.prototype =
	{

		/**
		 * Internal storage for established contracts and execution responses.
		 */
		contractWait: {},
		taskContracts: {},
		taskExecutions: {},
		routeContracts: {},
		routeExecutions: {},
		requestId: 0,
		requests: [],
		requestCallback: [],
		autoBatch: false,
		conBatching: false,
		conBatch: [],
		currConBatch: 0,
		execBatching: false,
		execBatch: [],
		currExecBatch: 0,

		initialize: function ()
		{
			// Nothing to do here.
		},


		/* ------------------------------------- TASK HANDLING ------------------------------------- */
		/**
		 * Establish a Task Contract with server.
		 * @param id
		 * @param workspace
		 * @param task
		 * @param jobId
		 * @param data
		 * @param callback
		 * @param errorCallback
		 */
		getTask: function (id, workspace, task, jobId, data, callback, errorCallback)
		{
			if (this.autoBatch)
			{
				if (!this.conBatching)
				{
					// Start a new batch.
					this.conBatching = true;
					this.currConBatch++;
					this.conBatch[this.currConBatch] = [];
					setTimeout($.proxy(function ()
					{
						// Batch end, do a stacked conute.
						var batchnum = this.currConBatch + 0;
						this.conBatching = false;
						this.getTasks(
							this.conBatch[batchnum],
							function () {}
						);
					}, this), 500);
				}
				;

				// Stack the call.
				this.conBatch[this.currConBatch].push({
					id: id,
					workspace: workspace,
					task: task,
					jobId: jobId,
					data: data,
					callback: callback,
					errorCallback: errorCallback
				});
			}
			else
			{
				this.taskContracts[id] = {
					"Callback": callback,
					"ErrorCallback": errorCallback
				};
				jobId = (jobId)
					? jobId
					: null;
				data = (data)
					? data
					: {};
				App.Ajax.JSON({
						"id": id,
						"url": 'workspace/contract-task',
						"data": [{"Workspace": workspace, "Task": task, "JobId": jobId, "Packet": data}]
					},
					$.proxy(this._getTaskSuccess, this),
					$.proxy(this._getTaskError, this)
				);
			}
		},

		/**
		 * Execute callback when contract is available.
		 */
		onContract: function (id, callback)
		{
			if (this.taskContracts[id] && !this.taskContracts[id]['Burn'])
			{
				callback();
			}
			else
			{
				if (undefined == this.contractWait[id])
				{
					this.contractWait[id] = [];
				}
				this.contractWait[id].push(callback);
			}
		},

		/**
		 * Retrieve a Task Contract established with server.
		 * @param id
		 * @returns object|null
		 */
		taskContract: function (id)
		{
			return this.taskContracts[id] && !this.taskContracts[id]['Burn']
				? this.taskContracts[id]
				: null;
		},

		_getTaskSuccess: function (id, response)
		{
			response = response[0];
			if (!this.taskContracts[id])
			{
				return;
			}
			this.taskContracts[id]["Response"] = response;
			if (response.Status && 'Success' != response.Status)
			{
				if (this.taskContracts[id]['ErrorCallback'])
				{
					this.taskContracts[id]['ErrorCallback'](response);
				}
			}
			else
			{
				this.taskContracts[id]["Hash"] = response.Hash;
				this.taskContracts[id]["LifeTime"] = response.LifeTime;
				if (this.taskContracts[id]['Callback'])
				{
					this.taskContracts[id]['Callback'](response);
				}
				if (undefined != this.contractWait[id])
				{
					for (var i in this.contractWait[id])
					{
						this.contractWait[id][i]();
					}
					delete this.contractWait[id];
				}
			}
		},

		_getTaskError: function (id, error)
		{
			this.taskContracts[id]["Response"] = error;
			if (this.taskContracts[id]['ErrorCallback'])
			{
				this.taskContracts[id]['ErrorCallback'](error);
			}
		},

		/**
		 * Establish multiple Task Contracts with server.
		 * @param contracts
		 */
		getTasks: function (contracts, callback)
		{
			var id = this.requestId;
			var requests = [];
			this.requestId++;
			this.requests.push({});
			this.requestCallback.push({
				callback: callback
			});
			for (var i in contracts)
			{
				this.requests[id][i] = contracts[i].id;
				this.taskContracts[contracts[i].id] = {
					"Callback": contracts[i].callback,
					"ErrorCallback": contracts[i].errorCallback
				};
				jobId = (contracts[i].jobId)
					? contracts[i].jobId
					: null;
				data = (contracts[i].data)
					? contracts[i].data
					: {};
				requests.push({
					"Workspace": contracts[i].workspace,
					"Task": contracts[i].task,
					"JobId": jobId,
					"Packet": data
				});
			}
			App.Ajax.JSON({
					"id": id,
					"url": 'workspace/contract-task',
					"data": requests
				},
				$.proxy(this._getTasksSuccess, this),
				$.proxy(this._getTaskError, this)
			);
		},

		_getTasksSuccess: function (gid, responses)
		{
			for (var i in responses)
			{
				response = responses[i];
				var id = this.requests[gid][i];
				if (!this.taskContracts[id])
				{
					return;
				}
				this.taskContracts[id]["Response"] = response;
				if (undefined != response.Status && 'Success' != response.Status)
				{
					if (this.taskContracts[id]['ErrorCallback'])
					{
						this.taskContracts[id]['ErrorCallback'](response);
					}
				}
				else
				{
					this.taskContracts[id]["Hash"] = response.Hash;
					this.taskContracts[id]["LifeTime"] = response.LifeTime;
					if (this.taskContracts[id]['Callback'])
					{
						this.taskContracts[id]['Callback'](response);
					}
				}
			}
			if (undefined != this.requestCallback[gid])
			{
				this.requestCallback[gid].callback();
			}
			delete this.requests[gid];
			delete this.requestCallback[gid];
		},

		/**
		 * Execute a Task Contract against server.
		 * @param id
		 * @param data
		 * @param options
		 * @param callback
		 * @param errorCallback
		 * @returns boolean|void
		 */
		execTask: function (id, service, task, data, callback, errorCallback, method, direct)
		{
			this.taskContracts[id] = {};
			this.taskContracts[id]["Callback"] = callback;
			this.taskContracts[id]["ErrorCallback"] = errorCallback;
			data = (data)
				? data
				: {};
			if (!method)
			{
				method = 'JSON';
			}
			var packet = {
				"id": id,
				"url": 'api/v1/execute',
				"data": {"Service": service, "Task": task, "Data": data}
			};
			if (direct)
			{
				packet.direct = true;
			}
			App.Ajax[method](
				packet,
				$.proxy(this._execTaskSuccess, this),
				$.proxy(this._execTaskError, this)
			);
		},

		_execTaskSuccess: function (id, response)
		{
			this.taskExecutions[id] = response;
			if (!this.taskContracts[id])
			{
				//console.log('Problem with contract execution, likely duplicate execution on UseOnce contract.');
				//console.log(id);
				//console.log(this.taskContracts);
			}
			if (response.Status && 'Success' != response.Status)
			{
				if (this.taskContracts[id] && this.taskContracts[id]['ErrorCallback'])
				{
					this.taskContracts[id]['ErrorCallback'](response);
				}
			}
			else
			{
				var callback = this.taskContracts[id]['Callback']
					? this.taskContracts[id]['Callback']
					: false;
				delete this.taskContracts[id];
				if (callback)
				{
					callback(response);
				}
			}
		},

		_execTaskError: function (id, error)
		{
			this.taskExecutions[id] = error;
			if (this.taskContracts[id]['ErrorCallback'])
			{
				this.taskContracts[id]['ErrorCallback'](error);
			}
		},


		/**
		 * Execute a Task Contract against server.
		 * @param id
		 * @param data
		 * @param options
		 * @param callback
		 * @param errorCallback
		 * @returns boolean|void
		 */
		execTasks: function (contracts, callback)
			//id, data, options, callback, errorCallback, method, direct )
		{
			var gid = this.requestId;
			var requests = [];
			this.requests.push({});
			this.requestCallback.push({
				callback: callback
			});
			this.requestId++;
			for (var i in contracts)
			{
				this.requests[gid][i] = contracts[i].id;
				this.taskContracts[contracts[i].id]["Callback"] = contracts[i].callback;
				this.taskContracts[contracts[i].id]["ErrorCallback"] = contracts[i].errorCallback;
				requests.push({
					"Contract": this.taskContracts[contracts[i].id]["Hash"],
					"Packet": contracts[i].data,
					"Options": contracts[i].options
				});
			}
			App.Ajax.JSON(
				{
					"id": gid,
					"url": 'workspace/execute-task',
					"data": requests
				},
				$.proxy(this._execTasksSuccess, this),
				$.proxy(this._execTaskError, this)
			);
		},

		_execTasksSuccess: function (gid, responses)
		{
			for (var i in responses)
			{
				response = responses[i];
				var id = this.requests[gid][i];
				this.taskExecutions[id] = response;
				if (!this.taskContracts[id])
				{
					console.log('Problem with contract execution, likely duplicate execution on UseOnce contract.');
					console.log(id);
					console.log(this.taskContracts);
				}
				if (response.Status && 'Success' != response.Status)
				{
					if (this.taskContracts[id] && this.taskContracts[id]['ErrorCallback'])
					{
						this.taskContracts[id]['ErrorCallback'](response);
					}
				}
				else
				{
					var callback = this.taskContracts[id]['Callback']
						? this.taskContracts[id]['Callback']
						: false;
					if (this.taskContracts[id] && this.taskContracts[id]['LifeTime'] != 'Recurring')
					{
						delete this.taskContracts[id];
					}
					if (callback)
					{
						callback(response);
					}
				}
			}
			if (undefined != this.requestCallback[gid])
			{
				this.requestCallback[gid].callback(responses);
			}
			delete this.requests[gid];
			delete this.requestCallback[gid];
		},

		/**
		 * Execute a Task Contract against server.
		 * @param id
		 * @param data
		 * @param options
		 * @param callback
		 * @param errorCallback
		 * @returns boolean|void
		 */
		execTaskMulti: function (id, data, options, callback, errorCallback, method, direct)
		{
			if (!this.taskContracts[id])
			{
				//console.log('! No contract for: ' + id);
				return false;
			}
			this.taskContracts[id]["Callback"] = callback;
			this.taskContracts[id]["ErrorCallback"] = errorCallback;
			if (!data)
			{
				return false;
			}
			options = (options)
				? options
				: [];
			if (!method)
			{
				method = 'JSON';
			}
			var packed = [];
			for (var i = 0; i < data.length; i++)
			{
				packed.push({
					"Contract": this.taskContracts[id]["Hash"],
					"Packet": data[i],
					"Options": options[i] ? options[i] : {}
				});
			}
			var packet = {
				"id": id,
				"url": 'workspace/execute-task',
				"data": packed
			};
			if (direct)
			{
				packet.direct = true;
			}
			App.Ajax[method](
				packet,
				$.proxy(this._execTaskSuccessMulti, this),
				$.proxy(this._execTaskError, this)
			);
		},

		_execTaskSuccessMulti: function (id, responses)
		{
			var success = true;
			this.taskExecutions[id] = [];
			for (var i = 0; i < responses.length; i++)
			{
				response = responses[i];
				this.taskExecutions[id].push(response);
				if (!this.taskContracts[id])
				{
					//console.log('Problem with contract execution, likely duplicate execution on UseOnce contract.');
					//console.log(id);
					//console.log(this.taskContracts);
				}
				if (response.Status && 'Success' != response.Status)
				{
					success = false;
				}
			}
			if (!success)
			{
				if (this.taskContracts[id]['ErrorCallback'])
				{
					this.taskContracts[id]['ErrorCallback'](response);
				}
			}
			else
			{
				if (this.taskContracts[id]['Callback'])
				{
					this.taskContracts[id]['Callback'](this.taskExecutions[id]);
				}
				if (this.taskContracts[id]['LifeTime'] != 'Recurring')
				{
					delete this.taskContracts[id];
				}
			}
		},

		_execTaskError: function (id, error)
		{
			this.taskExecutions[id] = error;
			if (this.taskContracts[id]['ErrorCallback'])
			{
				this.taskContracts[id]['ErrorCallback'](error);
			}
		},


		/* ------------------------------------- ROUTE HANDLING ------------------------------------- */
		/**
		 * Directly route an item to a new sate.
		 * @param id
		 * @param workspace
		 * @param route
		 * @param jobId
		 * @param data
		 * @param callback
		 * @param errorCallback
		 */
		directRoute: function (id, workspace, route, jobId, data, callback, errorCallback)
		{
			this.routeContracts[id] = {
				"Callback": callback,
				"ErrorCallback": errorCallback
			};
			jobId = (jobId)
				? jobId
				: null;
			data = (data)
				? data
				: {};
			App.Ajax.JSON({
					"id": id,
					"url": 'workspace/direct-route',
					"data": [{"Workspace": workspace, "Route": route, "JobId": jobId, "Packet": data}]
				},
				$.proxy(this._directRouteSuccess, this),
				$.proxy(this._directRouteError, this)
			);
		},

		_directRouteSuccess: function (id, response)
		{
			response = response[0];
			this.routeExecutions[id] = response;
			if (response.Status && 'Success' != response.Status)
			{
				if (this.routeContracts[id]['ErrorCallback'])
				{
					this.routeContracts[id]['ErrorCallback'](response);
				}
			}
			else
			{
				if (this.routeContracts[id]['Callback'])
				{
					this.routeContracts[id]['Callback'](response);
				}
				delete this.routeContracts[id];
			}
		},

		_directRouteError: function (id, error)
		{
			this.routeExecutions[id] = error;
			if (this.routeContracts[id]['ErrorCallback'])
			{
				this.routeContracts[id]['ErrorCallback'](error);
			}
		},

		/**
		 * Establish a Route Contract with server.
		 * @param id
		 * @param workspace
		 * @param route
		 * @param jobId
		 * @param data
		 * @param callback
		 * @param errorCallback
		 */
		getRoute: function (id, workspace, route, jobId, data, callback, errorCallback)
		{
			this.routeContracts[id] = {
				"Callback": callback,
				"ErrorCallback": errorCallback
			};
			jobId = (jobId)
				? jobId
				: null;
			data = (data)
				? data
				: {};
			App.Ajax.JSON({
					"id": id,
					"url": 'workspace/contract-route',
					"data": [{"Workspace": workspace, "Route": route, "JobId": jobId, "Packet": data}]
				},
				$.proxy(this._getRouteSuccess, this),
				$.proxy(this._getRouteError, this)
			);
		},

		/**
		 * Retrieve a Route Contract established with server.
		 * @param id
		 * @returns object|null
		 */
		routeContract: function (id)
		{
			return this.routeContracts[id]
				? this.routeContracts[id]
				: null;
		},

		_getRouteSuccess: function (id, response)
		{
			response = response[0];
			this.routeContracts[id]["Response"] = response;
			if (response.Status && 'Success' != response.Status)
			{
				if (this.routeContracts[id]['ErrorCallback'])
				{
					this.routeContracts[id]['ErrorCallback'](response);
				}
			}
			else
			{
				this.routeContracts[id]["Hash"] = response.Hash;
				this.routeContracts[id]["LifeTime"] = response.LifeTime;
				if (this.routeContracts[id]['Callback'])
				{
					this.routeContracts[id]['Callback'](response);
				}
			}
		},

		_getRouteError: function (id, error)
		{
			this.routeContracts[id]["Response"] = error;
			if (this.routeContracts[id]['ErrorCallback'])
			{
				this.routeContracts[id]['ErrorCallback'](error);
			}
		},

		/**
		 * Execute a Route Contract against server.
		 * @param id
		 * @param data
		 * @param options
		 * @param callback
		 * @param errorCallback
		 * @returns boolean|void
		 */
		execRoute: function (id, data, options, callback, errorCallback)
		{
			if (!this.routeContracts[id])
			{
				return false;
			}
			this.routeContracts[id]["Callback"] = callback;
			this.routeContracts[id]["ErrorCallback"] = errorCallback;
			data = (data)
				? data
				: {};
			options = (options)
				? options
				: {};
			App.Ajax.JSON({
					"id": id,
					"url": 'workspace/execute-route',
					"data": [{"Contract": this.routeContracts[id]["Hash"], "Packet": data, "Options": options}]
				},
				$.proxy(this._execRouteSuccess, this),
				$.proxy(this._execRouteError, this)
			);
		},

		_execRouteSuccess: function (id, response)
		{
			response = response[0];
			this.routeExecutions[id] = response;
			if (response.Status && 'Success' != response.Status)
			{
				if (this.routeContracts[id]['ErrorCallback'])
				{
					this.routeContracts[id]['ErrorCallback'](response);
				}
			}
			else
			{
				if (this.routeContracts[id]['Callback'])
				{
					this.routeContracts[id]['Callback'](response);
				}
				if (this.routeContracts[id]['LifeTime'] != 'Recurring')
				{
					delete this.routeContracts[id];
				}
			}
		},

		_execRouteError: function (id, error)
		{
			this.routeExecutions[id] = error;
			if (this.routeContracts[id]['ErrorCallback'])
			{
				this.routeContracts[id]['ErrorCallback'](error);
			}
		}
	};

})();
