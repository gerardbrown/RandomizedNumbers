;
(function ()
{


	//-> Ensure that we have a usable console object so that we don't crash finicky browsers.
	if (!window.console)
	{
		var names = [
			    "log", "debug", "info", "warn", "error",
			    "assert", "dir", "dirxml", "group", "groupEnd", "time",
			    "timeEnd", "count", "trace", "profile", "profileEnd"
		    ],
		    i,
		    l = names.length,
		    noOp = function () {};
		window.console = {};
		for (i = 0; i < l; i = i + 1)
		{
			window.console[names[i]] = noOp;
		}
	}

	window._w = {

		itemId: null,
		itemData: null,
		formMeta: null,
		apeLoaded: false,
		apeLive: false,
		altAlertBox: false,
		alertTimeout: false,
		alertTimeMsg: false,
		formSize: '',
		formStyle: '',
		alertType: '',
		singleSearchMap: {},
		contextVisible: false,
		jqXHR: {},
		gridSearchOverride: {},
		storeDataCache: {},
		storeDataTerm: '',
		userDataCache: {},
		userDataTerm: '',
		dealGenUpdate: {},
		dguSection: {},

		/**
		 * Initialize generic modal container.
		 */
		init: function ()
		{
			App.Container.register(
				// containerId
				'frmModal',
				// contentTarget
				'modalFormContent',
				// setTitle
				function (title)
				{
					$('#modalFormTitle').html(title);
				},
				// show
				function (options)
				{
					var con = App.Container.containers.frmModal;
					if ('' != con.formSize)
					{
						$('#frmModal').removeClass(con.formSize);
					}
					if ('' != con.formStyle)
					{
						$('#frmModal').removeClass(con.formStyle);
					}
					if (options.size)
					{
						con.formSize = 'modal-' + options.size;
						$('#frmModal').addClass(con.formSize);
					}
					if (options.style)
					{
						con.formStyle = options.style;
						$('#frmModal').addClass(con.formStyle);
					}
					$('#frmModal').modal({
						backdrop: 'static',
						show: true
					});
				},
				// hide
				function ()
				{
					$('#frmModal').modal('hide');
					$('#modalFormContent').html('Loading...');
				},
				// params
				{
					formSize: '',
					formStyle: ''
				}
			);
			App.Container.register(
				// containerId
				'frmHeader',
				// contentTarget
				'headerForm',
				// setTitle
				function (title)
				{
					// Nothing to do
				},
				// show
				function (options)
				{
					$('#headerFormContent').show();
				},
				// hide
				function ()
				{
					$('#headerFormContent').hide();
					$('#modalFormContent').html('Loading...');
				},
				// params
				{
					formSize: '',
					formStyle: ''
				}
			);
		},


		/**
		 * Generic notification functionality.
		 */
		alert: function (title, notification, type, permanent)
		{
			if (!_w.altAlertBox)
			{
				// Enforce using page specific alert containers.
				return false;
			}
			if (_w.alertTimeout)
			{
				_w.alertTimeMsg = {
					title: title,
					notification: notification,
					type: type,
					permanent: permanent
				};
				return;
			}
			if (!permanent)
			{
				_w.alertTimeout = true;
			}
			var id = _w.altAlertBox
				? _w.altAlertBox
				: 'alertPrimary';
			$('#' + id)
				.removeClass('alert-danger')
				.removeClass('alert-success')
				.removeClass('alert-info')
				.removeClass('alert-warning');
			type = type
				? type
				: 'info';
			_w.alertType = 'alert-' + type;
			$('#' + id).addClass(_w.alertType);
			$('#' + id).html(
				(title
					? '<strong>' + title + ':</strong> '
					: '')
				+ notification);
			$('#' + id).show(300);
			if (!permanent)
			{
				setTimeout($.proxy(function (id)
				{
					_w.alertTimeout = false;
					if (_w.alertTimeMsg)
					{
						_w.alert(
							_w.alertTimeMsg.title,
							_w.alertTimeMsg.notification,
							_w.alertTimeMsg.type,
							_w.alertTimeMsg.permanent
						);
						_w.alertTimeMsg = false;
					}
					else
					{
						$('#' + id).hide(300);
					}
				}, this, id), 4000);
			}
		},

		notify: function (title, content)
		{
			$('#modalNotifyTitle').html(title);
			$('#modalNotifyContent').html(content);
			$('#modalNotify').modal('show');
		},

		quickConfirm: function (id, yesCallback, noCallback)
		{
			var element = 'span.confirm[data-id="' + id + '"]';
			$(element).popover({
				html: true,
				placement: 'left',
				title: 'Are you sure?',
				content: App.Theme.Grid.ConfirmationContent
			});
			$(element).popover('show');
			$('#actionConfirmation').click($.proxy(function (element, yesCallback)
			{
				$('#actionConfirmation').unbind('click');
				$('#actionDecline').unbind('click');
				$(element).popover('hide');
				$(element).popover('destroy');
				if (undefined != yesCallback)
				{
					yesCallback();
				}
			}, this, element, yesCallback));
			$('#actionDecline').click($.proxy(function (element, noCallback)
			{
				$('#actionConfirmation').unbind('click');
				$('#actionDecline').unbind('click');
				$(element).popover('hide');
				$(element).popover('destroy');
				if (undefined != noCallback)
				{
					noCallback();
				}
			}, this, element, noCallback));
		},

		confirm: function (question, yesCallback, noCallback)
		{
			$('#modalConfirmContent').html(question);
			$('#modalConfirm').modal({
				backdrop: 'static',
				show: true
			});
			if (undefined != yesCallback)
			{
				$('#btnConfirmYes').click($.proxy(function (callback)
				{
					$('#btnConfirmYes').unbind('click');
					$('#btnConfirmNo').unbind('click');
					callback();
				}, this, yesCallback));
			}
			if (undefined != noCallback)
			{
				$('#btnConfirmNo').click($.proxy(function (callback)
				{
					$('#btnConfirmYes').unbind('click');
					$('#btnConfirmNo').unbind('click');
					callback();
				}, this, noCallback));
			}
		},


		/**
		 * Usefull delay functionality for single-search usage.
		 */
		delay: (function ()
		{
			var timer = 0;
			return function (callback, ms)
			{
				clearTimeout(timer);
				timer = setTimeout(callback, ms);
			};
		})(),


		/**
		 * Session expiry warning service.
		 */
		sessionUpdate: function ()
		{
			return;
			if (!App.Authenticated)
			{
				return;
			}
			_w.delay(function ()
			{
				App.Authenticated = false;
				App.permissions = {};
				App.companyData = {};
				App.Sudo = {};
				App.userData = {};
				App.API.execTask(
					'logout', 'Profile', 'Logout',
					{}, function ()
					{
						window.location = '/';
					}, function () {}
				);
			}, 1680 * 1000); // 28 Minutes
		},


		/**
		 * Generic error handling functionality.
		 */
		contractErrorHandler: function (result)
		{
			if (App.Config.isDevEnvironment)
			{
				//console.log(result);
			}
			var message = result.StatusReason + "<br/>";
			if ('Invalid contract request. No such contract found for execution.' == result.StatusReason
			    || 'Authentication required for this functionality.' == result.StatusReason)
			{
				window.location = '/';
				return;
			}
			_w.notify('Oops', message);
			for (var i in this.buttonRollback)
			{
				$('#' + this.buttonRollback[i]).prop('disabled', false);
			}
		},

		execErrorHandler: function (result)
		{
			var message = result.StatusReason + "<br/>";
			if ('Invalid contract request. No such contract found for execution.' == result.StatusReason
			    || 'Authentication required for this functionality.' == result.StatusReason)
			{
				window.location = '/';
				return;
			}
			if (result.Messages && result.Messages.Base)
			{
				message += "<br/>";
				for (var ns in result.Messages.Base)
				{
					message += ns + ":<br/>";
					message += result.Messages.Base[ns].join("<br/>");
					message += "<br/>";
				}
			}
			_w.notify('Oops', message);
			for (var i in this.buttonRollback)
			{
				$('#' + this.buttonRollback[i]).prop('disabled', false);
			}
		},

		routeErrorHandler: function (result)
		{
			if (App.Config.isDevEnvironment)
			{
				//console.log(result);
			}
			var message = result.StatusReason + "<br/>";
			if ('Invalid route request. No such route found for execution.' == result.StatusReason)
			{
				window.location = '/';
				return;
			}
			_w.notify('Oops', message);
			for (var i in this.buttonRollback)
			{
				$('#' + this.buttonRollback[i]).prop('disabled', false);
			}
		},


		/**
		 * Permissions utility to check for valid permissions.
		 */
		checkPermissions: function (permissions, onFail, onSuccess)
		{
			if (undefined != permissions
			    && 0 < permissions.length)
			{
				if (!App.Authenticated)
				{
					return false;
				}
				for (var i in permissions)
				{
					var perm = permissions[i];
					if (!App.permissions[perm])
					{
						if (onFail)
						{
							onFail();
						}
						return false;
					}
				}
			}
			if (onSuccess)
			{
				onSuccess();
			}
			return true;
		},


		/**
		 * Setup data collection and publication for forms and grids on load.
		 */
		setupContracts: function ()
		{
			for (var form in this.forms)
			{
				if (this.forms[form].ids)
				{
					for (var internalField in this.forms[form].ids)
					{
						var idField = this.forms[form].ids[internalField];
						this[internalField] = this.forms[form].idSource
							? App.Controller.formParams[this.forms[form].idSource][idField]
							: App.Util.getUrlParam(idField);
						if (isNaN(this[internalField]))
						{
							this[internalField] = 0;
						}
					}
					this.newItem = (0 == this.itemId)
						? true
						: false;
					this.haveData = this.newItem
						? true
						: false;
					this.actionContext = this.forms[form].initContext();
				}
			}
			if (this.contracts)
			{
				this.contracts();
			}
			if (this.grids)
			{
				$.proxy(_w.initGrids, this)();
			}
			for (var form in this.forms)
			{
				var chosen = this.forms[form].choose();
				if (!this.forms[form].actions || !this.forms[form].actions[chosen])
				{
					return;
				}
				var action = this.forms[form].actions[chosen];
				var data = this.itemId
					? {id: this.itemId}
					: {};
				var taskAlias = action.taskAlias
					? action.taskAlias()
					: false;
				if (this.forms[form].collect
				    && !this.forms[form].collect.except[chosen]
				    && this.forms[form].collect.execRequired)
				{
					App.API.execTask(
						this.forms[form].collect.taskAlias,
						this.forms[form].workspace,
						this.forms[form].collect.task,
						data,
						$.proxy(_w.formInitData, this, form),
						$.proxy(_w.execErrorHandler, this)
					);
				}
				else if (this.forms[form].collect
				         && !this.forms[form].collect.except[chosen])
				{
					App.API.execTask(
						this.forms[form].collect.taskAlias,
						this.forms[form].workspace,
						this.forms[form].collect.task,
						data,
						$.proxy(_w.formInitData, this, form),
						$.proxy(_w.execErrorHandler, this)
					);
				}
				else
				{
					$.proxy(_w.formInitData, this)(form, null);
				}
			}
		},


		/**
		 * Data-form functionality.
		 */
		formInitData: function (form, response)
		{
			this.haveData = true;
			this.ti.onPublish($.proxy(function (response)
			{
				$.proxy(_w.setupValidators, this)(
					null == response
						? null
						: response.Data
				);
			}, this, response));
			if (null != response)
			{
				$.proxy(_w.populateData, this)(
					form, this.forms[form].collect.assign(response.Data)
				);
			}
		},

		setupValidators: function (record)
		{
			record = record
				? record
				: null;
			for (var form in this.forms)
			{
				var rules = {};
				$.extend(true, rules, this.rules[form]);
				if (null == record)
				{
					// Create action.
					for (var r in rules)
					{
						if (undefined != rules[r].create)
						{
							rules[r] = $.extend({}, true, rules[r], rules[r].create);
							delete rules[r]['create'];
						}
						if (undefined != rules[r].update)
						{
							delete rules[r]['update'];
						}
					}
				}
				else
				{
					// Update action
					for (var r in rules)
					{
						if (undefined != rules[r].create)
						{
							delete rules[r]['create'];
						}
						if (undefined != rules[r].update)
						{
							rules[r] = $.extend({}, true, rules[r], rules[r].update);
							delete rules[r]['update'];
						}
					}
				}
				this.buttonRollback = [];
				for (var action in this.forms[form].actions)
				{
					if (this.forms[form].actions[action].button
					    && this.forms[form].actions[action].enable(record))
					{
						if (_w.checkPermissions(this.forms[form].actions[action].permissions, function () {}))
						{
							$('#' + this.forms[form].actions[action].button.id).show();
							this.buttonRollback.push(this.forms[form].actions[action].button.id);
						}
					}
				}
				this.forms[form].validations = 0;
				$('#' + form).validate({
					rules: rules,
					messages: this.messages[form],
					invalidHandler: $.proxy(function (formName, event, validator)
					{
						var errors = validator.numberOfInvalids();
						if (0 < this.forms[formName].validations && errors)
						{
							var message = errors == 1
								? 'You missed 1 field. It has been highlighted'
								: 'You missed ' + errors + ' fields. They have been highlighted';
							//_w.notify('Validation Errors', message);
						}
						this.forms[formName].validations++;
					}, this, form),
					submitHandler: $.proxy(function (formName)
					{
						var chosen = this.forms[formName].choose();
						if (!this.forms[formName].actions || !this.forms[formName].actions[chosen])
						{
							return;
						}
						var action = this.forms[formName].actions[chosen];
						if (action.postValidate)
						{
							if (!action.postValidate())
							{
								return;
							}
						}
						this.buttonRollback = [];
						if (this.forms[formName].buttons)
						{
							for (var i in this.forms[formName].buttons)
							{
								if (!$('#' + this.forms[formName].buttons[i]).prop('disabled'))
								{
									this.buttonRollback.push(
										this.forms[formName].buttons[i]
									);
									$('#' + this.forms[formName].buttons[i]).prop('disabled', true);
								}
							}
						}
						var data = this.ti.harvest(form);
						if (this.forms[formName].dataTransform)
						{
							data = this.forms[formName].dataTransform(data);
						}
						if (this.forms[formName].preExecute)
						{
							this.forms[formName].preExecute();
						}
						if (action.dataTransform)
						{
							data = action.dataTransform(data);
						}
						if (action.preExecute)
						{
							action.preExecute();
						}
						if (!action.taskAlias)
						{
							if (action.customAction)
							{
								action.customAction(data);
							}
							return;
						}
						var taskAlias = action.taskAlias();
						if (action.task)
						{
							var requestData = this.itemId
								? {id: this.itemId}
								: {};
							App.API.execTask(
								taskAlias,
								this.forms[formName].workspace,
								action.task,
								data,
								action.successHandler
									? $.proxy(action.successHandler, this)
									: $.proxy(App.Controller.closeForm, App.Controller, this.ti.container, 'Success'),
								action.errorHandler
									? $.proxy(action.errorHandler, this)
									: $.proxy(_w.execErrorHandler, this),
								action.method
									? action.method
									: false,
								action.direct
									? action.direct
									: false
							);
						}
					}, this, form)
				});
				try
				{
					this.forms[form].validations = 0;
					$('#' + form).valid();
				}
				catch (err)
				{
				}
				$('label.error').remove();
				$.each($('.error'), function (i, elem)
				{
					$(elem).removeClass('error');
					$(elem).addClass('required');
				});
				$('.valid').removeClass('valid');
				for (var i in this.buttonRollback)
				{
					$('#' + this.buttonRollback[i]).prop('disabled', false);
				}
			}
		},

		populateData: function (formName, data)
		{
			var disable = false;
			if (this.forms[formName].disableFieldsOnValue)
			{
				disable = this.forms[formName].disableFieldsOnValue(data);
			}
			var fields = this.forms[formName].fields;
			for (var elemId in fields)
			{
				var fieldDisable = disable || fields[elemId].disabled
					? true
					: false;
				if (undefined == data[fields[elemId].namespace]
				    || undefined == data[fields[elemId].namespace][fields[elemId].field])
				{
					var value = '';
				}
				else
				{
					var value = data[fields[elemId].namespace][fields[elemId].field];
				}
				this.ti.hydrateParam(elemId, {value: value, disabled: fieldDisable});
			}
			if (this.forms[formName].dataPublished)
			{
				this.forms[formName].dataPublished(data);
			}
		},


		/**
		 * Data-grid functionality.
		 */
		initGrids: function ()
		{
			// Reques grid data.
			this.gridSearchFilter = {};
			for (var gridName in this.grids)
			{
				var grid = this.grids[gridName];
				if (grid.taskAlias && grid.workspace && grid.task)
				{
					_w.gridSearchOverride[gridName] = false;
					this.gridSearchFilter[gridName] = {};
					if (null == App.API.taskContract(grid.taskAlias))
					{
						App.API.getTask(
							grid.taskAlias, grid.workspace, grid.task, null,
							{}, $.proxy(_w.loadGrid, this, gridName), _w.contractErrorHandler
						);
					}
					else
					{
						$.proxy(_w.loadGrid, this)(gridName, null, {}, {});
					}
				}
			}
		},
		publishGrids: function ()
		{
			for (var gridName in this.grids)
			{
				// Setup context search functionality.
				var classes = [];
				for (var i in this.grids[gridName].contexts)
				{
					classes.push('.' + this.grids[gridName].contexts[i]);
				}
				$(classes.join(', ')).keypress($.proxy(function (gridName, evt)
				{
					var charCode = evt.charCode || evt.keyCode;
					if (charCode == 13)
					{
						$.proxy(_w.searchGrid, this)(gridName);
					}
				}, this, gridName));

				// Setup single-search functionality
				if (this.grids[gridName].dataFields.targets.singleSearchFilterId)
				{
					var filterId = this.grids[gridName].dataFields.targets.singleSearchFilterId;
					$('#' + filterId).keyup($.proxy(function (gridName, filterId, event)
					{
						if (event.keyCode == 13)
						{
							// Enter pressed, fast-trac the search.
							_w.delay($.proxy(function ()
							{
								var val = $('#' + filterId).val();
								if (val.length < 3)
								{
									$('#' + filterId).val('');
									val = '';
								}
								$.proxy(_w.singleSearchGrid, this)(gridName, filterId, val);
							}, this, gridName, filterId), 1);
							return false;
						}
						// Search value changed, wait 400ms for next keystroke else run the search.
						_w.delay($.proxy(function ()
						{
							var val = $('#' + filterId).val();
							if (val.length < 3)
							{
								val = '';
							}
							$.proxy(_w.singleSearchGrid, this)(gridName, filterId, val);
						}, this, gridName, filterId), 400);
					}, this, gridName, filterId));
					$('#' + filterId + 'SsForm').submit(function ()
					{
						return false;
					});
				}
			}
		},
		loadGrid: function (gridName, contract, data, options, report)
		{
			// We have a task contract, now we execute to retrieve data.
			if (!this.grids[gridName])
			{
				return;
			}
			if (!data)
			{
				data = {};
			}
			if (!data.Grid)
			{
				data.Grid = {};
			}
			if (!data.Grid.Filter)
			{
				data.Grid.Filter = {};
			}

			var baseFilter = {};
			if (undefined != this.grids[gridName].baseFilter)
			{
				baseFilter = typeof this.grids[gridName].baseFilter === 'function'
					? this.grids[gridName].baseFilter()
					: this.grids[gridName].baseFilter;
			}

			data.Grid.Filter = $.extend(true,
				{},
				baseFilter,
				data.Grid.Filter,
				this.gridSearchFilter[gridName],
				this.grids[gridName].defaultFilter
					? this.grids[gridName].defaultFilter
					: {},
				_w.gridSearchOverride[gridName]
					? _w.gridSearchOverride[gridName]
					: {},
				this.grids[gridName].baseSearch
					? ('function' == typeof this.grids[gridName].baseSearch
					? this.grids[gridName].baseSearch()
					: this.grids[gridName].baseSearch)
					: {}
			);

			// What type of request are we handling?
			if (!report)
			{
				// Regular grid data request.
				App.API.execTask(
					this.grids[gridName].taskAlias, data, options,
					$.proxy(_w.onGridDataReceived, this, gridName), _w.execErrorHandler
				);
			}
			else
			{
				// Excel grid export request.
				App.API.execTask(
					this.grids[gridName].taskAlias, {}, {'ExportToExcel': true},
					function () {}, _w.execErrorHandler,
					'EXPORT', true
				);
			}
		},
		clearSearch: function (gridName)
		{
			// Clear context and column filters.
			App.DataStore.setItem('GridContextClearing:' + gridName, true);
			var grid = this.grids[gridName];
			for (var i in grid.contexts)
			{
				try
				{
					$('.' + grid.contexts[i]).val('');
				}
				catch (err)
				{
				}
			}
			App.DataStore.removeItem('GridContextClearing:' + gridName);
			$.proxy(_w.searchGrid, this)(gridName, true);
		},
		singleSearchGrid: function (gridName, filterId, val)
		{
			// Prepare single search request filter.
			var filter = {
				count: 0,
				filters: {}
			};
			filter = App.DataElement.singleFilter(
				filter,
				val,
				_w.singleSearchMap[filterId]
			);
			this.gridSearchFilter[gridName] = filter.filters;
			var request = {
				"Grid": {
					"Page": 1,
					"Filter": filter.filters
				}
			};
			$.proxy(_w.loadGrid, this)(gridName, null, request, {});
		},
		searchGrid: function (gridName, resetOrder)
		{
			// Prepare search filters.
			if (undefined == this.grids[gridName]
			    || undefined == gridName)
			{
				//console.log('Cannot locate relevant grid');
				//console.log('gridName');
				//console.log(gridName);
				//console.log('context');
				//console.log(this);
			}
			var filter = {
				count: 0,
				filters: {}
			};
			var fieldMap = this.gridFieldMap[gridName];
			for (var elem in fieldMap)
			{
				filter = App.DataElement.filterIfnotEmpty(filter, elem, fieldMap[elem]);
			}
			var request = {
				"Grid": {
					"Page": 1,
					"Filter": filter.filters
				}
			};
			if (resetOrder && this.grids[gridName] && this.grids[gridName].defaultOrder)
			{
				request.Grid.OrderBy = this.grids[gridName].defaultOrder;
			}
			$.proxy(_w.loadGrid, this)(gridName, null, request, {});
		},
		refreshGrid: function (gridName, resetOrder)
		{
			// Prepare search filters.
			if (undefined == this.grids[gridName]
			    || undefined == gridName)
			{
				return;
			}
			var filter = {
				count: 0,
				filters: {}
			};
			var fieldMap = this.gridFieldMap[gridName];
			for (var elem in fieldMap)
			{
				filter = App.DataElement.filterIfnotEmpty(filter, elem, fieldMap[elem]);
			}
			var request = {
				"Grid": {
					"Filter": filter.filters
				}
			};
			if (resetOrder && this.grids[gridName] && this.grids[gridName].defaultOrder)
			{
				request.Grid.OrderBy = this.grids[gridName].defaultOrder;
			}
			$.proxy(_w.loadGrid, this)(gridName, null, request, {});
		},
		onGridDataReceived: function (gridName, response)
		{
			// Safety checks.
			if (!this.grids)
			{
				//console.log('Incorrect context passed to onGridDataReceived!');
				//console.log(this);
			}
			if (!this.gridFieldMap)
			{
				//console.log('FieldMap not yet built (onGridDataReceived).')
				//console.log(this);
			}

			// Put up a notice that we be messing with grid html.
			App.DataStore.setItem('GridDataPublishing:' + gridName, true);

			// Populate search filters back into html elements.
			var grid = this.grids[gridName];

			if (grid.onData)
			{
				grid.onData(response.Data.DataSet);
			}
			var fieldMap = this.gridFieldMap[gridName];
			var filters = {};
			for (var elem in fieldMap)
			{
				filters[filters[elem]] = elem;
			}
			if (response.Data.Meta.Filters.singleSearch)
			{
				App.DataElement.populateSingleFilter(
					response.Data.Meta.Filters.singleSearch,
					grid.dataFields.targets.singleSearchFilterId
				);
			}
			else
			{
				App.DataElement.populateFilters(response.Data.Meta.Filters, filters);
			}

			// Prepare the data.
			this.rawData = {};
			this.gridEntryUpdates = {};
			var gridData = [];
			for (var i = 0; i < response.Data.DataSet.length; i++)
			{
				var row = response.Data.DataSet[i];
				var cellData = {};
				for (var f in row)
				{
					row[f] = App.Util.htmlEncode(row[f]);
				}
				for (var field in grid.dataFields.items)
				{
					if (!this.gridFieldPermissions[gridName][field])
					{
						continue
					}
					cellData[field] = grid.dataFields.items[field].getValue(row);
				}
				var rowId = grid.gridDataRow.getRowId
					? grid.gridDataRow.getRowId(cellData)
					: i;
				this.rawData['id:' + rowId] = row;
				this.gridEntryUpdates['id:' + rowId] = {};
				gridData.push($.extend(true, {}, grid.gridDataRow, {
					rowId: rowId,
					items: cellData
				}));
			}

			// Rebuild the list of grid entries.
			this.ti.hydrateParam(grid.repeaterId, {
				items: gridData
			});

			// Rebuild the pager.
			if (grid.pagerId)
			{
				this.ti.hydrateParam(grid.pagerId, response.Data.Meta);
			}

			// Rebuild the page-size selector.
			if (grid.pageSizerId)
			{
				this.ti.hydrateParam(grid.pageSizerId, response.Data.Meta);
			}
			if (grid.pageRecords)
			{
				this.ti.hydrateParam(grid.pageRecords, response.Data.Meta);
			}

			// Editable columns, x-editable rocks!
			var editable = grid.gridDataRow.editable
				? grid.gridDataRow.editable
				: false;
			if (editable)
			{
				this.ti.onPublish($.proxy(function (gridName, editable)
				{
					//$('#' + editable.recordActionContainer).hide();
					$('#' + editable.recordActionContainer).attr('data-grid-name', gridName);
				}, this, gridName, editable));
				$('#' + this.ti.tid + ' .editable').on('hidden', function (e, reason)
				{
					if (reason === 'save' || reason === 'nochange')
					{
						var $next = $(this).closest('td').next().find('.editable');
						setTimeout(function ()
						{
							$next.editable('show');
						}, 300);
					}
				});
			}

			App.DataStore.removeItem('GridDataPublishing:' + gridName);

			if (grid.onLoadFinished)
			{
				grid.onLoadFinished(response.Data.Meta.Filters, response.Data.Meta.TotalRecords);
			}
		},
		orderGrid: function (grid, field, direction)
		{
			// Request a different order, can we do that with the goverment?
			var order = {};
			order[field] = direction;
			$.proxy(_w.loadGrid, this)(grid, {}, {"Grid": {"Page": 1, "OrderBy": order}});
		},

		pageGrid: function (grid, page)
		{
			// Move to a specific data page.
			$.proxy(_w.loadGrid, this)(grid, {}, {"Grid": {"Page": page}});
		},

		sizeGrid: function (grid, size)
		{
			// Change the data page size.
			$.proxy(_w.loadGrid, this)(grid, {}, {"Grid": {"NumberOfRecords": size, "Page": 1}});
		},

		updateGridRowField: function (editable, rowId, field, value)
		{
			// Field value update from inline editing.
			if (undefined == this.gridEntryUpdates['id:' + rowId][editable.itemNS])
			{
				this.gridEntryUpdates['id:' + rowId][editable.itemNS] = {};
			}
			this.gridEntryUpdates['id:' + rowId][editable.itemNS][field] = value;
			var gridName = $('#' + editable.recordActionContainer).attr('data-grid-name');
			_w.alert(
				false,
				App.Theme.Grid.RecordUpdateAction
					.replaceAll('[eid]', gridName),
				'success',
				true
			);
			$('#' + gridName + '_yes').unbind('click');
			$('#' + gridName + '_yes').click(
				$.proxy(_w.updateGridEntries, this, gridName, editable)
			);
			$('#' + gridName + '_no').unbind('click');
			$('#' + gridName + '_no').click(
				$.proxy(_w.revertGridEntries, this, gridName, editable)
			);
		},

		revertGridEntries: function (gridName, editable)
		{
			// Throw away all local inline edited changes.
			$.proxy(_w.searchGrid, this)(gridName);
			_w.alert(
				false,
				'Changes ignored.',
				'success',
				false
			);
		},

		updateGridEntries: function (gridName, editable)
		{
			// Update on server all entries that were updated via inline editing.
			if (undefined == this.grids[gridName])
			{
				//console.log('updateGridEntries:context');
				//console.log(this);
			}
			var count = 0;
			for (var i in this.gridEntryUpdates)
			{
				if ($.isEmptyObject(this.gridEntryUpdates[i]))
				{
					continue;
				}
				count++;
			}
			this.gridEntryUpdateCount = count;
			this.gridEntryUpdated = 0;
			_w.alert(
				false,
				'Updating record 1 of ' + count + '...',
				'success',
				true
			);
			for (var i in this.gridEntryUpdates)
			{
				if ($.isEmptyObject(this.gridEntryUpdates[i]))
				{
					continue;
				}
				var data = this.gridEntryUpdates[i];
				if (undefined != editable.additionalData)
				{
					data = $.extend(true, {}, data, editable.additionalData);
				}
				var id = i.substr(3, i.length - 3);
				var jobId = editable.idIsJobId
					? id
					: null;
				App.API.getTask(
					editable.taskUpdate + ':' + id,
					editable.workspace,
					editable.taskUpdate,
					jobId,
					{id: id},
					$.proxy(function (gridName, editable, id, data)
					{
						App.API.execTask(
							editable.taskUpdate + ':' + id, data, {},
							$.proxy(_w.gridEntryUpdateMessage, this, gridName, editable),
							$.proxy(_w.execErrorHandler, this)
						);
					}, this, gridName, editable, id, data),
					$.proxy(_w.contractErrorHandler, this)
				);
			}

		},

		gridEntryUpdateMessage: function (gridName, editable)
		{
			// Provide the user some info on entry update progress.
			this.gridEntryUpdated++;
			if (this.gridEntryUpdated == this.gridEntryUpdateCount)
			{
				// All entries processed.
				$.proxy(_w.searchGrid, this)(gridName);
				_w.alert(
					false,
					'Changes saved.',
					'success',
					false
				);
				this.gridEntryUpdateCount = 0;
				this.gridEntryUpdated = 0;
				if (undefined != editable.onSuccessHandler)
				{
					editable.onSuccessHandler();
				}
			}
			else
			{
				// Still busy updating.
				_w.alert(
					false,
					'Updating record ' + (this.gridEntryUpdated + 1)
					+ ' of ' + this.gridEntryUpdateCount + '...',
					'success',
					true
				);
			}
		},

		validateInlineEdit: function (eid, meta, value)
		{
			// We need da same validation here as in regular form, boorah!
			// Inline edit field dynamically created, to validate we need to provide id and name attribs.
			var formId = new Date().getTime();
			var elemId = eid + '_' + formId;
			var elem = $('#' + eid).parent().find('input');
			$(elem).attr('id', elemId);
			$(elem).attr('name', elemId);

			// And we need a form, so wrap the element in such.
			$(elem).wrap('<form id="' + formId + '">');

			// Select2 be special, gets some special attention...
			if ('select2' == meta.dataType && meta.rules.required)
			{
				if ('' == $('#' + eid).next().find('.select2-chosen').html())
				{
					return 'This field is required';
				}
				return;
			}

			// Prepare validation rules.
			var rules = {};
			rules[elemId] = meta.rules
				? meta.rules
				: {};

			// Hook up the validator.
			var validator = $('#' + formId).validate({
				debug: true,
				rules: rules,
				submitHandler: function (form)
				{
					return false;
				}
			});

			// Check if stuff be valid.
			var isValid = true;
			try
			{
				isValid = $('#' + formId).valid();
			}
			catch (err)
			{
			}
			if (!isValid)
			{
				var msg = validator.errorList[0].message;
			}

			// Cleanup.
			$(elem).unwrap();
			$('label.error').remove();

			// Do we complain?
			if (!isValid)
			{
				return msg;
			}
		},

		validateSubForm: function (containerId, fields, isPermanent)
		{
			// Useful functionality to setup validator on a custom form.
			var formId = new Date().getTime();
			var container = $('#' + containerId);
			container.wrap('<form id="' + formId + '">');
			var rules = {};
			var messages = {};
			for (var field in fields)
			{
				if (fields[field].rules)
				{
					rules[field] = fields[field].rules;
				}
				if (fields[field].messages)
				{
					messages[field] = fields[field].messages;
				}
			}
			var validator = $('#' + formId).validate({
				rules: rules,
				messages: messages,
				submitHandler: function (form)
				{
					return false;
				}
			});
			var isValid = true;
			try
			{
				isValid = $('#' + formId).valid();
			}
			catch (err)
			{
			}
			if (!isPermanent)
			{
				container.unwrap();
				return isValid;
			}
		},

		cleanupSubFormValidation: function (containerId)
		{
			// Cleanup the mess we made.
			$('#' + containerId + ' input, #' + containerId + ' textarea').each(function (id, elem)
			{
				$(elem).val('');
			});
			$('#' + containerId + ' label.error').remove();
			$('#' + containerId + ' input.error, #' + containerId + ' input.valid').each(function (id, elem)
			{
				$(elem).removeClass('error');
				$(elem).removeClass('valid');
			});
			$('#' + containerId + ' textarea.error, #' + containerId + ' textarea.valid').each(function (id, elem)
			{
				$(elem).removeClass('error');
				$(elem).removeClass('valid');
			});
		},


		/**
		 * For meta vars that need data from post-initialization use this method.
		 */
		finaliseMeta: function ()
		{
			// Example:
			// App.DataStruct.Meta.module.dataQuery.data.Filter.project = App.projectId;
		},

		/**
		 * Called just before we know if we are authenticated or not.
		 */
		onLoad: function ()
		{
			_w.notifyDropVisible = false;
			$('.notify-dropdown').hide();
			_w.userDropVisible = false;
			$('.login-menu').click(function (evt)
			{
				evt.stopPropagation();
				if (_w.userDropVisible)
				{
					$('.login-dropdown').fadeOut(300);
					_w.userDropVisible = false;
				}
				else
				{
					$('.login-dropdown').fadeIn(300);
					_w.userDropVisible = true;
				}
				_w.delay(function ()
				{
					$('.login-dropdown').fadeOut(300);
					_w.userDropVisible = false;
				}, 3000);
				$('.login-dropdown').mouseover(function ()
				{
					_w.delay(function ()
					{
						$('.login-dropdown').fadeIn(300);
						_w.userDropVisible = true;
					}, 1);
				});
				$('.login-dropdown').mouseout(function ()
				{
					_w.delay(function ()
					{
						$('.login-dropdown').fadeOut(300);
						_w.userDropVisible = false;
					}, 1000);
				});
			});
			$(document).click(function (evt)
			{
				evt.stopPropagation();
				if (_w.userDropVisible)
				{
					$('.login-dropdown').fadeOut(300);
					_w.userDropVisible = false;
				}
			});
			$('.navbar-inverse li').click(function ()
			{
				$('.navbar-inverse li').removeClass('active');
				$(this).addClass('active');
			});
		},

		/**
		 * Connect to ape http push server.
		 */
		apeConnect: function ()
		{
			return;
			if (_w.apeLive)
			{
				return;
			}
			var client = new APE.Client;
			_w.chatChannelName = App.Config.appKey + '_generalnotice';
			client.load();
			client.addEvent('load', function ()
			{
				// Connect.
				client.core.start({
					"name": App.userData.id + '.' + Math.floor((Math.random() * 1000) + 1)
				});
				setTimeout(function ()
					{
						// If not yet connected we try again.
						if (!_w.apeChat)
						{
							client.core.start({
								"name": App.userData.id + '.' + Math.floor((Math.random() * 1000) + 1)
							});
							setTimeout(function ()
								{
									if (!_w.apeChat)
									{
										$('#liveStatus').html('<span class="glyphicon glyphicon-exclamation-sign"></span>');
									}
								}
								, 15000);
						}
					}
					, 15000);
			});
			client.addEvent('apeDisconnect', function ()
			{
				// On disconnect try to re-establish connection.
				_w.apeLive = false;
				$('#liveStatus').html('');
				client.core.start({
					"name": App.userData.id + '.' + Math.floor((Math.random() * 1000) + 1)
				});
				setTimeout(function ()
					{
						if (!_w.apeChat)
						{
							client.core.start({
								"name": App.userData.id + '.' + Math.floor((Math.random() * 1000) + 1)
							});
							setTimeout(function ()
								{
									if (!_w.apeChat)
									{
										$('#liveStatus').html('<span class="glyphicon glyphicon-exclamation-sign"></span>');
										window.location = window.location.href;
									}
								}
								, 15000);
						}
					}
					, 15000);
			});
			client.addEvent('ready', function ()
			{
				// Connected and ready to chat to the server.
				_w.apeChat = true;
				_w.apeLive = true;
				$('.notification-handle').show();
				$('#liveStatus').html('<span class="glyphicon glyphicon-fire"></span>');
				client.core.join(_w.chatChannelName);
				client.core.join(App.Config.appKey + '_user_' + App.userData.id);
				/*client.addEvent('multiPipeCreate', function(pipe, options) {
				 //console.log('Connected to:', options.pipe.properties.name);
				 _w.pipe = pipe;
				 _w.pipe.request.send('webhook', {
				 'registerUser':
				 {
				 id : App.userData.id
				 }
				 });
				 });*/
				client.onRaw('data', function (raw)
				{
					_w.handleServerCommand(raw.data);
				});
			});
		},
		/**
		 * Handle server commands received through push server.
		 */
		handleServerCommand: function (cmd)
		{
			switch (cmd.type)
			{
				case 'checkAuth':
					App.API.getTask(
						'getActiveAccount', 'User', 'Profile.ActiveAccount', null,
						{}, function (response)
						{
							App.DeviceTypes = response.Data.deviceTypes;
						}, _w.onActiveAccountFailure
					);
					break;
				case 'importProgress':
					$('.import-progress[data-import="' + cmd.params.id + '"]').attr('aria-valuenow', cmd.params.progress);
					$('.import-progress[data-import="' + cmd.params.id + '"]').css('width', cmd.params.progress + '%');
					$('.import-progress[data-import="' + cmd.params.id + '"]').html(cmd.params.progress + '%');
					if ('DeviceImport' == cmd.params.id && 100 == cmd.params.progress)
					{
						window.location.hash = '/dashboard-grid';
						_w.alert('Success', 'Devicess imported from DMP.');
					}
					break;
				case 'notify':
					_w.notify(cmd.title, cmd.message);
					break;
				case 'reload':
					if (!_w.openForm)
					{
						if (cmd.message)
						{
							_w.notify(cmd.title, cmd.message);
						}
						setTimeout(function ()
						{
							location.reload();
						}, 3000);
					}
					else
					{
						if (cmd.delayMessage)
						{
							_w.notify(cmd.title, cmd.delayMessage);
						}
						_w.onFormClose = function ()
						{
							location.reload();
						};
					}
					break;
				case 'kick':
					if (!_w.openForm)
					{
						_w.notify(cmd.title, cmd.message);
						App.Authenticated = false;
						App.permissions = {};
						App.companyData = {};
						App.Sudo = {};
						App.userData = {};
						setTimeout(function ()
						{
							App.API.execTask(
								'logout', 'Profile', 'Logout',
								{}, function ()
								{
									window.location = '/';
								}, function () {}
							);
						}, 3000);
					}
					else
					{
						_w.notify(cmd.title, cmd.delayMessage);
						_w.onFormClose = function ()
						{
							App.Authenticated = false;
							App.permissions = {};
							App.companyData = {};
							App.Sudo = {};
							App.userData = {};
							App.API.execTask(
								'logout', 'Profile', 'Logout',
								{}, function ()
								{
									window.location = '/';
								}, function () {}
							);
							location.reload();
						};
					}
					break;
				case 'permission-change':
					App.API.getTask(
						'getActiveAccount', 'User', 'Profile.ActiveAccount', null,
						{}, _w.onActiveAccount, _w.onActiveAccountFailure
					);
					break;
				case 'dealGenerationUpdate':
					var container = '#progressSection' + cmd.params.Id;
					var containerId = 'progressSection' + cmd.params.Id;
					_w.dealGenUpdate[container] = cmd.params;
					if (_t.dealcyclegrid.published)
					{
						if ('None' == cmd.params.Section)
						{
							//-> Remove section and refresh grid.
							$(container).remove();
							delete _w.dguSection[container];
							delete _w.dealGenUpdate[container];
							$.proxy(_w.searchGrid, _t.dealcyclegrid.template)('grdDealCycle');
							_t.dealcyclegrid.template.getCalculationErrors();
						}
						else
						{
							//-> Progress display.
							var progress = (-1 == cmd.params.Progress)
								? 'processing ...'
								: cmd.params.Progress + '%';
							if (!_w.dguSection[container])
							{
								//-> Section does not yet exist, create it.
								_w.dguSection[container] = true;
								$('#dguContainer').append(
									'<div id="' + containerId + '"><div class="col-md-12">'
									+ '<h5>Deal Generation: ' + cmd.params.DealCycle + '</h5></div>'
									+ '<div class="col-md-12">'
									+ '<div class="col-md-3 text-bold">'
									+ 'Duration:<br/>'
									+ 'Section:<br/>'
									+ 'Task:<br/>'
									+ 'Task Progress:<br/>'
									+ '<hr/>'
									+ '</div>'
									+ '<div class="col-md-7">'
									+ '<span id="' + containerId + 'Duration">' + cmd.params.Duration + '</span><br/>'
									+ '<span id="' + containerId + 'Section">' + cmd.params.Section + '</span><br/>'
									+ '<span id="' + containerId + 'Task">'
									+ '(' + cmd.params.NumTask + ' of ' + cmd.params.NumTasks + ') '
									+ cmd.params.Task
									+ '</span><br/>'
									+ '<span id="' + containerId + 'Progress">' + progress + '</span><br/>'
									+ '<hr/>'
									+ '</div>'
									+ '</div>'
									+ '</div>'
								);
								$.proxy(_w.searchGrid, _t.dealcyclegrid.template)('grdDealCycle');
							}
							else
							{
								//-> Update section with latest progress details.
								$(container + 'Duration').html(cmd.params.Duration);
								$(container + 'Section').html(cmd.params.Section);
								$(container + 'Task').html(
									'(' + cmd.params.NumTask + ' of ' + cmd.params.NumTasks + ') ' + cmd.params.Task
								);
								$(container + 'Progress').html(progress);
							}
						}
					}
					break;
			}
		},


		/**
		 * On successful login and on first load if user has an active session
		 * this function is called.
		 */
		onActiveAccount: function (response, fresh)
		{
			/*
			 * Prepare useful session data, all nicely packed out.
			 * (and show the main menu)
			 */
			App.Authenticated = true;
			App.userData = response.Data;
			App.userType = App.userData.userType;
			$('.navbar-inverse.ghost').removeClass('ghost');


			/*
			 * Some session data needed to finalise meta structs, so lets finalise.
			 */
			_w.finaliseMeta();

			/*
			 * Show and hook up logout button
			 */
			$('#lnkLogin').hide();
            $('#homePage').hide();
            $('#aboutPage').hide();
            $('#lnkLogout').removeClass('ghost');
			$('#lnkLogout').show();
			$('#lnkLogout').click(function ()
			{
				App.Authenticated = false;
				App.userData = {};
				App.userType = 'Guest';
				App.API.execTask(
					'logout', 'Profile', 'Logout',
					{}, function ()
					{
                        $('#homePage').show();
                        $('#aboutPage').show();
						window.location = '/';
					}, function () {}
				);
			});
			$('#mnuProfile').click(function ()
			{
				App.Controller.loadForm(
					'frmModal', 'My Profile', App.allowedSection, 'profile',
					{id: App.userData.id}, {}, null
				);
			});

			/*
			 * Show user details
			 */
			$('#infUserName').html(
				App.userData.firstName + ' ' + App.userData.familyName
			);
			$('#loggedIn').show();
			$('#loggedOut').hide();
			$('#userTxtOut').hide();
			$('#userTxtIn').show();
			$('#mnuUser').show();
			/*
			 * Init permissions and page listeners.
			 */
			if ('User' == App.userType)
			{
				App.allowedSection = 'portal';
				if (App.userData.forcePasswordChange)
				{
					window.location.hash = '/change-password';
				}
				else if (App.redirect)
				{
					_w.initPortal();
					window.location.hash = App.redirect;
					delete App.redirect;
				}
				else
				{
					_w.initPortal();
					window.location.hash = App.Config.sectionLandingPage.Portal;
				}
			}
			else if ('Administrator' == App.userType)
			{
				App.allowedSection = 'admin';
				if (App.userData.forcePasswordChange)
				{
					window.location.hash = '/change-password';
				}
				else if (App.redirect)
				{
					_w.initAdmin();
					window.location.hash = App.redirect;
					delete App.redirect;
				}
				else
				{
					_w.initAdmin();
					window.location.hash = window.location.hash = App.Config.sectionLandingPage.Admin;
				}
			}
			else
			{
				// No permissions at all
				App.allowedSection = 'brochure';
				window.location.hash = App.Config.sectionLandingPage.Brochure;
			}
			if (!App.started)
			{
				App.start();
			}
		},

		/**
		 * The user is not logged in.
		 */
		onActiveAccountFailure: function ()
		{
			/*
			 * User is not authenticated.
			 */
			$('.navbar-inverse').addClass('ghost');
			App.Authenticated = false;
			$('#loggedIn').hide();
			$('#loggedOut').show();
			$('#userTxtOut').show();
			$('#userTxtIn').hide();

			/* $('#user-details').addClass("invisible"); */

			/*
			 * Initialize brochure
			 */
			App.allowedSection = 'brochure';
			_w.initBrochure();

			if (!App.started)
			{
				App.start();
			}
		},


		initBrochure: function ()
		{
			$('a.navbar-brand vodacom_logo').attr('href', '/');
			if (_w.contextVisible)
			{
				$('#ContextMenu').toggleClass('ghost');
				$('#wrapper').toggleClass('full-main');
				_w.contextVisible = false;
			}
			$('#BrochureMenu').show();
			$('#PortalMenu').hide();
			$('#AdminMenu').hide();
			$('#MainMenu').show(300);
		},

		initAdmin: function ()
		{
			$('a.navbar-brand.vodacom_logo').attr('href', '/');
			$('.notification-handle > span.glyphicon').click(function (evt)
			{
				evt.stopPropagation();
				if (_w.notifyDropVisible)
				{
					$('.notify-dropdown').fadeOut(300);
					_w.notifyDropVisible = false;
				}
				else
				{
					$('.notify-dropdown').fadeIn(300);
					_w.notifyDropVisible = true;
				}
				_w.delay(function ()
				{
					$('.notify-dropdown').fadeOut(300);
					_w.notifyDropVisible = false;
				}, 3000);
				$('.notify-dropdown').mouseover(function ()
				{
					_w.delay(function ()
					{
						$('.notify-dropdown').fadeIn(300);
						_w.notifyDropVisible = true;
					}, 1);
				});
				$('.notify-dropdown').mouseout(function ()
				{
					_w.delay(function ()
					{
						$('.notify-dropdown').fadeOut(300);
						_w.notifyDropVisible = false;
					}, 1000);
				});
			});
			$('#BrochureMenu').hide();
			$('#PortalMenu').hide();
			$('#AdminMenu').show();
			$('#MainMenu').show(300);
		},

		initPortal: function ()
		{
			$('a.navbar-brand.vodacom_logo').attr('href', '/#/dashboard-grid');
			$('.notification-handle').click(function (evt)
			{
				evt.stopPropagation();
				if (_w.notifyDropVisible)
				{
					$('.notify-dropdown').fadeOut(300);
					_w.notifyDropVisible = false;
				}
				else
				{
					$('.notify-dropdown').fadeIn(300);
					_w.notifyDropVisible = true;
				}
				_w.delay(function ()
				{
					$('.notify-dropdown').fadeOut(300);
					_w.notifyDropVisible = false;
				}, 3000);
				$('.notify-dropdown').mouseover(function ()
				{
					_w.delay(function ()
					{
						$('.notify-dropdown').fadeIn(300);
						_w.notifyDropVisible = true;
					}, 1);
				});
				$('.notify-dropdown').mouseout(function ()
				{
					_w.delay(function ()
					{
						$('.notify-dropdown').fadeOut(300);
						_w.notifyDropVisible = false;
					}, 1000);
				});
			});
			$('#BrochureMenu').hide();
			$('#AdminMenu').hide();
			$('#PortalMenu').show();
			$('#MainMenu').show(300);
		},

	};

})();
