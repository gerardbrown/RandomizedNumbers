;
(function ()
{
	_App.Template = function ()
	{
		this.initialize();
	};

	_App.Template.prototype =
	{

		state: null,
		tempStore: {},
		templateStore: {},
		instanceCounter: 0,

		initialize: function ()
		{
			// Nothing to do.
		},

		emptyTemplate: {
			jobId: null,
			itemId: null,
			newItem: null,
			itemId: null,
			itemData: null,
			haveData: false,
			grids: {},
			groups: {},
			forms: {},
			rules: {},
			messages: {},
			meta: {},
			elements: {},
			defaultForm: 'NoFormSpecified'
		},

		/**
		 * Retrieve a template from the server.
		 * @param type
		 * @param name
		 * @param lifespan
		 */
		retrieve: function (type, name, lifespan, callback)
		{
			if (!this.templateStore[name])
			{
				this.templateStore[name] = {};
				this.tempStore[name] = {};
				this.tempStore[name]["callback"] = callback;
				var rnd = new Date().getTime();
				App.Ajax.GET({
						id: name,
						url: 'templates/' + type + '/' + name + '.html?t=' + rnd
					},
					$.proxy(this._retrievedHtml, this),
					$.proxy(this._retrievalError, this));
				App.Ajax.SCRIPT({
						id: name,
						url: 'templates/' + type + '/' + name + '.js?t=' + rnd
					},
					$.proxy(this._retrievedJs, this),
					$.proxy(this._jsRetrievalError, this));
			}
			else
			{
				callback(name);
			}
		},

		_retrievalError: function (name)
		{
			this.templateStore[name]["redirect"] = '/notice/error?error=noSuchPage';
			window.location.hash = this.templateStore[name]["redirect"];
		},

		_jsRetrievalError: function (name, textStatus, errorThrown)
		{
			if ('error' == textStatus)
			{
				return;
			}
			_w.notify('Error retrieving template.', textStatus);
			//console.log(errorThrown);
		},

		_retrievedJs: function (name, data)
		{
			this.tempStore[name]['class'] = "template_" + name;
			if (this.tempStore[name]['html'])
			{
				this._retrievedHtmlAndJs(name);
			}
		},

		_retrievedHtml: function (name, data)
		{
			this.tempStore[name]['html'] = data;
			if (this.tempStore[name]['class'])
			{
				this._retrievedHtmlAndJs(name);
			}
		},

		_retrievedHtmlAndJs: function (name)
		{
			// Instantiate
			if (!window[this.tempStore[name]['class']])
			{
				//console.log('The requested template is named incorrectly and cannot be instantiated.');
				return;
			}
			this.templateStore[name] = new window[this.tempStore[name]['class']](
				this.tempStore[name]['html']
			);
			// Setup some basic fields that we can bargain on having around.
			if (undefined == this.templateStore[name].defaultForm)
			{
				this.templateStore[name].defaultForm = 'General';
			}
			this.templateStore[name].nsMap = {};
			if (!this.templateStore[name].rules)
			{
				this.templateStore[name].rules = {};
			}
			if (!this.templateStore[name].messages)
			{
				this.templateStore[name].messages = {};
			}
			// Process meta to a more refined and ready to use state.
			this.templateStore[name].gridFieldMap = {};
			this.templateStore[name].gridFieldPermissions = {};
			if (!this.templateStore[name]['meta'].General)
			{
				this.templateStore[name]['meta'].General = {};
			}
			if (this.templateStore[name].defaultForm)
			{
				for (var formName in this.templateStore[name].forms)
				{
					var form = this.templateStore[name].forms[formName];
					if (!this.templateStore[name]['meta'][form.namespace])
					{
						this.templateStore[name]['meta'][form.namespace] = {};
					}
					if (form.fields)
					{
						if (form.dataspace)
						{
							for (var elem in form.fields)
							{
								if (!form.fields[elem].namespace)
								{
									form.fields[elem].namespace = form.dataspace;
								}
								if (!form.fields[elem].field)
								{
									form.fields[elem].field = elem;
								}
							}
						}
						this.templateStore[name]['meta'][form.namespace] = $.extend(
							true, {},
							this.templateStore[name]['meta'][form.namespace],
							form.fields
						);
					}
					for (var action in form.actions)
					{
						if (form.actions[action].button)
						{
							form.actions[action].button.actionForm = formName;
							form.actions[action].button.actionContext = action;
							this.templateStore[name]['meta'].General[
								form.actions[action].button.id
								] = form.actions[action].button;
						}
					}
				}
			}
			if (this.templateStore[name].defaultGrid)
			{
				for (var gridName in this.templateStore[name].grids)
				{
					var grid = this.templateStore[name].grids[gridName];
					if (!this.templateStore[name]['meta'][grid.namespace])
					{
						this.templateStore[name]['meta'][grid.namespace] = {};
					}
					if (grid.titleId && grid.titleText)
					{
						this.templateStore[name]['meta'].General[grid.titleId] = {
							handler: 'Text',
							id: grid.titleId,
							value: grid.titleText,
							grid: gridName
						};
					}
					if (grid.titleButtons)
					{
						this.templateStore[name]['meta'].General[grid.titleButtons.id] = $.extend(
							true, {},
							App.DataElement.GridTitleButtons,
							grid.titleButtons
						);
					}
					if (grid.contextFilter)
					{
						this.templateStore[name]['meta'][grid.namespace][grid.contextFilter.id] = $.extend(
							true, {},
							App.DataElement.GridContextFilter,
							{}
						);
					}
					if (grid.dataFields)
					{
						this.templateStore[name]['meta'][grid.namespace][grid.dataFields.id] = $.extend(
							true, {},
							App.DataElement.GridColumns,
							grid.dataFields.targets
								? grid.dataFields.targets
								: {}
						);
						if (grid.dataFields.repeaterId)
						{
							this.templateStore[name]['meta'][grid.namespace][grid.dataFields.repeaterId] = $.extend(
								true, {},
								App.DataElement.GridRowRepeater,
								{}
							);
						}
					}
					if (grid.pagerId)
					{
						this.templateStore[name]['meta'][grid.namespace][grid.pagerId] = $.extend(
							true, {},
							App.DataElement.GridPager,
							{}
						);
					}
					if (grid.pageSizerId)
					{
						this.templateStore[name]['meta'][grid.namespace][grid.pageSizerId] = $.extend(
							true, {},
							App.DataElement.GridPageSize,
							{
								allowLarge: grid.sizerAllowLarge
							}
						);
					}
					if (grid.pageRecords)
					{
						this.templateStore[name]['meta'][grid.namespace][grid.pageRecords] = $.extend(
							true, {},
							App.DataElement.GridRecords,
							{}
						);
					}
				}
			}

			if (this.templateStore[name].defaultGroup)
			{
				for (var groupName in this.templateStore[name].groups)
				{
					var group = this.templateStore[name].groups[groupName];
					if (!this.templateStore[name]['meta'][group.namespace])
					{
						this.templateStore[name]['meta'][group.namespace] = {};
					}
					if (group.titleId && group.titleText)
					{
						this.templateStore[name]['meta'].General[group.titleId] = {
							handler: 'Text',
							id: group.titleId,
							value: group.titleText,
							group: groupName
						};
					}
					if (group.titleButtons)
					{
						group.titleButtons.id = $.extend(
							true, {},
							App.DataElement.GroupTitleButtons,
							group.titleButtons
						);
					}
					if (group.contextFilter)
					{
						this.templateStore[name]['meta'][group.namespace][group.contextFilter.id] = $.extend(
							true, {},
							App.DataElement.groupContextFilter,
							{}
						);
					}
					if (group.dataFields)
					{
						this.templateStore[name]['meta'][group.namespace][group.dataFields.id] = $.extend(
							true, {},
							App.DataElement.GroupColumns,
							group.dataFields.targets
								? group.dataFields.targets
								: {}
						);
						if (group.dataFields.repeaterId)
						{
							this.templateStore[name]['meta'][group.namespace][group.dataFields.repeaterId] = $.extend(
								true, {},
								App.DataElement.GroupRowRepeater,
								{}
							);
						}
					}
					/*
					 if (group.pagerId)
					 {
					 this.templateStore[name]['meta'][group.namespace][group.pagerId] = $.extend(
					 true, {},
					 App.DataElement.groupPager,
					 {}
					 );
					 }*/
				}
			}


			for (var ns in this.templateStore[name].meta)
			{
				for (var item in this.templateStore[name].meta[ns])
				{
					// Namespace map
					this.templateStore[name].nsMap[item] = ns;

					// Form elements
					if (this.templateStore[name].defaultForm)
					{
						if (undefined == this.templateStore[name].meta[ns][item].form)
						{
							this.templateStore[name]['meta'][ns][item].form = 'General' != ns
								? this.templateStore[name].defaultForm
								: 'General';
						}
						var form = this.templateStore[name]['meta'][ns][item].form;
						if (this.templateStore[name].forms[form]
						    && this.templateStore[name].forms[form].defaults)
						{
							this.templateStore[name]['meta'][ns][item] = $.extend(
								{},
								this.templateStore[name].forms[form].defaults,
								this.templateStore[name]['meta'][ns][item]
							);
						}
						if (!this.templateStore[name].rules[form])
						{
							this.templateStore[name].rules[form] = {};
						}
						this.templateStore[name].rules[form][item]
						= this.templateStore[name]['meta'][ns][item].rules;
						if (!this.templateStore[name].messages[form])
						{
							this.templateStore[name].messages[form] = {};
						}
						this.templateStore[name].messages[form][item]
						= this.templateStore[name]['meta'][ns][item].messages
							? this.templateStore[name]['meta'][ns][item].messages
							: {};
					}

					// Grid elements
					if (this.templateStore[name].defaultGrid)
					{
						if (undefined == this.templateStore[name]['meta'][ns][item].grid)
						{
							this.templateStore[name]['meta'][ns][item].grid = 'General' != ns
								? this.templateStore[name].defaultGrid
								: 'General';
						}
						var grid = this.templateStore[name]['meta'][ns][item].grid;
						if (this.templateStore[name].grids[grid]
						    && this.templateStore[name].grids[grid].defaults)
						{
							this.templateStore[name]['meta'][ns][item] = $.extend(
								{},
								this.templateStore[name]['meta'][ns][item],
								this.templateStore[name].grids[grid].defaults
							);
						}
						if ('GridContextFilter' == this.templateStore[name]['meta'][ns][item].constructor
						    || 'GridConstructorComponentCollection'
						       == this.templateStore[name]['meta'][ns][item].handler)
						{
							if ('GridContextFilter' == this.templateStore[name]['meta'][ns][item].constructor)
							{
								this.templateStore[name]['meta'][ns][item] = $.extend(
									true, {},
									this.templateStore[name]['meta'][ns][item],
									this.templateStore[name].grids[grid].contextFilter
								);
								this.templateStore[name]['meta'][ns][item].items.actions.bindClear = $.proxy(
									_w.clearSearch, this.templateStore[name], grid
								);
								this.templateStore[name]['meta'][ns][item].items.actions.bindSearch = $.proxy(
									_w.searchGrid, this.templateStore[name], grid
								);
								var items = this.templateStore[name]['meta'][ns][item].items;
								for (var i in items)
								{
									if (!items[i].id)
									{
										continue;
									}
									if (!this.templateStore[name].gridFieldMap[grid])
									{
										this.templateStore[name].gridFieldMap[grid] = {};
									}
									this.templateStore[name].gridFieldMap[grid][items[i].id] = items[i].field;
								}
							}
							if ('GridConstructorComponentCollection' == this.templateStore[name]['meta'][ns][item].handler)
							{
								var fields = this.templateStore[name].grids[grid].dataFields.items;
								var items = this.templateStore[name]['meta'][ns][item].items;

								var elemNs = this.templateStore[name].grids[grid].elementNs;
								this.templateStore[name]['meta'][ns][item].defaults
								= this.templateStore[name].grids[grid].dataFields.defaults;
								if (!this.templateStore[name].gridFieldMap[grid])
								{
									this.templateStore[name].gridFieldMap[grid] = {};
								}
								if (!this.templateStore[name].gridFieldPermissions[grid])
								{
									this.templateStore[name].gridFieldPermissions[grid] = {};
								}
								for (var fld in fields)
								{
									this.templateStore[name].gridFieldPermissions[grid][fld] = true;
									if ('id' == fld)
									{
										continue;
									}
									if (fields[fld].permissions && !_w.checkPermissions(fields[fld].permissions))
									{
										this.templateStore[name].gridFieldPermissions[grid][fld] = false;
										continue;
									}
									items[fld] = {};
									items[fld].id = fld;
									items[fld].label = fields[fld].label;
									if (undefined != fields[fld].permission)
									{
										items[fld].permission = fields[fld].permission;
									}
									if (fields[fld].dataSource)
									{
										items[fld].dataSource = fields[fld].dataSource;
									}
									if (fields[fld].dataList)
									{
										items[fld].dataList = fields[fld].dataList;
									}
									if (fields[fld].dataQuery)
									{
										items[fld].dataQuery = fields[fld].dataQuery;
									}
									if (fields[fld].selectEmpty)
									{
										items[fld].selectEmpty = fields[fld].selectEmpty;
									}
									if (fields[fld].field)
									{
										items[fld].filterId = elemNs + 'Filter_' + items[fld].id;
										items[fld].field = fields[fld].field;
										items[fld].orderAsc = {
											id: elemNs + 'Order_' + items[fld].id + 'Asc',
											bind: $.proxy(_w.orderGrid, this.templateStore[name], grid, items[fld].field, 'ASC')
										};
										items[fld].orderDesc = {
											id: elemNs + 'Order_' + items[fld].id + 'Desc',
											bind: $.proxy(_w.orderGrid, this.templateStore[name], grid, items[fld].field, 'DESC')
										};
										this.templateStore[name].gridFieldMap[grid][items[fld].filterId] = items[fld].field;
									}
								}
							}
						}
						if ('GridPager' == this.templateStore[name]['meta'][ns][item].handler)
						{
							this.templateStore[name]['meta'][ns][item].id = this.templateStore[name].grids[grid].pagerId;
							this.templateStore[name]['meta'][ns][item].bind = $.proxy(_w.pageGrid, this.templateStore[name], grid);
						}
						if ('GridPageSize' == this.templateStore[name]['meta'][ns][item].handler)
						{
							this.templateStore[name]['meta'][ns][item].id = this.templateStore[name].grids[grid].pageSizerId;
							this.templateStore[name]['meta'][ns][item].bind = $.proxy(_w.sizeGrid, this.templateStore[name], grid);
						}
						if ('GridRecords' == this.templateStore[name]['meta'][ns][item].handler)
						{
							this.templateStore[name]['meta'][ns][item].id = this.templateStore[name].grids[grid].pageRecords;
						}
					}

					// Group elements

					if (this.templateStore[name].defaultGroup)
					{
						if (undefined == this.templateStore[name]['meta'][ns][item].group)
						{
							this.templateStore[name]['meta'][ns][item].group = 'General' != ns
								? this.templateStore[name].defaultGroup
								: 'General';
						}
						var group = this.templateStore[name]['meta'][ns][item].group;
						if (this.templateStore[name].groups[group]
						    && this.templateStore[name].groups[group].defaults)
						{
							this.templateStore[name]['meta'][ns][item] = $.extend(
								{},
								this.templateStore[name]['meta'][ns][item],
								this.templateStore[name].groups[group].defaults
							);


						}


						if ('GroupContextFilter' == this.templateStore[name]['meta'][ns][item].constructor
						    || 'GroupConstructorComponentCollection'
						       == this.templateStore[name]['meta'][ns][item].handler)
						{
							if ('GroupContextFilter' == this.templateStore[name]['meta'][ns][item].constructor)
							{
								this.templateStore[name]['meta'][ns][item] = $.extend(
									true, {},
									this.templateStore[name]['meta'][ns][item],
									this.templateStore[name].groups[group].contextFilter
								);
								this.templateStore[name]['meta'][ns][item].items.actions.bindClear = $.proxy(
									_w.clearSearch, this.templateStore[name], group
								);
								this.templateStore[name]['meta'][ns][item].items.actions.bindSearch = $.proxy(
									_w.searchGroup, this.templateStore[name], group
								);
								var items = this.templateStore[name]['meta'][ns][item].items;


								for (var i in items)
								{
									if (!items[i].id)
									{
										continue;
									}
									if (!this.templateStore[name].groupFieldMap[group])
									{
										this.templateStore[name].groupFieldMap[group] = {};
									}
									this.templateStore[name].groupFieldMap[group][items[i].id] = items[i].field;
								}
							}
							if ('groupConstructorComponentCollection' == this.templateStore[name]['meta'][ns][item].handler)
							{
								var fields = this.templateStore[name].groups[group].dataFields.items;
								var items = this.templateStore[name]['meta'][ns][item].items;
								var elemNs = this.templateStore[name].groups[group].elementNs;
								this.templateStore[name]['meta'][ns][item].defaults
								= this.templateStore[name].groups[group].dataFields.defaults;
								if (!this.templateStore[name].groupFieldMap[group])
								{
									this.templateStore[name].groupFieldMap[group] = {};
								}
								if (!this.templateStore[name].groupFieldPermissions[group])
								{
									this.templateStore[name].groupFieldPermissions[group] = {};
								}
								for (var fld in fields)
								{
									this.templateStore[name].groupFieldPermissions[group][fld] = true;
									if ('id' == fld)
									{
										continue;
									}
									if (fields[fld].permissions && !_w.checkPermissions(fields[fld].permissions))
									{
										this.templateStore[name].groupFieldPermissions[group][fld] = false;
										continue;
									}
									items[fld] = {};
									items[fld].id = fld;
									items[fld].label = fields[fld].label;
									if (undefined != fields[fld].permission)
									{
										items[fld].permission = fields[fld].permission;
									}
									if (fields[fld].dataSource)
									{
										items[fld].dataSource = fields[fld].dataSource;
									}
									if (fields[fld].dataList)
									{
										items[fld].dataList = fields[fld].dataList;
									}
									if (fields[fld].dataQuery)
									{
										items[fld].dataQuery = fields[fld].dataQuery;
									}
									if (fields[fld].selectEmpty)
									{
										items[fld].selectEmpty = fields[fld].selectEmpty;
									}
									if (fields[fld].field)
									{
										items[fld].filterId = elemNs + 'Filter_' + items[fld].id;
										items[fld].field = fields[fld].field;
										items[fld].orderAsc = {
											id: elemNs + 'Order_' + items[fld].id + 'Asc',
											bind: $.proxy(_w.orderGroup, this.templateStore[name], group, items[fld].field, 'ASC')
										};
										items[fld].orderDesc = {
											id: elemNs + 'Order_' + items[fld].id + 'Desc',
											bind: $.proxy(_w.orderGroup, this.templateStore[name], group, items[fld].field, 'DESC')
										};
										// add the order by here (see distinct)
										this.templateStore[name].groupFieldMap[group][items[fld].filterId] = items[fld].field;
									}
								}
							}
						}
						if ('GroupPager' == this.templateStore[name]['meta'][ns][item].handler)
						{
							this.templateStore[name]['meta'][ns][item].id = this.templateStore[name].groups[group].pagerId;
							this.templateStore[name]['meta'][ns][item].bind = $.proxy(_w.pageGroup, this.templateStore[name], group);
						}
					}

					// Construct the element
					if (undefined == App.TemplateElement[this.templateStore[name]['meta'][ns][item].handler])
					{
						//console.log('Could not construct element ' + ns + ':' + item);
						//console.log('Handler ' + this.templateStore[name]['meta'][ns][item].handler);
						//console.log(App.TemplateElement);
						continue;
					}
					this.templateStore[name].elements[item] = new App.TemplateElement[
						this.templateStore[name]['meta'][ns][item].handler
						](item);
					this.templateStore[name]['meta'][ns][item].id = item;
				}
			}
			// Let somebody know that the template is ready for use.
			this.tempStore[name]["callback"](name);
			delete this.tempStore[name];
		},

		/**
		 * Register a new template instance.
		 * Template must already have been retrieved from server.
		 * @param id
		 * @param name
		 * @param target
		 * @param data
		 * @returns
		 */
		register: function (id, type, name, target, data, callback)
		{
			if (_r[id + ':' + name])
			{
				return;
			}
			_r[id + ':' + name] = true;
			_t[id] = new this._templateInstance(
				this.instanceCounter,
				null,
				target, data
			);
			App.Event.trigger(
				'Template.Ready:' + name,
				{"id": name, "pageName": name}
			);
			if (!this.templateStore[name] || !this.templateStore[name].ti)
			{
				this.retrieve(type, name, true, $.proxy(this._hydrateTemplate, this, callback, id));
			}
			else
			{
				if (this.templateStore[name]["redirect"])
				{
					window.location.hash = this.templateStore[name]["redirect"];
					return;
				}
				_t[id].setTemplate(this.templateStore[name]);
				callback(id, name);
				delete _r[id + ':' + name];
			}
			this.instanceCounter++;
			return _t[id];
		},

		_hydrateTemplate: function (callback, id, name)
		{
			_t[id].setTemplate(this.templateStore[name]);
			_t[id].template.templateName = id;
			callback(id, name);
			delete _r[id + ':' + name];
		},

		_templateInstance: function (tid, template, target, data)
		{
			this.tid = tid;
			this.template = template;
			this.target = target;
			this.data = null;
			this.ready = false;
			this.published = false;
			this.autoPublish = [];
			if (this.template && this.template.static)
			{
				_w.checkPermissions(this.template.permissions);
				$.proxy(_w.setupContracts, this.template)();
				this.construct = this.template.static.replaceAll('[tid]', this.tid);
				this.template.ti = this;
				if (undefined != this.template.init)
				{
					this.template.init();
				}
				this.hydrate(this.data);
			}

			/**
			 * Do something when we publish.
			 */
			this.onPublish = function (callback)
			{
				if (!this.published)
				{
					this.autoPublish.push(callback);
				}
				else
				{
					callback();
				}
			};

			/**
			 * Set the template to work with for this instance.
			 * @param template
			 */
			this.setTemplate = function (template)
			{
				this.template = template;
				this.construct = this.template.static
					? this.template.static.replaceAll('[tid]', this.tid)
					: '';
				this.template.ti = (this);
				if (undefined != this.template.permissions
				    && 0 < this.template.permissions.length)
				{
					if (!App.Authenticated)
					{
						window.location.hash = '/notice/error?error=pagePermissionDenied';
						return;
					}
					for (var i in this.template.permissions)
					{
						var perm = this.template.permissions[i];
						if (!App.permissions[perm])
						{
							window.location.hash = '/notice/error?error=pagePermissionDenied';
							return;
						}
					}
				}
				$.proxy(_w.setupContracts, this.template)();
				if (undefined != this.template.init)
				{
					this.template.init();
				}
				this.hydrate(this.data);
			};

			/**
			 * Hydrate template with dataset.
			 * This can be called before and after template publication.
			 * @param data
			 */
			this.hydrate = function (data)
			{
				data = $.extend(true, {}, this.template.meta, data);
				this.data = data;
				if (this.template)
				{
					for (var ns in data)
					{
						for (var element in data[ns])
						{
							var elem = this.template.elements[element];
							if (undefined == elem)
							{
								continue;
							}
							value = (data[ns][element])
								? data[ns][element]
								: null;
							if (this.published)
							{
								elem.hydrateLive(this.tid, value);
							}
							else
							{
								this.construct = elem.hydrate(this.construct, value);
							}
						}
					}
				}
			};
			if (this.template && this.data)
			{
				this.hydrate(this.data);
			}

			this.hydratePartial = function (data)
			{
				if (!this.data)
				{
					this.data = {};
				}
				data = $.extend(true, {}, this.template.meta, data);
				if (this.template && this.template.elements)
				{
					for (var ns in data)
					{
						for (var element in data[ns])
						{
							if (this.template.elements[element])
							{
								var elem = this.template.elements[element];
								if (undefined == elem)
								{
									continue;
								}
								value = (data[ns][element])
									? data[ns][element]
									: null;
								this.data[element] = value;
								if (this.published)
								{
									elem.hydrateLive(this.tid, value);
								}
								else
								{
									this.construct = elem.hydrate(this.construct, value);
								}
							}
						}
					}
				}
			};

			/**
			 * Hydrate template with a single parameter.
			 * This can be called before and after template publication.
			 * @param param
			 * @param value
			 */
			this.hydrateParam = function (param, value)
			{
				if (!this.data)
				{
					this.data = {};
				}
				var ns = this.template.nsMap[param];
				this.data[ns][param] = $.extend(true, {}, this.template.meta[ns][param], value);
				if (this.template && this.template.elements[param])
				{
					var elem = this.template.elements[param];
					if (this.published)
					{
						elem.hydrateLive(this.tid, this.data[ns][param]);
					}
					else
					{
						this.construct = elem.hydrate(this.construct, this.data[ns][param]);
					}
				}
			};

			/**
			 * Publish template to registered target.
			 */
			this.publish = function (target)
			{
				App.Template.state = 'Publish';
				target = target
					? target
					: this.target;
				this.target = target;
				$('#' + target).html(
					'<div id="' + this.tid + '">' + this.construct + '</div>'
				);

				this.published = true;
				//$('.selectpicker').selectpicker();
				App.Template.state = 'Published';

				for (var element in this.template.elements)
				{
					this.template.elements[element].publish(this.tid);
				}


				if (this.template.construct)
				{
					this.template.construct();
					if (this.template.altAlertBox)
					{
						_w.altAlertBox = this.template.altAlertBox;
					}
				}
				this.template.buttonRollback = [];
				for (var form in this.template.forms)
				{
					for (var i in this.template.forms[form].buttons)
					{
						if (!$('#' + this.template.forms[form].buttons[i]).prop('disabled'))
						{
							this.template.buttonRollback.push(
								this.template.forms[form].buttons[i]
							);
							$('#' + this.template.forms[form].buttons[i]).prop('disabled', true);
						}
					}
				}
				if (this.template.defaultGrid)
				{
					$.proxy(_w.publishGrids, this.template)();
				}
				if (this.template.haveData)
				{
					$.proxy(_w.setupValidators, this.template)();
				}
				for (var i in this.autoPublish)
				{
					this.autoPublish[i]();
				}
				this.autoPublish = [];
			};

			/**
			 * Harvest dataset from published template.
			 * @returns {___anonymous3461_3462}
			 */
			this.harvest = function (form)
			{
				App.Template.state = 'Harvest';
				var newData = {};
				for (var ns in this.template.meta)
				{
					for (var element in this.template.meta[ns])
					{
						if ((!form || form == this.template.meta[ns][element].form)
						    && !this.template.meta[ns][element].noHarvest)
						{
							if (!newData[ns])
							{
								newData[ns] = {};
							}
							var field = this.template.meta[ns][element].field
								? this.template.meta[ns][element].field
								: this.template.meta[ns][element].id;
							newData[ns][field] = this.template.elements[element].harvest(this.tid);
						}
					}
				}
				App.Template.state = 'Published';
				return newData;
			};

			/**
			 * Unpublish template.
			 * Template can be re-published afterward.
			 */
			this.remove = function ()
			{
				App.Template.state = 'Destruct';
				if (this.template)
				{
					try
					{
						this.template.destruct();
						if (this.template.altAlertBox)
						{
							_w.altAlertBox = false;
						}
					}
					catch (e)
					{
					}
				}
				$('#' + this.tid).remove();
				this.published = false;
			};
		}

	};

})();
