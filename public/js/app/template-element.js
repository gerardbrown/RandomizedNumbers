;
(function ()
{
	_App.TemplateElement = function ()
	{
		this.initialize();
	};
	_App.TemplateElement.prototype =
	{

		initialize: function ()
		{
			// Nothing to do.
		},

		/**
		 * Create a new Text element for a template.
		 * Example: var name = new App.TemplateElement.Text('name');
		 * @param id
		 */
		Text: function (id)
		{
			this.id = id;

			this.hydrate = function (template, meta)
			{
				value = meta && meta.value
					? meta.value
					: '&nbsp;';
				return template.replace('[' + this.id + ']', value);
			};

			this.hydrateLive = function (tid, value)
			{
				$('#' + tid + '_' + this.id).html(value);
			};

			this.publish = function (tid)
			{
				// element bindings and such
			};

			this.harvest = function (tid)
			{
				return $('#' + tid + '_' + this.id).html();
			};
		},

		InlineNotification: function (id)
		{
			this.id = id;

			this.hydrate = function (template, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.InlineNotification.html(this.meta, value);
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.InlineNotification.html(this.meta, value);
				$('#' + tid + '_' + this.id).html(html);
				if (this.meta)
				{
					App.ElementLibrary.InlineNotification.bind(this.meta);
				}
			};

			this.publish = function (tid)
			{
				if (this.meta)
				{
					value = '';
					if (this.meta && this.meta.value)
					{
						value = this.meta.value;
					}
					App.ElementLibrary.InlineNotification.bind(this.meta);
				}
			};

			this.harvest = function (tid)
			{
				return $('#' + tid + '_' + this.id).html();
			};
		},

		LabeledText: function (id)
		{
			this.id = id;

			this.hydrate = function (template, meta)
			{
				var value = (null == meta || null == meta.value)
					? '&nbsp;'
					: meta.value;
				var title = (null == meta || null == meta.title)
					? '&nbsp;'
					: meta.title;
				var labelStyle = (null == meta || null == meta.labelStyle)
					? ''
					: meta.labelStyle;
				var style = (null == meta || null == meta.textStyle)
					? ''
					: meta.textStyle;
				var html = '<label class="control-label ' + labelStyle + '">' + title + ':</label>';
				html += '<div class="controls">';
				html += '<p class="' + style + '" id="' + this.id + '">' + value + '</p>';
				html += '</div>';
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, meta)
			{
				var value = (undefined == meta || null == meta.value)
					? '&nbsp;'
					: meta.value;
				var title = (undefined == meta || null == meta.title)
					? '&nbsp;'
					: meta.title;
				var labelStyle = (null == meta || null == meta.labelStyle)
					? ''
					: meta.labelStyle;
				var style = (null == meta || null == meta.style)
					? ''
					: meta.style;
				var html = '<label class="control-label ' + labelStyle + '">' + title + ':</label>';
				html += '<div class="controls">';
				html += '<p class="' + style + '" id="' + this.id + '">' + value + '</p>';
				html += '</div>';
				$('#' + tid + '_' + this.id).html(html);
			};

			this.publish = function (tid)
			{
				// element bindings and such
			};

			this.harvest = function (tid)
			{
				return $('#' + this.id).html();
			};
		},

		ComponentCollection: function (id)
		{
			this.id = id;
			this.meta = {};

			this.hydrate = function (template, value)
			{
				this.meta = (null == value)
					? '[...]'
					: value;
				var html = '';
				for (var item in this.meta)
				{
					html += this.meta[item]['html'];
				}
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, value)
			{
				this.meta = (null == value)
					? '[...]'
					: value;
				var html = '';
				for (var item in this.meta)
				{
					if (this.meta[item]['html'])
					{
						html += this.meta[item]['html'];
					}
				}
				$('#' + tid + '_' + this.id).html(html);
				for (var item in this.meta)
				{
					if (this.meta[item]['js'])
					{
						this.meta[item]['js']();
					}
				}
			};

			this.publish = function (tid)
			{
				for (var item in this.meta)
				{
					if (this.meta[item]['js'])
					{
						this.meta[item]['js']();
					}
				}
			};

			this.harvest = function (tid)
			{
				return null;
			};
		},

		ConstructorComponentCollection: function (id)
		{
			this.id = id;
			this.meta = {items: {}};
			this.itemMeta = null;

			this.hydrate = function (template, value)
			{
				if (null == value)
				{
					return template;
				}
				this.meta = value;
				var html = '';
				for (var item in this.meta.items)
				{
					html += App.ElementLibrary[this.meta.constructor].html(
						undefined != this.meta.defaults
							? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
							: this.meta.items[item]
					);
				}
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, value)
			{
				if (null == value)
				{
					return;
				}
				this.meta = value;
				var html = '';
				if (this.meta.items)
				{
					for (var i in this.meta.items)
					{
						if (this.meta.defaults)
						{
							this.meta.items[i] = $.extend(true, {}, this.meta.defaults, this.meta.items[i]);
						}
						html += App.ElementLibrary[this.meta.constructor].html(this.meta.items[i]);
					}
				}
				$('#' + tid + '_' + this.id).html(html);
				if (undefined == App.ElementLibrary[this.meta.constructor])
				{
					return;
				}
				if (App.ElementLibrary[this.meta.constructor].bind)
				{
					for (var item in this.meta.items)
					{
						App.ElementLibrary[this.meta.constructor].bind(this.meta.items[item]);
					}
				}
			};

			this.publish = function (tid)
			{
				if (!this.meta.constructor)
				{
					return;
				}
				if (undefined == App.ElementLibrary[this.meta.constructor])
				{
					return;
				}
				if (App.ElementLibrary[this.meta.constructor].bind)
				{
					for (var item in this.meta.items)
					{
						App.ElementLibrary[this.meta.constructor].bind(
							undefined != this.meta.defaults
								? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
								: this.meta.items[item]
						);
					}
				}
			};

			this.harvest = function (tid)
			{
				return null;
			};
		},
		ConstructorGridRowCollection: function (id)
		{
			this.id = id;
			this.meta = {items: {}};
			this.itemMeta = null;
			this.hydrate = function (template, value)
			{
				if (null == value)
				{
					return template;
				}
				this.meta = value;
				var html = '';
				var isGroupingRow = false;
				var groupValue = false;
				for (var item in this.meta.items)
				{

					if (this.meta.items[item].grouping)
					{
						var grouping = this.meta.items[item].grouping;
						isGroupingRow = groupValue != this.meta.items[item].items[grouping.field];
						if (isGroupingRow)
						{
							groupValue = this.meta.items[item].items[grouping.field];
							html += App.ElementLibrary[this.meta.constructor].html(
								undefined != this.meta.defaults
									? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
									: this.meta.items[item],
								isGroupingRow, groupValue
							);
							isGroupingRow = false;
						}
					}
					html += App.ElementLibrary[this.meta.constructor].html(
						undefined != this.meta.defaults
							? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
							: this.meta.items[item],
						isGroupingRow, groupValue
					);
				}
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, value)
			{
				if (null == value)
				{
					return;
				}
				this.meta = value;

				var html = '';
				var isGroupingRow = false;
				var groupValue = false;
				if (this.meta.items)
				{
					for (var i in this.meta.items)
					{
						if (this.meta.defaults)
						{
							this.meta.items[i] = $.extend(true, {}, this.meta.defaults, this.meta.items[i]);
						}
						if (this.meta.items[i].grouping)
						{
							var grouping = this.meta.items[i].grouping;
							isGroupingRow = groupValue != this.meta.items[i].items[grouping.field];
							if (isGroupingRow)
							{

								groupValue = this.meta.items[i].items[grouping.field];

								html += App.ElementLibrary[this.meta.constructor].html(
									undefined != this.meta.defaults
										? $.extend(true, {}, this.meta.defaults, this.meta.items[i])
										: this.meta.items[i],
									isGroupingRow, groupValue
								);
								isGroupingRow = false;
							}
						}
						html += App.ElementLibrary[this.meta.constructor].html(this.meta.items[i], isGroupingRow, groupValue);
					}
				}
				$('#' + tid + '_' + this.id).html(html);

				if (undefined == App.ElementLibrary[this.meta.constructor])
				{
					return;
				}
				if (App.ElementLibrary[this.meta.constructor].bind)
				{
					var isGroupingRow = false;
					var groupValue = false;

					for (var item in this.meta.items)
					{
						if (this.meta.items[item].grouping == undefined)
						{
							var grouping = false;
						}
						isGroupingRow = undefined == grouping
							? false
							: groupValue != this.meta.items[item].items[grouping.field];

						if (isGroupingRow)
						{
							groupValue = this.meta.items[item].items[grouping.field];
							App.ElementLibrary[this.meta.constructor].bind(
								undefined != this.meta.defaults
									? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
									: this.meta.items[item],
								isGroupingRow, groupValue
							);
							isGroupingRow = false;
						}
						App.ElementLibrary[this.meta.constructor].bind(
							undefined != this.meta.defaults
								? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
								: this.meta.items[item],
							isGroupingRow, groupValue
						);
					}
				}
			};

			this.publish = function (tid)
			{
				if (!this.meta.constructor)
				{
					return;
				}
				if (undefined == App.ElementLibrary[this.meta.constructor])
				{
					return;
				}
				if (App.ElementLibrary[this.meta.constructor].bind)
				{
					var isGroupingRow = false;
					var groupValue = false;


					for (var item in this.meta.items)
					{

						if (this.meta.items[item].grouping == undefined)
						{
							var grouping = false;
						}
						isGroupingRow = undefined == grouping
							? false
							: groupValue != this.meta.items[item].items[grouping.field];
						if (isGroupingRow)
						{
							groupValue = this.meta.items[item].items[grouping.field];
							App.ElementLibrary[this.meta.constructor].bind(
								undefined != this.meta.defaults
									? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
									: this.meta.items[item],
								isGroupingRow, groupValue
							);
							isGroupingRow = false;
						}
						App.ElementLibrary[this.meta.constructor].bind(
							undefined != this.meta.defaults
								? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
								: this.meta.items[item],
							isGroupingRow, groupValue
						);
					}
				}
			};

			this.harvest = function (tid)
			{
				return null;
			};
		},

		GridConstructorComponentCollection: function (id)
		{
			this.id = id;
			this.meta = {items: {}};
			this.itemMeta = null;

			this.hydrate = function (template, value)
			{
				if (null == value)
				{
					return template;
				}
				this.meta = value;
				var singleSearch = '';
				var headers = '';
				var filters = '';
				if (this.meta.singleSearchBarId)
				{
					singleSearch += App.ElementLibrary.GridSingleSearch.html(
						this.meta.items,
						this.meta.singleSearchFilterId
					);
				}
				for (var item in this.meta.items)
				{
					headers += App.ElementLibrary.GridColumnHeader.html(
						undefined != this.meta.defaults
							? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
							: this.meta.items[item]
					);
					if (this.meta.filterId)
					{
						filters += App.ElementLibrary.GridColumnFilter.html(
							undefined != this.meta.defaults
								? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
								: this.meta.items[item]
						);
					}
				}
				var html = template;
				if (this.meta.singleSearchBarId)
				{
					html = html.replace('[' + this.meta.singleSearchBarId + ']', singleSearch);
				}
				html = html.replace('[' + this.meta.headerId + ']', headers);
				if (this.meta.filterId)
				{
					html = html.replace('[' + this.meta.filterId + ']', filters);
				}
				return html;
			};

			this.hydrateLive = function (tid, value)
			{
				if (null == value)
				{
					return;
				}
				this.meta = value;
				var singleSearch = '';
				var headers = '';
				var filters = '';
				if (this.meta.singleSearchBarId)
				{
					singleSearch += App.ElementLibrary.GridSingleSearch.html(
						this.meta.items,
						this.meta.singleSearchFilterId
					);
				}
				for (var item in this.meta.items)
				{
					headers += App.ElementLibrary.GridColumnHeader.html(
						undefined != this.meta.defaults
							? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
							: this.meta.items[item]
					);
					if (this.meta.filterId)
					{
						filters += App.ElementLibrary.GridColumnFilter.html(
							undefined != this.meta.defaults
								? $.extend(true, {}, this.meta.defaults, this.meta.items[item])
								: this.meta.items[item]
						);
					}
				}
				if (this.meta.singleSearchBarId)
				{
					$('#' + tid + '_' + this.meta.singleSearchBarId).html(singleSearch);
				}

				$('#' + tid + '_' + this.headerId).html(headers);
				if (this.meta.filterId)
				{
					$('#' + tid + '_' + this.filterId).html(filters);
				}
				if (undefined == App.ElementLibrary[this.meta.constructor])
				{
					return;
				}
				if (App.ElementLibrary[this.meta.constructor].bind)
				{
					if (this.meta.singleSearchBarId)
					{
						App.ElementLibrary.GridSingleSearch.bind(this.meta.singleSearchFilterId);
					}
					for (var item in this.meta.items)
					{
						App.ElementLibrary.GridColumnHeader.bind(this.meta.items[item]);
						if (this.meta.filterId)
						{
							App.ElementLibrary.GridColumnFilter.bind(this.meta.items[item]);
						}
					}
				}
			};

			this.publish = function (tid)
			{
				if (!this.meta.constructor)
				{
					return;
				}
				if (this.meta.singleSearchBarId)
				{
					App.ElementLibrary.GridSingleSearch.bind(this.meta.singleSearchFilterId);
				}
				for (var item in this.meta.items)
				{
					App.ElementLibrary.GridColumnHeader.bind(this.meta.items[item]);
					if (this.meta.filterId)
					{
						App.ElementLibrary.GridColumnFilter.bind(this.meta.items[item]);
					}
				}
			};

			this.harvest = function (tid)
			{
				return null;
			};
		},

		Button: function (id)
		{
			this.id = id;
			this.meta = {};

			this.hydrate = function (template, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.Button.html(this.meta, value);
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.Button.html(this.meta, value);
				$('#' + tid + '_' + this.id).html(html);
				if (this.meta)
				{
					App.ElementLibrary.Button.bind(this.meta);
				}
			};

			this.publish = function (tid)
			{
				if (this.meta)
				{
					value = '';
					if (this.meta && this.meta.value)
					{
						value = this.meta.value;
					}
					App.ElementLibrary.Button.bind(this.meta);
				}
			};

			this.harvest = function (tid)
			{
				return null;
			};
		},

		GridPager: function (id)
		{
			this.id = id;
			this.meta = {};

			this.hydrate = function (template, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.GridPager.html(this.meta, value);
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.GridPager.html(this.meta, value);
				$('#' + tid + '_' + this.id).html(html);
				if (this.meta)
				{
					App.ElementLibrary.GridPager.bind(this.meta);
				}
			};

			this.publish = function (tid)
			{
				if (this.meta)
				{
					value = '';
					if (this.meta && this.meta.value)
					{
						value = this.meta.value;
					}
					App.ElementLibrary.GridPager.bind(this.meta);
				}
			};

			this.harvest = function (tid)
			{
				return null;
			};
		},

		GridPageSize: function (id)
		{
			this.id = id;
			this.meta = {};

			this.hydrate = function (template, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.GridPageSize.html(this.meta, value);
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.GridPageSize.html(this.meta, value);
				$('#' + tid + '_' + this.id).html(html);
				if (this.meta)
				{
					App.ElementLibrary.GridPageSize.bind(this.meta);
				}
			};

			this.publish = function (tid)
			{
				if (this.meta)
				{
					value = '';
					if (this.meta && this.meta.value)
					{
						value = this.meta.value;
					}
					App.ElementLibrary.GridPageSize.bind(this.meta);
				}
			};

			this.harvest = function (tid)
			{
				return null;
			};
		},

		GridRecords: function (id)
		{
			this.id = id;
			this.meta = {};

			this.hydrate = function (template, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.GridRecords.html(this.meta, value);
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.GridRecords.html(this.meta, value);
				$('#' + tid + '_' + this.id).html(html);

			};

			this.publish = function (tid)
			{
				return;
			};

			this.harvest = function (tid)
			{
				return null;
			};
		},

		FieldComponent: function (id)
		{
			this.id = id;
			this.meta = {};

			this.hydrate = function (template, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.Field.html(this.meta, value);
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.Field.html(this.meta, value);
				$('#' + tid + '_' + this.id).html(html);
				if (this.meta)
				{
					App.ElementLibrary.Field.setValue(tid, this.meta, value);
					App.ElementLibrary.Field.bind(tid, this.meta);
				}
			};

			this.publish = function (tid)
			{
				if (this.meta)
				{
					value = '';
					if (this.meta && this.meta.value)
					{
						value = this.meta.value;
					}
					App.ElementLibrary.Field.setValue(tid, this.meta, value);
					App.ElementLibrary.Field.bind(tid, this.meta);
				}
			};

			this.harvest = function (tid)
			{
				return App.ElementLibrary.Field.harvest(tid, this.meta);
			};
		},

		GroupComponent: function (id)
		{
			this.id = id;
			this.meta = {};

			this.hydrate = function (template, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.Field.html(this.meta, value);
				return template.replace('[' + this.id + ']', html);
			};

			this.hydrateLive = function (tid, value)
			{
				this.meta = value;
				value = '';
				if (this.meta && this.meta.value)
				{
					value = this.meta.value;
				}
				var html = App.ElementLibrary.Field.html(this.meta, value);
				$('#' + tid + '_' + this.id).html(html);
				if (this.meta)
				{
					App.ElementLibrary.Field.setValue(tid, this.meta, value);
					App.ElementLibrary.Field.bind(tid, this.meta);
				}
			};

			this.publish = function (tid)
			{
				if (this.meta)
				{
					value = '';
					if (this.meta && this.meta.value)
					{
						value = this.meta.value;
					}
					App.ElementLibrary.Field.setValue(tid, this.meta, value);
					App.ElementLibrary.Field.bind(tid, this.meta);
				}
			};

			this.harvest = function (tid)
			{
				return App.ElementLibrary.Field.harvest(tid, this.meta);
			};
		}


	};
})();
