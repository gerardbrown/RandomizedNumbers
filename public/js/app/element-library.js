;
(function ()
{

	_App.ElementLibrary = function ()
	{
		this.initialize();
	};

	_App.ElementLibrary.prototype =
	{

		initialize: function ()
		{
			// Nothing to do.
		},

		ImageLoader: function (uri, size)
		{
			var id1 = Math.floor((Math.random() * 99999) + 1);
			var id2 = Math.floor((Math.random() * 9999) + 1)
			var imgId = 'img_' + id1.toString() + id2.toString();
			var html = '<div id="' + imgId + '" class="image-loader ' + size + ' image-load-container"></div>';

			var js = $.proxy(function (imgId, uri)
			{
				$('#' + imgId).addClass('is-loading');
				var img = new Image();
				$('#' + imgId).html(img);

				img.onload = $.proxy(function (imgId, img, elem)
				{
					$('#' + imgId).removeClass('is-loading');
					$('#' + imgId).addClass('is-loaded');
				}, this, imgId, img);

				img.onerror = $.proxy(function (imgId, img, elem)
				{
					$('#' + imgId).addClass('is-broken');

				}, this, imgId, img);

				img.src = uri;
			}, this, imgId, uri);
			return {'html': html, init: js};

		},

		Button: {
			html: function (meta)
			{
				if (null == meta)
				{
					return '';
				}
				var preset = undefined != meta.btnPreset
					? meta.btnPreset
					: 'Default';
				var btnType = undefined != meta.btnType
					? meta.btnType
					: 'button';
				var disabledclass = (undefined != meta.permission && false == meta.permission)
				                    || (undefined != meta.disabled && true == meta.disabled)
					? 'disabled'
					: '';
				var eid = meta.id
					? ' id="' + meta.id + '"'
					: '';
				var href = undefined != meta.href
					? ' href="' + meta.href + '"'
					: '';
				var style = undefined != meta.btnStyle
					? meta.btnStyle
					: 'btn-default';
				var icon = undefined != meta.icon
					? App.Theme.Icon.Glyphicon
					           .replaceAll('[eid]', '')
					           .replaceAll('[name]', meta.icon)
					           .replaceAll('[style]', '')
					: '';
				return App.Theme.Button[preset]
					.replaceAll('[type]', btnType)
					.replaceAll('[eid]', eid)
					.replaceAll('[href]', href)
					.replaceAll('[style]', style)
					.replaceAll('[disabled]', disabledclass)
					.replaceAll('[icon]', icon)
					.replaceAll('[label]', meta.label);
			},
			bind: function (meta)
			{
				if (null == meta)
				{
					return;
				}
				if (meta.bind)
				{
					meta['bind'](meta);
				}

				if (meta.actionContext)
				{
					$("#" + meta.id).unbind('click');
					$("#" + meta.id).click($.proxy(function (meta)
					{
						if (meta.onClick)
						{
							meta.onClick();
						}
						this.actionContext = meta.actionContext;
						if (true != meta.noSubmit)
						{
							$('#' + meta.actionForm).submit();
						}
					}, meta.proxy, meta));
				}
				else if (meta.onClick)
				{
					$("#" + meta.id).unbind('click');
					if (meta.proxy)
					{
						$("#" + meta.id).click($.proxy(meta.onClick, meta.proxy));
					}
					else
					{
						$("#" + meta.id).click(meta.onClick);
					}
				}
			}
		},

		InlineNotification: {
			html: function (meta, value)
			{
				if (null == meta)
				{
					return '';
				}

				return App.Theme.Display.InlineNotification
					.replaceAll('[message]', value);
			},
			bind: function (meta)
			{
				if (null == meta)
				{
					return;
				}
				if (meta.bind)
				{
					meta['bind'](meta);
				}
			}
		},

		SimpleDataTable: {
			html: function (meta)
			{
				if (null == meta)
				{
					return '&nbsp;';
				}
				var tableStyles = meta.tableStyles
					? meta.tableStyles
					: 'table-striped table-bordered table-condensed table-responsive';
				var html = '<table class="table ' + tableStyles + '">';
				var i = 0;
				for (var item in meta)
				{
					i++;
					if (1 == i)
					{
						// Headers
						html += '<thead><tr>';
						for (var cell in meta[item])
						{
							html += '<td><b>' + meta[item][cell] + '</b></td>';
						}
						html += '</tr><thead><tbody>';
					}
					else
					{
						// Row data
						html += '<tr>';
						for (var cell in meta[item])
						{
							html += '<td>' + meta[item][cell] + '</td>';
						}
						html += '</tr>';
					}
				}
				if (1 < meta.length)
				{
					html += '</tbody>';
				}
				html += '</table>';
				return html;
			},
			bind: function (meta)
			{
				return;
			}
		},

		DataTable: {
			build: function (containerId, meta)
			{
				if (null == meta)
				{
					return '&nbsp;';
				}
				var eid = meta.id
					? meta.id
					: '';
				var html = '<table id="' + eid + '" class="table table-striped table-bordered table-condensed">';
				if (meta.headers)
				{
					for (var item in meta.headers)
					{
						// Headers
						html += '<thead><tr>';
						for (var cell in meta.headers[item])
						{
							html += '<td><b>' + meta.headers[item][cell] + '</b></td>';
						}
						html += '</tr><thead><tbody>';
					}
				}
				for (var item in meta.data)
				{
					// Row data
					var rowId = meta.data[item].id;
					delete meta.data[item].id;
					html += '<tr data-id="' + rowId + '">';
					for (var cell in meta.data[item])
					{
						html += '<td>' + meta.data[item][cell] + '</td>';
					}
					html += '</tr>';
				}
				if (1 < meta.length)
				{
					html += '</tbody>';
				}
				html += '</table>';
				$('#' + containerId).html(html);
				return;
			},
			addRow: function (tableId, row, onClick)
			{
				var rowId = row.id;
				delete row.id;
				html = '<tr data-id="' + rowId + '">';
				for (var cell in row)
				{
					html += '<td>' + row[cell] + '</td>';
				}
				html += '</tr>';
				$('#' + tableId + ' tbody').append(html);
				if (onClick)
				{
					$('#' + tableId + ' [data-id="' + rowId + ']').click(onClick);
				}
			},
			addCollapsableRow: function (tableId, row, secData, colspan, tid, onClick)
			{
				var rowId = row.id;
				delete row.id;
				html = '<tr data-id="' + rowId + '" class="handy">';
				for (var cell in row.data)
				{
					html += '<td>' + row.data[cell] + '</td>';
				}
				html += '</tr>';

				html += '<tr data-id="' + rowId + '_col" data-mode="hidden" class="ghost"><td colspan="' + colspan + '" class="ddu-item-container"><form class="form form-horizontal"><div class="ddu-item-container-div" id="' + rowId + '_secContainer"></div></form><div>&nbsp;</div></td></tr>';

				$('#' + tableId + ' tbody').append(html);

				for (i in secData)
				{
					var html = '';

					switch (secData[i].type)
					{
						case 'formItem':
							html = secData[i].html;
							$('#' + rowId + '_secContainer').append(html);
							App.ElementLibrary.Field.bind(tid, secData[i].meta);
							break;
						default:
							html = secData[i].html;
							$('#' + rowId + '_secContainer').append(html);
							break;
					}
				}

				$('#' + tableId + ' [data-id="' + rowId + '"]').click($.proxy(function ()
				{
					var tg = $('#' + tableId + ' [data-id="' + rowId + '_col"]');
					if ('hidden' == $(tg).attr('data-mode'))
					{
						$(tg).show(150);
						$(tg).attr('data-mode', 'shown');
					}
					else
					{
						$(tg).hide(150);
						$(tg).attr('data-mode', 'hidden');
					}
				}, this, rowId));

			},
			updateRow: function (tableId, row)
			{
				var rowId = row.id;
				delete row.id;
				var html = '';
				for (var cell in row)
				{
					html += '<td>' + row[cell] + '</td>';
				}
				html += '</tr>';
				$('#' + tableId + ' tbody tr[data-id="' + rowId + '"]').html(html);
			},
			removeRow: function (tableId, rowId)
			{
				$('#' + tableId + ' tbody tr[data-id="' + rowId + '"]').remove();
			}
		},

		GridContextFilter: {
			html: function (meta)
			{
				if (null == meta)
				{
					return '<div class="">&nbsp;</div>';
				}
				var disabled = (undefined != meta.permission && false == meta.permission)
				               || (undefined != meta.disabled && true == meta.disabled)
					? ' disabled'
					: '';

				if (meta.actions)
				{
					var preset = undefined != meta.btnPreset
						? meta.btnPreset
						: 'Default';
					var btnType = undefined != meta.btnType
						? meta.btnType
						: 'button';
					var eid = meta.id
						? ' id="' + meta.id + '"'
						: '';
					var href = undefined != meta.href
						? ' href="' + meta.href + '"'
						: '';
					var style = undefined != meta.btnStyle
						? meta.btnStyle
						: 'btn-default';
					var searchIcon = undefined != meta.icon
						? App.Theme.Icon.Glyphicon
						                 .replaceAll('[eid]', '')
						                 .replaceAll('[name]', 'search')
						                 .replaceAll('[style]', '')
						: '';
					var clearIcon = undefined != meta.icon
						? App.Theme.Icon.Glyphicon
						                .replaceAll('[eid]', '')
						                .replaceAll('[name]', 'remove-circle')
						                .replaceAll('[style]', '')
						: '';
					var html = '</div><div class="row"><div class="col-xs-12"><div class="pull-right pad-5">';
					html += App.Theme.Button[preset]
						.replaceAll('[type]', btnType)
						.replaceAll('[eid]', ' id="' + meta.clearId + '"')
						.replaceAll('[href]', href)
						.replaceAll('[style]', style + ' ' + App.Theme.Grid.defaults.resetButtonStyle)
						.replaceAll('[disabled]', disabled)
						.replaceAll('[icon]', clearIcon)
						.replaceAll('[label]', 'Clear search');
					html += App.Theme.Button[preset]
						.replaceAll('[type]', btnType)
						.replaceAll('[eid]', ' id="' + meta.searchId + '"')
						.replaceAll('[href]', href)
						.replaceAll('[style]', style + ' ' + App.Theme.Grid.defaults.searchButtonStyle)
						.replaceAll('[disabled]', disabled)
						.replaceAll('[icon]', searchIcon)
						.replaceAll('[label]', 'Search');
					html += '</div></div>';
					return html;
				}
				else
				{
					var eid = meta.id
						? meta.id
						: Math.floor((Math.random() * 100000) + 1);
					var labelSpan = undefined != meta.contextLabelSpan
						? meta.contextLabelSpan
						: App.Theme.Grid.defaults.contextLabelSpan;
					var labelStyle = undefined != meta.contextLabelStyle
						? meta.contextLabelStyle
						: App.Theme.Grid.defaults.contextLabelStyle;
					var inputSpan = undefined != meta.contextInputSpan
						? meta.contextInputSpan
						: App.Theme.Grid.defaults.contextInputSpan;
					var inputWrapperStyle = undefined != meta.contextInputWrapperStyle
						? meta.contextInputWrapperStyle
						: App.Theme.Grid.defaults.contextInputWrapperStyle;
					var inputStyle = undefined != meta.contextInputStyle
						? meta.contextInputStyle
						: App.Theme.Grid.defaults.contextInputStyle;
					var placeholder = undefined != meta.placeholder
						? meta.placeholder
						: '';
					var attrib = undefined != meta.contextAttrib
						? ' ' + meta.contextAttrib
						: '';
					var value = meta.value
						? meta.value
						: '';
					var inputType = meta.inputType
						? meta.inputType
						: 'text';
					var max = meta.maxlength
						? ' maxlength="' + meta.maxlength + '"'
						: '';
					labelStyle += ' context-filter-label';
					inputWrapperStyle += ' filter-input';
					if (meta.context)
					{
						inputStyle += ' ' + meta.context;
					}
					if (meta.readonly)
					{
						attrib += ' readonly';
					}
					if (meta.maxlength)
					{
						attrib += ' maxlength="' + meta.maxlength + '"';
					}
					var html = '<div class="' + App.Theme.Grid.defaults.contextDivSpan + '">';
					if ('date' == inputType)
					{
						attrib += ' data-date-format="' + App.DataStruct.dateFormat + '"';
						inputStyle = inputStyle + ' datepicker';
						html += App.Theme.Field.InputWithAppend
							.replaceAll('[type]', 'text')
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[placeholder]', placeholder)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', value)
							.replaceAll('[append]', '<span class="text-sm"><span class="glyphicon glyphicon-calendar"></span></span>')
							.replaceAll('[disabled]', disabled);
					}
					else if (meta.dataSource)
					{
						if (meta.dataList)
						{
							App.DataStore.setData(meta.dataSource, meta.dataList);
						}
						else if (meta.dataQuery)
						{
							if (!App.DataStore.noSelectQuery || undefined == App.DataStore.noSelectQuery)
							{

								App.DataStore.loadSelectListData(
									meta.dataSource,
									meta.dataQuery.isStatic,
									meta.dataQuery.workspace,
									meta.dataQuery.task,
									meta.dataQuery.jobId,
									meta.dataQuery.data,
									meta.dataQuery.options,
									meta.dataQuery.callback
								);
							}
						}
						if (!meta.options)
						{
							meta.options = [];
						}
						if (!meta.selected)
						{
							meta.selected = '';
						}
						attrib += (meta.label)
							? ' title="' + meta.label + '"'
							: '';
						var selectMe = '';
						var options = '';
						for (var i = 0; i < meta.options.length; i++)
						{
							selectMe = (meta.options[i].value == meta.selected) ? ' selected' : '';
							options += (App.Theme.Field.SelectOption
								.replaceAll('[value]', meta.options[i].value)
								.replaceAll('[label]', meta.options[i].label)
								.replaceAll('[selected]', selectMe));
						}
						html += App.Theme.Field.Select
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[placeholder]', placeholder)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[disabled]', disabled)
							.replaceAll('[options]', options);
					}
					else
					{
						html += App.Theme.Field.Input
							.replaceAll('[type]', inputType)
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[placeholder]', placeholder)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', value)
							.replaceAll('[disabled]', disabled);
					}
					html += '</div>';
					return html;
				}
			},
			bind: function (meta)
			{
				if (meta && meta.actions)
				{
					$("#" + meta.clearId).click(meta.bindClear);
					$("#" + meta.searchId).click(meta.bindSearch);
				}
				else
				{
					if (null != meta && meta['bind'])
					{
						meta['bind'](meta);
					}
					if (meta.inputType && 'date' == meta.inputType)
					{
						var opt = meta.dtopt ? meta.dtopt : {};
						opt.autoclose = true;
						$('#' + meta.id).datepicker(opt);
					}
					if (null != meta && meta.dataSource)
					{
						App.DataStore.listen(
							meta.id, meta.dataSource,
							$.proxy(App.ElementLibrary.BuildSelectOptions, this, null, meta),
							'Recurring'
						);
					}
				}
			}
		},

		GridSingleSearch: {
			html: function (items, filterId)
			{
				var itemCount = 0;
				var formId = filterId + 'SsForm';
				_w.singleSearchMap[filterId] = [];
				for (var item in items)
				{
					itemCount++;
					if (items[item].field)
					{
						_w.singleSearchMap[filterId].push(items[item].field);
					}
				}
				var meta = {};
				var inputSpan = undefined != meta.columnInputSpan
					? meta.columnInputSpan
					: App.Theme.Grid.defaults.columnInputSpan;
				var inputWrapperStyle = undefined != meta.columnInputWrapperStyle
					? meta.columnInputWrapperStyle
					: App.Theme.Grid.defaults.columnInputWrapperStyle;
				var inputStyle = undefined != meta.columnInputStyle
					? meta.columnInputStyle
					: App.Theme.Grid.defaults.columnInputStyle;
				var placeholder = undefined != meta.placeholder
					? meta.placeholder
					: 'Search';
				var attrib = undefined != meta.columnAttrib
					? ' ' + meta.columnAttrib
					: '';
				var value = meta.value
					? meta.value
					: '';
				var disabled = (undefined != meta.permission && false == meta.permission)
				               || (undefined != meta.disabled && true == meta.disabled)
					? 'disabled'
					: '';
				inputStyle += 'input-sm';
				var filter = App.Theme.Field.InputNoLabel
					.replaceAll('[type]', 'text')
					.replaceAll('[eid]', filterId)
					.replaceAll('[inputSpan]', inputSpan)
					.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
					.replaceAll('[inputStyle]', inputStyle)
					.replaceAll('[placeholder]', placeholder)
					.replaceAll('[attrib]', attrib)
					.replaceAll('[value]', value)
					.replaceAll('[disabled]', disabled);
				var html = App.Theme.Grid.SingleSearchWrapper
					.replaceAll('[itemCount]', itemCount)
					.replaceAll('[formId]', formId)
					.replaceAll('[filter]', filter);
				return html;
			},
			bind: function (filterId)
			{
				/*if (null != meta && meta.on)
				 {
				 meta['bind'](meta);
				 }*/
			}
		},
		gridCounter: 0,

		GridColumnHeader: {
			html: function (meta)
			{
				if (null == meta)
				{
					return '<th>&nbsp;</th>';
				}
				if (undefined != meta.permission && false == meta.permission)
				{
					return '';
				}
				var headerStyle = meta.headerStyle
					? meta.headerStyle
					: '';
				var orderDesc = meta.orderDesc
					? App.Theme.Icon.Glyphicon
					                .replaceAll('[eid]', ' id="' + meta.orderDesc.id + '"')
					                .replaceAll('[name]', 'circle-arrow-up')
					                .replaceAll('[style]', ' order-desc')
					: '';
				var orderAsc = meta.orderAsc
					? App.Theme.Icon.Glyphicon
					               .replaceAll('[eid]', ' id="' + meta.orderAsc.id + '"')
					               .replaceAll('[name]', 'circle-arrow-down')
					               .replaceAll('[style]', ' order-asc')
					: '';
				var label = meta.label;
				/*if ('Actions' == meta.id)
				 {
				 var eid = 'gridTitleAction' + App.ElementLibrary.gridCounter;
				 label = '<span id="' + eid + '" class="grid-column-controller"></span>';
				 }
				 else
				 {
				 headerStyle += ' data-column';
				 }*/
				var html = App.Theme.Grid.ColumnHeader
					.replaceAll('[headerStyle]', headerStyle + ' ' + meta.id)
					.replaceAll('[item]', meta.id)
					.replaceAll('[label]', label)
					.replaceAll('[order]', orderDesc + orderAsc);
				return html;
			},
			bind: function (meta)
			{
				if (meta && meta.orderAsc)
				{
					$("#" + meta.orderAsc.id).click(meta.orderAsc.bind);
				}
				if (meta && meta.orderDesc)
				{
					$("#" + meta.orderDesc.id).click(meta.orderDesc.bind);
				}
			}
		},

		GridColumnFilter: {
			html: function (meta)
			{
				if (null == meta || !meta.filterId)
				{
					var html = App.Theme.Grid.ColumnFilterWrapper
						.replaceAll('[filter]', '&nbsp;');
					return html;
				}

				var eid = meta.filterId;
				var inputSpan = undefined != meta.columnInputSpan
					? meta.columnInputSpan
					: App.Theme.Grid.defaults.columnInputSpan;
				var inputWrapperStyle = undefined != meta.columnInputWrapperStyle
					? meta.columnInputWrapperStyle
					: App.Theme.Grid.defaults.columnInputWrapperStyle;
				var inputStyle = undefined != meta.columnInputStyle
					? meta.columnInputStyle
					: App.Theme.Grid.defaults.columnInputStyle;
				var placeholder = undefined != meta.placeholder
					? meta.placeholder
					: '';
				var attrib = undefined != meta.columnAttrib
					? ' ' + meta.columnAttrib
					: '';
				var value = meta.value
					? meta.value
					: '';
				var disabled = (undefined != meta.permission && false == meta.permission)
				               || (undefined != meta.disabled && true == meta.disabled)
					? 'disabled'
					: '';
				inputStyle += 'input-sm';
				if (meta.context)
				{
					inputStyle += ' ' + meta.context;
				}

				if (meta.dataSource)
				{
					if (meta.dataList)
					{
						App.DataStore.setData(meta.dataSource, meta.dataList);
					}
					else if (meta.dataQuery)
					{
						if (!App.DataStore.noSelectQuery || undefined == App.DataStore.noSelectQuery)
						{

							App.DataStore.loadSelectListData(
								meta.dataSource,
								meta.dataQuery.isStatic,
								meta.dataQuery.workspace,
								meta.dataQuery.task,
								meta.dataQuery.jobId,
								meta.dataQuery.data,
								meta.dataQuery.options,
								meta.dataQuery.callback
							);
						}


					}
					if (!meta.options)
					{
						meta.options = [];
					}
					if (!meta.selected)
					{
						meta.selected = '';
					}
					attrib += (meta.label)
						? ' title="' + meta.label + '"'
						: '';
					var selectMe = '';
					var options = '';
					for (var i = 0; i < meta.options.length; i++)
					{
						selectMe = (meta.options[i].value == meta.selected) ? ' selected' : '';
						options += (App.Theme.Field.SelectOption
							.replaceAll('[value]', meta.options[i].value)
							.replaceAll('[label]', meta.options[i].label)
							.replaceAll('[selected]', selectMe));
					}
					var filter = App.Theme.Field.SelectNoLabel
						.replaceAll('[eid]', eid)
						.replaceAll('[inputSpan]', inputSpan)
						.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
						.replaceAll('[inputStyle]', inputStyle)
						.replaceAll('[placeholder]', placeholder)
						.replaceAll('[attrib]', attrib)
						.replaceAll('[disabled]', disabled)
						.replaceAll('[options]', options);
					var html = App.Theme.Grid.ColumnFilterWrapper
						.replaceAll('[filter]', filter);
					return html;
				}
				else
				{
					var inputType = meta.inputType
						? meta.inputType
						: 'text';
					var max = meta.maxlength
						? ' maxlength="' + meta.maxlength + '"'
						: '';
					if (meta.maxlength)
					{
						attrib += ' maxlength="' + meta.maxlength + '"';
					}
					var filter = App.Theme.Field.InputNoLabel
						.replaceAll('[type]', inputType)
						.replaceAll('[eid]', eid)
						.replaceAll('[inputSpan]', inputSpan)
						.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
						.replaceAll('[inputStyle]', inputStyle)
						.replaceAll('[placeholder]', placeholder)
						.replaceAll('[attrib]', attrib)
						.replaceAll('[value]', value)
						.replaceAll('[disabled]', disabled);
					var html = App.Theme.Grid.ColumnFilterWrapper
						.replaceAll('[filter]', filter);
					return html;
				}
			},
			bind: function (meta)
			{
				if (null != meta && meta.on)
				{
					meta['bind'](meta);
				}
				if (null != meta && meta.dataSource)
				{
					App.DataStore.listen(
						meta.filterId, meta.dataSource,
						$.proxy(App.ElementLibrary.BuildSelectOptions, this, null, meta),
						'Recurring'
					);
				}
			}
		},

		GridDataRow: {
			html: function (meta, isGroupingRow, groupValue)
			{
				if (null == meta)
				{
					return '<tr><td></td></tr>';
				}
				id = meta.items.id;
				if (isNaN(id))
				{
					var ident = [];
					for (var field in id)
					{
						ident.push(field + '=' + id[field]);
					}
					var identifier = ident.join('&');
				}
				else
				{
					var identifier = 'id=' + id;
				}
				var cells = '';
				var editableRow = meta.editable && meta.editable.canEditRow(id, meta.items)
				                  && (undefined == meta.editable.permissions
				                      || true == meta.editable.permissions);
				if (isGroupingRow)
				{
					var rowIdPrepend = meta.rowIdPrepend
						? meta.rowIdPrepend
						: '';
					var rowId = meta.rowId
						? 'id="group_row' + rowIdPrepend + meta.rowId + '"'
						: '';
					var columnCount = 0;
					for (var item in meta.items)
					{
						columnCount++;
					}

					var cellStyle = '';
					var cellAttrib = ' colspan="' + columnCount + '"';
					var cellPrepend = '';
					var cellAppend = '';
					cells += App.Theme.Grid.DataCell
						.replaceAll('[cellStyle]', cellStyle + ' grid-group-cell')
						.replaceAll('[cellAttrib]', cellAttrib)
						.replaceAll('[prepend]', cellPrepend)
						.replaceAll('[value]', groupValue)
						.replaceAll('[append]', cellAppend);
				}
				else
				{
					var rowIdPrepend = meta.rowIdPrepend
						? meta.rowIdPrepend
						: '';
					var rowId = meta.rowId
						? 'id="row' + rowIdPrepend + meta.rowId + '"'
						: '';
					for (var item in meta.items)
					{
						if ('id' == item)
						{
							continue;
						}
						if (meta.items[item]
						    && undefined != meta.items[item].permission
						    && false == meta.items[item].permission)
						{
							continue;
						}
						var cellStyle = meta.cellStyle && meta.cellStyle[item]
							? meta.cellStyle[item]
							: '';
						var cellAttrib = meta.cellAttrib && meta.cellAttrib[item]
							? meta.cellAttrib[item]
							: '';
						var cellPrepend = meta.cellPrepend && meta.cellPrepend[item]
							? '<span class="grid-column-prepend">' + meta.cellPrepend[item] + '</span>'
							: '';
						var cellAppend = meta.cellAppend && meta.cellAppend[item]
							? '<span class="grid-column-append">' + meta.cellAppend[item] + '</span>'
							: '';
						var value = meta.items && meta.items[item]
							? meta.items[item]
							: '&nbsp;';
						if (undefined != meta.columnPermission
						    && undefined != meta.columnPermission[item]
						    && false == meta.columnPermission[item])
						{
							continue;
						}
						if (editableRow && meta.editable.items[item])
						{
							var dataType = meta.editable.items[item].dataType
								? meta.editable.items[item].dataType
								: 'text';
							var dataTile = meta.editable.items[item].dataTile
								? meta.editable.items[item].dataTile
								: 'Edit Value';
							if ('checkbox' == dataType)
							{
								var libElement = true === value
									? 'CheckValueEditableTrue'
									: 'CheckValueEditableFalse';
								value = App.Theme.Grid[libElement]
									.replaceAll('[rowId]', meta.rowId)
									.replaceAll('[dataField]', item);
							}
							else
							{
								value = App.Theme.Field.Editable
									.replaceAll('[eid]', item + '_' + meta.rowId)
									.replaceAll('[dataType]', dataType)
									.replaceAll('[pid]', meta.rowId)
									.replaceAll('[dataTile]', dataTile)
									.replaceAll('[value]', value);
							}
							if (('select' == dataType || 'select2' == dataType || 'checklist' == dataType)
							    && meta.editable.items[item].dataList)
							{
								var source = meta.editable.items[item].dataSource;
								if (!_w.runningSelects)
								{
									_w.runningSelects = {};
								}
								if (!_w.runningSelects[source])
								{
									_w.runningSelects[source] = true;
									setTimeout($.proxy(function (source)
									{
										delete _w.runningSelects[source];
									}, this, source), 1000);
									App.DataStore.setData(
										meta.editable.items[item].dataSource,
										meta.editable.items[item].dataList
									);
								}
							}
							if (('select' == dataType || 'select2' == dataType || 'checklist' == dataType)
							    && meta.editable.items[item].dataQuery)
							{
								var source = meta.editable.items[item].dataSource;
								if (!_w.runningSelects)
								{
									_w.runningSelects = {};
								}
								if (!_w.runningSelects[source])
								{
									_w.runningSelects[source] = true;
									setTimeout($.proxy(function (source)
									{
										delete _w.runningSelects[source];
									}, this, source), 1000);
									var query = meta.editable.items[item].dataQuery;
									App.DataStore.loadSelectListData(
										source,
										query.isStatic,
										query.workspace,
										query.task,
										null,
										{},
										{},
										null
									);
								}
							}
						}
						cells += App.Theme.Grid.DataCell
							.replaceAll('[cellStyle]', cellStyle + ' ' + item)
							.replaceAll('[cellAttrib]', cellAttrib)
							.replaceAll('[prepend]', cellPrepend)
							.replaceAll('[value]', value)
							.replaceAll('[append]', cellAppend);
					}
				}
				var rowStyle = meta.rowStyle
					? meta.rowStyle
					: '';
				var rowAttrib = meta.rowAttrib
					? meta.rowAttrib
					: '';

				if (!isGroupingRow && groupValue)
				{
					rowAttrib += ' data-group-value="' + groupValue + '"';
				}
				if (isGroupingRow)
				{
					rowStyle += ' grid-group-row';
				}
				if (meta.url)
				{
					rowAttrib += ' onClick="window.location=\'#/' + meta.url + '?' + identifier + '\';"';
					rowStyle += ' handy';
				}
				var html = App.Theme.Grid.DataRow
					.replaceAll('[rowId]', rowId)
					.replaceAll('[rowStyle]', rowStyle)
					.replaceAll('[cells]', cells)
					.replaceAll('[rowAttrib]', rowAttrib);
				return html;
			},
			bind: function (meta, isGroupingRow, groupValue)
			{
				var rowIdPrepend = meta.rowIdPrepend
					? meta.rowIdPrepend
					: '';
				if (null != meta && meta['bind'])
				{
					meta['bind'](meta);
				}

				if (null != meta && meta.rowClick && !isGroupingRow)
				{
					$('#row' + rowIdPrepend + meta.rowId).unbind('click');
					$('#row' + rowIdPrepend + meta.rowId).click($.proxy(meta.rowClick, this, meta.items));
				}

				if (null != meta && isGroupingRow)
				{
					$('#group_row' + rowIdPrepend + meta.rowId).attr('data-visible', 1);
					$('#group_row' + rowIdPrepend + meta.rowId).unbind('click');
					$('#group_row' + rowIdPrepend + meta.rowId).click($.proxy(function (groupRowId, groupValue)
					{
						if (1 != $(groupRowId).attr('data-visible'))
						{
							$('[data-group-value=' + groupValue + ']').show();
							$(groupRowId).attr('data-visible', 1);
						}
						else
						{
							$('[data-group-value=' + groupValue + ']').hide();
							$(groupRowId).attr('data-visible', 0);
						}
					}, this, '#group_row' + rowIdPrepend + meta.rowId, groupValue));
				}

				if (meta.editable)
				{
					for (var item in meta.editable.items)
					{
						if (meta.editable.items[item].dataSource)
						{
							// Select List
							App.DataStore.listen(
								item + '_' + meta.rowId,
								meta.editable.items[item].dataSource,
								$.proxy(function (meta, item, dataId, data)
								{
									var dataList = [];
									for (var si in data)
									{
										dataList.push({value: data[si].value, text: data[si].label});
									}
									var value = $('#' + item + '_' + meta.rowId).html();
									if (meta.editable.items[item].multiple)
									{
										var currValue = [];
										var values = undefined != value
											? value.split(', ')
											: [];
										for (var i in values)
										{
											for (var si in data)
											{
												if (values[i] == data[si].label)
												{
													currValue.push(data[si].value);
												}
											}
										}
									}
									else
									{
										var currValue = '';
										for (var i in values)
										{
											for (var si in data)
											{
												if (values[i] == data[si].label)
												{
													currValue = data[si].value;
												}
											}
										}
									}
									var select2 = meta.editable.items[item].select2
										? meta.editable.items[item].select2
										: {};
									$('#' + item + '_' + meta.rowId).editable({
										onblur: 'ignore',
										showbuttons: false,
										source: dataList,
										value: currValue,
										select2: select2,
										success: $.proxy(function (meta, field, response, value)
										{
											$.proxy(_w.updateGridRowField, meta.editable.context)(
												meta.editable, meta.rowId, meta.editable.items[field].field, value
											);
										}, this, meta, item),
										validate: $.proxy(_w.validateInlineEdit, this, item + '_' + meta.rowId, meta.editable.items[item])
									});
								}, this, meta, item)
							);
						}
						else
						{
							if ('checkbox' == meta.editable.items[item].dataType)
							{
								$('#row' + meta.rowIdPrepend + meta.rowId + ' .editable-check').unbind('click');
								$('#row' + meta.rowIdPrepend + meta.rowId + ' .editable-check').click($.proxy(function (meta,
								                                                                                        evt)
								{
									var field = $(evt.currentTarget).attr('data-field');
									var value = 1 == $(evt.currentTarget).attr('data-value')
										? false
										: true;
									if (value)
									{
										$(evt.currentTarget).removeClass('glyphicon-remove').removeClass('red');
										$(evt.currentTarget).addClass('glyphicon-ok').addClass('green');
										$(evt.currentTarget).attr('data-value', '1');
									}
									else
									{
										$(evt.currentTarget).removeClass('glyphicon-ok').removeClass('green');
										$(evt.currentTarget).addClass('glyphicon-remove').addClass('red');
										$(evt.currentTarget).attr('data-value', '0');
									}
									$.proxy(_w.updateGridRowField, meta.editable.context)(
										meta.editable, meta.rowId, meta.editable.items[field].field, value
									);
								}, this, meta));
							}
							else
							{
								// Text element
								$('#' + item + '_' + meta.rowId).editable({
									//mode: 'inline',
									showbuttons: false,
									success: $.proxy(function (meta, field, response, value)
									{
										$.proxy(_w.updateGridRowField, meta.editable.context)(
											meta.editable, meta.rowId, meta.editable.items[field].field, value
										);
									}, this, meta, item),
									validate: $.proxy(_w.validateInlineEdit, this, item + '_' + meta.rowId, meta.editable.items[item])
								});

								$('#' + item + '_' + meta.rowId).on('hidden', $.proxy(function (meta, e, reason)
								{
									$('#' + item + '_' + meta.rowId).parent().find('span.grid-column-prepend, span.grid-column-append').show();
								}, this, meta));
								$('#' + item + '_' + meta.rowId).on('shown', $.proxy(function (meta, e, editable)
								{
									$('#' + item + '_' + meta.rowId).parent().find('span.grid-column-prepend, span.grid-column-append').hide();

								}, this, meta));


								var mask = meta.editable.items[item].mask;

								if (mask)
								{
									$('#' + item + '_' + meta.rowId).on('shown', $.proxy(function (mask, e, editable)
									{
										editable.input.$input.attr('id', item + '_' + meta.rowId + '_xedt');
										editable.input.$input.attr('name', item + '_' + meta.rowId + '_xedt');
										editable.input.$input.mask(mask);
									}, this, mask));
								}
							}
						}
					}
				}
			}
		},

		GridPager: {
			html: function (meta)
			{
				if (null == meta)
				{
					return '&nbsp;';
				}
				var startPage = parseInt(meta.CurrentPage, 10) - 4;
				var endPage = parseInt(meta.CurrentPage, 10) + 4;

				if (startPage < 1)
				{
					startPage = 1;
					endPage = 9 - startPage;
				}
				if (endPage > meta.TotalPages)
				{
					endPage = meta.TotalPages;
					startPage = endPage - 9;
				}
				if (startPage < 1)
				{
					startPage = 1;
				}
				if (8 >= parseInt(meta.CurrentPage))
				{
					var stepDown = 1;
				}
				else
				{
					var stepDown = parseInt(meta.CurrentPage) - 8;
				}
				if ((parseInt(meta.TotalPages) - 8) <= parseInt(meta.CurrentPage))
				{
					var stepUp = meta.TotalPages;
				}
				else
				{
					var stepUp = parseInt(meta.CurrentPage) + 8;
				}

				var eid = meta.id;
				var itemStyle = undefined != meta.pagerItemStyle
					? meta.pagerItemStyle
					: '';
				var wrapperStyle = undefined != meta.pagerWrapperStyle
					? meta.pagerWrapperStyle
					: '';
				var items = '';
				for (var i = startPage; i <= endPage; i++)
				{
					if (i == meta.CurrentPage)
					{
						items += App.Theme.Grid.PagerActiveItem
							.replaceAll('[pageNumber]', i)
							.replaceAll('[eid]', eid)
							.replaceAll('[itemStyle]', itemStyle);
					}
					else
					{
						items += App.Theme.Grid.PagerItem
							.replaceAll('[pageNumber]', i)
							.replaceAll('[eid]', eid)
							.replaceAll('[itemStyle]', itemStyle);
					}
				}
				var html = App.Theme.Grid.Pager
					.replaceAll('[wrapperStyle]', wrapperStyle)
					.replaceAll('[eid]', eid)
					.replaceAll('[itemStyle]', itemStyle)
					.replaceAll('[items]', items)
					.replaceAll('[stepDown]', stepDown)
					.replaceAll('[stepUp]', stepUp)
					.replaceAll('[maxPage]', meta.TotalPages);
				return html;
			},
			bind: function (meta)
			{
				if (meta && meta.bind)
				{
					$('.' + meta.id).click($.proxy(function (meta, evt)
					{
						$('.' + meta.id).parent().parent().find('li.active').removeClass('active');
						$(evt.currentTarget).parent().addClass('active');
						meta['bind']($(evt.currentTarget).attr('data-page'));
					}, this, meta));
				}
				$(".pagination." + meta.id).rPage();
			}
		},

		GridPageSize: {
			html: function (meta)
			{
				if (null == meta || undefined == meta.RecordsPerPage)
				{
					return '&nbsp;';
				}
				var recs = meta.RecordsPerPage;

				var html = App.Theme.Grid.PageSizeSelector
					.replaceAll('[recordsPerPage]', recs)
					.replaceAll('[eid]', meta.id);
				return html;
			},
			bind: function (meta)
			{
				if (meta.allowLarge)
				{
					$('#' + meta.id + 'Options li[data-size="500"]').removeClass('ghost');
				}
				if (meta && meta.bind)
				{
					$('#' + meta.id + 'Options li').click(function ()
					{
						meta['bind']($(this).attr('data-size'));
					});
				}
			}
		},

		GridRecords: {
			html: function (meta)
			{
				if (null == meta || undefined == meta.TotalRecords)
				{
					return '&nbsp;';
				}

				var recordStart = 0;
				var recordEnd = 0;

				if (0 != meta.TotalRecords)
				{
					recordStart = parseInt(meta.RecordsPerPage, 10) * parseInt(meta.CurrentPage, 10) - 9;
					recordEnd = parseInt(meta.RecordsPerPage, 10) * parseInt(meta.CurrentPage, 10);

					if (parseInt(meta.TotalRecords, 10) < parseInt(meta.RecordsPerPage, 10))
					{
						recordEnd = parseInt(meta.TotalRecords, 10);
					}
				}

				var html = App.Theme.Grid.PageRecords
					.replaceAll('[resultsStart]', recordStart)
					.replaceAll('[resultsEnd]', recordEnd)
					.replaceAll('[totalResults]', meta.TotalRecords);

				return html;
			}
		},


		BuildSelectOptions: function (tid, meta, dataId, options)
		{
			if ('Published' != App.Template.state)
			{
				return;
			}
			var elemId = meta.filterId
				? meta.filterId
				: meta.id;
			App.DataStore.setItem('BuildSelect:' + elemId, true);
			var selected = $('#' + elemId).val();
			if (!selected)
			{
				if (meta.value)
				{
					if (meta.multiple)
					{
						selected = [];
						var selectMulti = {};
						for (var ii = 0; ii < meta.value.length; ii++)
						{
							selected.push(meta.value[ii].toString());
							selectMulti['x' + meta.value[ii]] = true;
						}
					}
					else
					{
						selected = meta.value;
					}
				}
				else
				{
					selected = '';
				}
			}
			else if (meta.multiple)
			{
				selected = [];
				var selectMulti = {};
				for (var ii = 0; ii < meta.value.length; ii++)
				{

					if (undefined == meta.value[ii]['id'])
					{
						selected.push(meta.value[ii].toString());
						selectMulti['x' + meta.value[ii]] = true;
					}
					else
					{
						selected.push(meta.value[ii]['id'].toString());
						selectMulti['x' + meta.value[ii]['id']] = true;
					}
				}
			}
			var opts = '';
			if (meta.selectEmpty)
			{
				opts += (App.Theme.Field.SelectOption
					.replaceAll('[value]', '')
					.replaceAll('[label]', meta.selectEmpty)
					.replaceAll('[selected]', ''));
			}
			var doSelect = '';

			/*
			 * Set label & value alias for bind from grids
			 */
			var labelAlias = undefined != meta.labelField ? meta.labelField : 'label';
			var valueAlias = undefined != meta.valueField ? meta.valueField : 'value';
			for (var i = 0; i < options.length; i++)
			{
				if (meta.multiple)
				{
					var val = options[i].value;
					doSelect = (selectMulti['x' + val])
						? 'selected'
						: '';
				}
				else
				{
					if (undefined != options[i])
					{
						doSelect = (options[i].value == selected)
							? 'selected'
							: '';
					}
					else
					{
						doSelect = '';
					}
				}

				if (undefined != options[i])
				{
					opts += (App.Theme.Field.SelectOption
						.replaceAll('[value]', options[i][valueAlias])
						.replaceAll('[label]', options[i][labelAlias])
						.replaceAll('[selected]', doSelect));
				}

			}
			$('#' + elemId).html(opts);
			/*$('#' + elemId).selectpicker('refresh');
			 if (!meta.multiple)
			 {
			 $('#' + elemId).selectpicker('val', selected);
			 }*/
			$('#' + elemId).select2('updateResults', true);
			$('#' + elemId).select2('val', selected);

			/*
			 * Fire onChange internal event
			 */
			setTimeout($.proxy(function (elemId)
			{
				$('#' + elemId).change();
				setTimeout($.proxy(function (elemId)
				{
					App.DataStore.removeItem('BuildSelect:' + elemId);
				}, this, elemId), 100);
			}, this, elemId), 100);

		},

		BuildCheckGroupHtml: function (meta, options)
		{
			if ('Published' != App.Template.state)
			{
				return '';
			}
			var items = {};
			if (undefined != meta.data)
			{
				for (var i = 0; i < meta.data.length; i++)
				{
					items['i' + meta.data[i]] = true;
				}
			}
			var sectionMax = options.length;
			var sectionClass = 'col-md-12';
			var sectionSpans = ['', 'col-md-12', 'col-md-6', 'col-md-4', 'col-md-3'];
			if (meta.split)
			{
				if (4 < meta.split)
				{
					delete meta.split;
				}
				else
				{
					sectionMax = Math.ceil(options.length / meta.split);
					sectionClass = sectionSpans[meta.split];
				}
			}

			var html = '<div class="' + sectionClass + '">';

			var disabled = (undefined != meta.permission && false == meta.permission)
			               || (undefined != meta.disabled && true == meta.disabled)
				? 'disabled'
				: '';
			var labelStyle = undefined != meta.labelStyle
				? meta.labelStyle
				: App.Theme.Field.defaults.labelStyle;
			var inputSpan = undefined != meta.inputSpan
				? meta.inputSpan
				: App.Theme.Field.defaults.inputSpan;
			var inputWrapperStyle = undefined != meta.inputWrapperStyle
				? meta.inputWrapperStyle
				: App.Theme.Field.defaults.inputWrapperStyle;
			var inputStyle = undefined != meta.inputStyle
				? meta.inputStyle
				: App.Theme.Field.defaults.inputStyle;
			inputStyle += ' ' + meta.itemName;
			var r = 0;
			for (var i = 0; i < options.length; i++)
			{
				if (r == sectionMax)
				{
					html += '</div>';
					html += '<div class="' + sectionClass + '">';
					r = 0;
				}
				var itemId = options[i].value;
				var label = options[i].label;
				var checked = items['i' + itemId]
					? 'checked'
					: '';
				var chkItem = App.Theme.Field.Checkbox
					.replaceAll('[eid]', meta.itemName + itemId + 'Check')
					.replaceAll('[labelStyle]', labelStyle)
					.replaceAll('[label]', label)
					.replaceAll('[inputStyle]', inputStyle)
					.replaceAll('[value]', '')
					.replaceAll('[checked]', checked)
					.replaceAll('[attrib]', 'data-id="' + itemId + '"')
					.replaceAll('[disabled]', disabled);
				html += chkItem;
				r++;
			}
			html += '</div>';
			if ((meta.split && 4 == meta.split))
			{
				html += '</div>';
			}
			return html;
		},

		BuildCheckGroup: function (tid, meta, dataId, options)
		{
			if ('Published' != App.Template.state)
			{
				return;
			}
			var elem = $('#' + meta.id);
			if (!elem)
			{
				return;
			}
			$('#' + meta.id).empty();
			var html = App.ElementLibrary.BuildCheckGroupHtml(meta, options);

			$('#' + tid + '_' + meta.id).html(html);
			for (var i = 0; i < options.length; i++)
			{
				App.Util.updateCheckboxStyle($('#' + meta.itemName + options[i].value + 'Check'));
			}
		},

		Field: {
			html: function (meta, value)
			{
				if (null == meta)
				{
					return '&nbsp;';
				}
				var eid = meta.id
					? meta.id
					: Math.floor((Math.random() * 100000) + 1);
				var labelSpan = undefined != meta.labelSpan
					? meta.labelSpan
					: App.Theme.Field.defaults.labelSpan;
				var labelStyle = undefined != meta.labelStyle
					? meta.labelStyle
					: App.Theme.Field.defaults.labelStyle;
				var inputSpan = undefined != meta.inputSpan
					? meta.inputSpan
					: App.Theme.Field.defaults.inputSpan;
				var inputWrapperStyle = undefined != meta.inputWrapperStyle
					? meta.inputWrapperStyle
					: App.Theme.Field.defaults.inputWrapperStyle;
				var inputStyle = undefined != meta.inputStyle
					? meta.inputStyle
					: App.Theme.Field.defaults.inputStyle;
				var placeholder = undefined != meta.placeholder
					? meta.placeholder
					: '';
				var attrib = undefined != meta.inputAttrib
					? ' ' + meta.inputAttrib
					: '';
				var disabled = '';
				if (undefined != meta.disabled)
				{
					if ('function' == typeof(meta.disabled))
					{
						if ('checkbox' == meta.type)
						{
							disabled = meta.disabled(meta.checked ? true : false)
								? ' disabled'
								: '';
						}
						else
						{
							disabled = meta.disabled(meta.value ? true : false)
								? ' disabled'
								: '';
						}
					}
					else
					{
						disabled = meta.disabled
							? ' disabled'
							: '';
					}
				}
				switch (meta.type)
				{
					case 'input':
						var themeElem = meta.noLabel
							? 'InputNoLabel'
							: 'Input';
						if (meta.themeElement)
						{
							themeElem = meta.themeElement;
						}
						var inputType = meta.inputType
							? meta.inputType
							: 'text';
						if ('password' == inputType)
						{
							inputStyle += ' strength';
						}
						var max = meta.maxlength
							? ' maxlength="' + meta.maxlength + '"'
							: '';
						if (meta.maxlength)
						{
							attrib = attrib + ' maxlength="' + meta.maxlength + '"';
						}
						if (meta.dataType && 'tags' == meta.dataType)
						{
							attrib += ' data-role="tagsinput"';
						}
						var html = App.Theme.Field[themeElem]
							.replaceAll('[type]', inputType)
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[placeholder]', placeholder)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', '')
							.replaceAll('[prepend]', meta.prepend ? meta.prepend : '')
							.replaceAll('[append]', meta.append ? meta.append : '')
							.replaceAll('[disabled]', disabled);
						return html;
						break;
					case 'date':
						attrib = attrib + ' data-date-format="' + App.DataStruct.dateFormat + '"';
						inputStyle = inputStyle + ' datepicker';
						var html = App.Theme.Field.InputWithAppend
							.replaceAll('[type]', 'text')
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[placeholder]', placeholder)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', '')
							.replaceAll('[append]', '<span class="glyphicon glyphicon-calendar"></span>')
							.replaceAll('[disabled]', disabled);
						return html;
						break;
					case 'mobile':
						var prepend = undefined != meta.inputAppend
							? meta.inputAppend
							: App.DataStruct.mobileUnit;
						var html = App.Theme.Field.InputWithAppend
							.replaceAll('[type]', 'text')
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[placeholder]', placeholder)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', '')
							.replaceAll('[append]', prepend)
							.replaceAll('[disabled]', disabled);
						return html;
						break;
					case 'amount':
						var prepend = undefined != meta.inputPrepend
							? meta.inputPrepend
							: App.DataStruct.currencyUnit;
						var html = App.Theme.Field.InputWithPrepend
							.replaceAll('[type]', 'number')
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[placeholder]', placeholder)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', '')
							.replaceAll('[disabled]', disabled)
							.replaceAll('[prepend]', prepend);
						return html;
						break;
					case 'percentage':
						var append = undefined != meta.inputAppend
							? meta.inputAppend
							: '%';
						var html = App.Theme.Field.InputWithAppend
							.replaceAll('[type]', 'number')
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[placeholder]', placeholder)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', '')
							.replaceAll('[disabled]', disabled)
							.replaceAll('[append]', append);
						return html;
						break;
					case 'checkbox':
						var value = meta.value
							? meta.value
							: meta.id;
						var checked = meta.checked
							? 'checked'
							: '';
						var checkElement = meta.inline
							? 'Checkbox'
							: 'FormCheckbox';
						var html = App.Theme.Field[checkElement]
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[value]', value)
							.replaceAll('[checked]', checked)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[disabled]', disabled);
						return html;
						break;
					case 'checkGroup':
						var options = App.DataStore.dataStore[meta.dataSource]
							? App.DataStore.dataStore[meta.dataSource]
							: {};
						var html = App.ElementLibrary.BuildCheckGroupHtml(meta, options);
						return html;
						break;
					case 'select':
						if (meta.dataSource)
						{
							if (meta.dataList)
							{
								App.DataStore.setData(meta.dataSource, meta.dataList);
							}
							else if (meta.dataQuery)
							{
								if (!App.DataStore.noSelectQuery || undefined == App.DataStore.noSelectQuery)
								{

									App.DataStore.loadSelectListData(
										meta.dataSource,
										meta.dataQuery.isStatic,
										meta.dataQuery.workspace,
										meta.dataQuery.task,
										meta.dataQuery.jobId,
										meta.dataQuery.data,
										meta.dataQuery.options,
										meta.dataQuery.callback
									);
								}
							}
						}
						if (!meta.options)
						{
							meta.options = [];
						}
						if (!meta.value)
						{
							meta.value = !meta.multiple
								? ''
								: [];
						}
						if (meta.multiple)
						{
							attrib += ' multiple';
						}
						attrib += meta.title
							? ' data-placeholder="' + meta.title + '"'
							: ((meta.label && !meta.selectEmpty)
							? ' data-placeholder="' + meta.label + '"'
							: '');
						var options = '';
						if (meta.selectEmpty)
						{
							options += (App.Theme.Field.SelectOption
								.replaceAll('[value]', '')
								.replaceAll('[label]', meta.selectEmpty)
								.replaceAll('[selected]', ''));
						}
						for (var i = 0; i < meta.options.length; i++)
						{
							options += (App.Theme.Field.SelectOption
								.replaceAll('[value]', meta.options[i].value)
								.replaceAll('[label]', meta.options[i].label)
								.replaceAll('[selected]', ''));
						}
						if (meta.label)
						{
							var themeElem = undefined != meta.options.query
								? 'Select2Div'
								: 'Select2';
							var html = App.Theme.Field[themeElem]
								.replaceAll('[eid]', eid)
								.replaceAll('[labelSpan]', labelSpan)
								.replaceAll('[labelStyle]', labelStyle)
								.replaceAll('[label]', meta.label)
								.replaceAll('[inputSpan]', inputSpan)
								.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
								.replaceAll('[inputStyle]', inputStyle)
								.replaceAll('[placeholder]', placeholder)
								.replaceAll('[attrib]', attrib)
								.replaceAll('[disabled]', disabled)
								.replaceAll('[options]', options);
						}
						else
						{
							var themeElem = undefined != meta.options.query
								? 'Select2NoLabelDiv'
								: 'Select2NoLabel';
							var html = App.Theme.Field[themeElem]
								.replaceAll('[eid]', eid)
								.replaceAll('[inputSpan]', inputSpan)
								.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
								.replaceAll('[inputStyle]', inputStyle)
								.replaceAll('[placeholder]', placeholder)
								.replaceAll('[attrib]', attrib)
								.replaceAll('[disabled]', disabled)
								.replaceAll('[options]', options);
						}
						return html;
						break;
					case 'selectX':
						if (meta.dataSource)
						{
							if (meta.dataList)
							{
								App.DataStore.setData(meta.dataSource, meta.dataList);
							}
							else if (meta.dataQuery)
							{
								if (!App.DataStore.noSelectQuery || undefined == App.DataStore.noSelectQuery)
								{

									App.DataStore.loadSelectListData(
										meta.dataSource,
										meta.dataQuery.isStatic,
										meta.dataQuery.workspace,
										meta.dataQuery.task,
										meta.dataQuery.jobId,
										meta.dataQuery.data,
										meta.dataQuery.options,
										meta.dataQuery.callback
									);
								}
							}
						}
						if (!meta.options)
						{
							meta.options = [];
						}
						if (!meta.value)
						{
							meta.value = !meta.multiple
								? ''
								: [];
						}
						if (meta.multiple)
						{
							attrib += ' multiple';
						}
						attrib += meta.title
							? ' title="' + meta.title + '"'
							: ((meta.label && !meta.selectEmpty)
							? ' title="' + meta.label + '"'
							: '');
						var options = '';
						if (meta.selectEmpty)
						{
							options += (App.Theme.Field.SelectOption
								.replaceAll('[value]', '')
								.replaceAll('[label]', meta.selectEmpty)
								.replaceAll('[selected]', ''));
						}
						for (var i = 0; i < meta.options.length; i++)
						{
							options += (App.Theme.Field.SelectOption
								.replaceAll('[value]', meta.options[i].value)
								.replaceAll('[label]', meta.options[i].label)
								.replaceAll('[selected]', ''));
						}
						if (meta.label)
						{
							var html = App.Theme.Field.Select
								.replaceAll('[eid]', eid)
								.replaceAll('[labelSpan]', labelSpan)
								.replaceAll('[labelStyle]', labelStyle)
								.replaceAll('[label]', meta.label)
								.replaceAll('[inputSpan]', inputSpan)
								.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
								.replaceAll('[inputStyle]', inputStyle)
								.replaceAll('[placeholder]', placeholder)
								.replaceAll('[attrib]', attrib)
								.replaceAll('[disabled]', disabled)
								.replaceAll('[options]', options);
						}
						else
						{
							var html = App.Theme.Field.SelectNoLabel
								.replaceAll('[eid]', eid)
								.replaceAll('[inputSpan]', inputSpan)
								.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
								.replaceAll('[inputStyle]', inputStyle)
								.replaceAll('[placeholder]', placeholder)
								.replaceAll('[attrib]', attrib)
								.replaceAll('[disabled]', disabled)
								.replaceAll('[options]', options);
						}
						return html;
						break;
					case 'textarea':
						var rows = meta.rows
							? meta.rows
							: 3;
						var html = App.Theme.Field.TextArea
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[rows]', rows)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', '')
							.replaceAll('[disabled]', disabled);
						return html;
						break;
					case 'htmltext':
						var html = App.Theme.Field.HtmlTextArea
							.replaceAll('[eid]', eid)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[label]', meta.label)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', '')
							.replaceAll('[disabled]', disabled);
						return html;
						break;
					case 'image':
						var did = undefined != meta.downloadButtonId
							? meta.downloadButtonId
							: 'btnDownload' + eid;
						var uid = undefined != meta.uploadButtonId
							? meta.downloadButtonId
							: 'btnUpload' + eid;
						var html = App.Theme.Field.Image
							.replaceAll('[eid]', eid)
							.replaceAll('[did]', did)
							.replaceAll('[uid]', uid)
							.replaceAll('[type]', 'text')
							.replaceAll('[label]', meta.label)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[placeholder]', placeholder)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', '')
							.replaceAll('[disabled]', disabled);
						return html;
						break;
					case 'video':
						var videoStyle = meta.videoStyle
							? meta.videoStyle
							: '';
						var html = App.Theme.Field.Video
							.replaceAll('[eid]', eid)
							.replaceAll('[value]', '')
							.replaceAll('[defaultImage]', meta.baseImage)
							.replaceAll('[videoStyle]', videoStyle);
						return html;
						break;
					case 'audio':
						var audioStyle = meta.audioStyle
							? meta.audioStyle
							: '';
						var html = App.Theme.Field.Audio
							.replaceAll('[eid]', eid)
							.replaceAll('[value]', '')
							.replaceAll('[defaultImage]', meta.baseImage)
							.replaceAll('[audioStyle]', audioStyle);
						return html;
						break;
					case 'attachment':
						var imageStyle = undefined != meta.imageStyle
							? meta.imageStyle
							: '';
						var iconSpan = undefined != meta.iconSpan
							? meta.iconSpan
							: 'col-md-3';
						var labelSpan = undefined != meta.labelSpan
							? meta.labelSpan
							: 'col-md-7';
						var html = App.Theme.Field.Attachment
							.replaceAll('[eid]', eid)
							.replaceAll('[value]', '')
							.replaceAll('[label]', meta.label)
							.replaceAll('[iconSpan]', meta.iconSpan)
							.replaceAll('[labelSpan]', meta.labelSpan)
							.replaceAll('[defaultImage]', meta.baseImage)
							.replaceAll('[imageStyle]', imageStyle);
						return html;
						break;
					case 'document':
						var did = undefined != meta.downloadButtonId
							? meta.downloadButtonId
							: 'btnDownload' + eid;
						var uid = undefined != meta.uploadButtonId
							? meta.downloadButtonId
							: 'btnUpload' + eid;
						var html = App.Theme.Field.Document
							.replaceAll('[eid]', eid)
							.replaceAll('[did]', did)
							.replaceAll('[uid]', uid)
							.replaceAll('[type]', 'text')
							.replaceAll('[label]', meta.label)
							.replaceAll('[labelSpan]', labelSpan)
							.replaceAll('[labelStyle]', labelStyle)
							.replaceAll('[inputSpan]', inputSpan)
							.replaceAll('[inputStyle]', inputStyle)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle)
							.replaceAll('[placeholder]', placeholder)
							.replaceAll('[attrib]', attrib)
							.replaceAll('[value]', '')
							.replaceAll('[disabled]', disabled);
						return html;
						break;
					case 'collector':
						var html = App.Theme.Field.Collector
							.replaceAll('[eid]', eid)
							.replaceAll('[inputWrapperStyle]', inputWrapperStyle);
						return html;
						break;
				}
				return '';
			},
			setValue: function (tid, meta, value)
			{
				if ('' == value)
				{
					return;
				}
				switch (meta.type)
				{
					case 'select':
						$('#' + meta.id).select2('val', value);
						//$('#' + meta.id).selectpicker('val', value);
						break;
					case 'checkbox':
						$('#' + meta.id).prop('checked', value);
						break;
					case 'checkGroup':
					case 'image':
						var did = undefined != meta.downloadButtonId
							? meta.downloadButtonId
							: 'btnDownload' + meta.id;
						var uid = undefined != meta.uploadButtonId
							? meta.downloadButtonId
							: 'btnUpload' + meta.id;
						var docId = value.id
							? value.id
							: value;
						$('#' + meta.id).addClass('valid');
						$('#progress_' + meta.id + ' .progress-bar').css(
							'width',
							'0%'
						);
						$('#' + did).attr('data-download', '/image?id=' + docId);
						$('#' + did).prop('disabled', false);
						$('#' + did).show();
						$('#' + meta.id).val(value.filename ? value.filename : 'Uploaded File');
						$('#fileid_' + meta.id).val(docId);
						$('#img_' + meta.id).attr('src', '/thumbnail?id=' + docId);
						$('#img_' + meta.id).attr('data-large', '/image?id=' + docId);
						break;
					case 'video':
						$('#vid_' + meta.id).attr('src', 'http://www.youtube.com/embed/' + value);
						$('#vidcon_' + meta.id).show();
						$('#img_' + meta.id).hide();
						$('#' + meta.id).val(value);
						if ($('#vid_' + meta.id).hasClass('error'))
						{
							$('#vid_' + meta.id).removeClass('error');
							$('#vid_' + meta.id).addClass('valid');
						}
						break;
					case 'audio':
						var parts = value.filename.split('.');
						$('#jquery_jplayer_' + meta.id).jPlayer({
							ready: $.proxy(function (meta, value)
							{
								var parts = value.filename.split('.');
								var mediaOptions = {};
								mediaOptions[parts[1]] = '/audio/' + value.filename;
								$('#jquery_jplayer_' + meta.id)
									.jPlayer("setMedia", mediaOptions)
									.jPlayer("stop");
							}, this, meta, value),
							ended: function (event)
							{
								$(this).jPlayer("play");
							},
							cssSelectorAncestor: '#jp_interface_' + meta.id,
							swfPath: "js",
							supplied: parts[1]
						});
						$('#audcon_' + meta.id).show();
						$('#img_' + meta.id).hide();
						$('#' + meta.id).val(value.id);
						break;
					case 'attachment':
					case 'document':
						var did = undefined != meta.downloadButtonId
							? meta.downloadButtonId
							: 'btnDownload' + meta.id;
						var uid = undefined != meta.uploadButtonId
							? meta.downloadButtonId
							: 'btnUpload' + meta.id;
						var docId = value.id
							? value.id
							: value;
						$('#' + meta.id).addClass('valid');
						$('#progress_' + meta.id + ' .progress-bar').css(
							'width',
							'0%'
						);
						$('#' + did).attr('data-download', '/document?id=' + docId);
						$('#' + did).prop('disabled', false);
						$('#' + did).show();
						$('#' + meta.id).val(value.filename ? value.filename : 'Uploaded File');
						$('#fileid_' + meta.id).val(docId);
						break;
					case 'mobile':
						if (value && '0' == value.substring(0, 1))
						{
							value = value.substring(1);
						}
						if (value && '+' == value.substring(0, 1))
						{
							value = value.substring(1);
						}
						$('#' + meta.id).val(value);
						break;
					case 'collector':
						break;
					case 'htmltext':
						$('#' + meta.id + ' .note-editable').html(value);
						break;
					default:
						if (meta.rules && meta.rules.number && !meta.rules.digits)
						{
							value = '' + value;
							value = "." == value.substring(0, 1) ? '0' + value : value;
						}

						$('#' + meta.id).val(value);
						break;
				}
			},
			harvest: function (tid, meta)
			{
				if (null == meta)
				{
					return null;
				}
				switch (meta.type)
				{
					case 'collector':
						return null;
						break;
					case 'select':
						return $('#' + meta.id).select2('val');
						//return $('#' + meta.id).val();
						break;
					case 'checkGroup':
						var items = [];
						$.each($.find('.' + meta.itemName), function (i, input)
						{
							if ($(input).prop('checked'))
							{
								items.push({
									'id': $(input).attr('data-id')
								});
							}
						});
						return items;
						break;
					case 'amount':
						var val = $('#' + meta.id).val();
						return !isNaN(val)
							? parseFloat(val)
							: null;
						break;
					case 'percentage':
						var val = $('#' + meta.id).val();
						return !isNaN(val)
							? parseFloat(val)
							: null;
						break;
					case 'checkbox':
						return $('#' + meta.id).prop('checked');
						break;
					case 'mobile':
						value = $('#' + meta.id).val();
						if (value && '0' == value.substring(0, 1))
						{
							value = value.substring(1);
						}
						if (value && '+' == value.substring(0, 1))
						{
							value = value.substring(1);
						}
						return '+' + value;
						break;
					case 'htmltext':
						return $('#' + meta.id + ' .note-editable').html();
						break;
					case 'date':
						var value = $('#' + meta.id).val();
						return '' != value
							? value
							: null;
						break;
					case 'image':
					case 'document':
					case 'attachment':
						var val = $('#fileid_' + meta.id).val();
						return !isNaN(val)
							? parseFloat(val)
							: null;
						break;
					default:
						if (meta.rules && meta.rules.number && !meta.rules.digits)
						{
							var val = $('#' + meta.id).val();
							return !isNaN(val)
								? parseFloat(val)
								: null;
						}
						if (meta.rules && meta.rules.digits)
						{
							var val = $('#' + meta.id).val();
							return !isNaN(val)
								? parseInt(val)
								: null;
						}
						return $('#' + meta.id).val();
						break;
				}
			},
			bind: function (tid, meta)
			{
				if (meta.mask)
				{
					$('#' + meta.id).mask(meta.mask);
					$('#' + meta.id).focus(function ()
					{
						$('#' + meta.id).setCursorPosition(0);
					});
				}
				if ('input' == meta.type && meta.inputType && 'password' == meta.inputType)
				{
					if (undefined == meta.strength || false != meta.strength)
					{
						var defaults = {
							showMeter: true,
							toggleMask: true
						};
						var options = meta.strength
							? $.extend(true, {}, defaults, meta.strength)
							: defaults;
						$('#' + meta.id).strength(options);
					}
				}
				if ('input' == meta.type && meta.dataType && 'tags' == meta.dataType)
				{
					var defaults = {
						allowDuplicates: false
					};
					var options = meta.tagOptions
						? $.extend(true, {}, defaults, meta.tagOptions)
						: defaults;
					$('#' + meta.id).tagsinput(options);
				}
				if ('select' == meta.type)
				{
					var defaults = {
						allowClear: true,
						closeOnSelect: false,
						width: "parent",
						placeholder: meta.title
							? meta.title
							: ((meta.label && !meta.selectEmpty)
							? meta.label
							: 'Select')
					};
					var options = meta.options
						? $.extend(true, {}, defaults, meta.options)
						: defaults;
					try
					{
						$('#' + meta.id).select2(options);
					}
					catch (e)
					{
					}
				}
				if ('htmltext' == meta.type)
				{
					var options = $.extend(true, {}, {
						toolbar: [
							['style', ['style']],
							['style', ['bold', 'italic', 'underline', 'clear']],
							['font', ['strike']],
							['fontsize', ['fontsize']],
							['color', ['color']],
							['para', ['ul', 'ol', 'paragraph']],
							['height', ['height']],
							['insert', ['link']],
							['table', ['table']]
							//['help', ['help']]
						]
					}, meta.options ? meta.options : {});
					$('#' + meta.id).summernote(options);
				}
				if ('document' == meta.type || 'attachment' == meta.type)
				{

					var did = undefined != meta.downloadButtonId
						? meta.downloadButtonId
						: 'btnDownload' + meta.id;
					var uid = undefined != meta.uploadButtonId
						? meta.downloadButtonId
						: 'btnUpload' + meta.id;
					$('#' + uid).click(function ()
					{
						$('#btn_' + meta.id).click();
					});
					$('#' + did).click(function ()
					{
						if (undefined != $(this).attr('data-download'))
						{
							var parts = $(this).attr('data-download').split('?');
							var parms = parts[1] && '' != parts[1]
								? parts[1].split('&')
								: {};
							var data = {};
							for (var i in parms)
							{
								var param = parms[i].split('=');
								data[param[0]] = param[1];
							}
							App.Ajax.DOWNLOAD({
								url: parts[0],
								data: data
							});
						}
					});
					$('#btn_' + meta.id).fileupload({
						dataType: 'json',
						dropZone: $('#' + meta.id),
						add: function (e, data)
						{
							_w.jqXHR[meta.id] = data.submit();
						},
						send: $.proxy(function (meta, e, data)
						{
							if (!meta.fileTypes)
							{
								return true;
							}
							for (var i in data.files)
							{
								var allGood = false;
								var file = data.files[i].name;
								for (var x in meta.fileTypes)
								{
									if (meta.fileTypes[x] == file.substr(file.lastIndexOf('.') + 1))
									{
										allGood = true;
										$('#' + meta.id).val(file);
									}
								}
								if (!allGood)
								{
									return false;
								}
							}
							return true;
						}, this, meta),
						start: $.proxy(function (meta)
						{
							$('#' + meta.id).removeClass('valid');
							$('#' + meta.id).removeClass('required');
							$('#' + meta.id).removeClass('error');
							$('#progress_' + meta.id).show();
							$('#progress_' + meta.id + ' .progress-bar').css(
								'width',
								'0%'
							);
						}, this, meta),
						progress: $.proxy(function (meta, e, data)
						{
							var progress = parseInt(data.loaded / data.total * 100, 10);
							$('#progress_' + meta.id + ' .progress-bar').css(
								'width',
								progress + '%'
							);
						}, this, meta),
						fail: function (e, data)
						{
							delete _w.jqXHR[meta.id];
							$('#' + meta.id).removeClass('valid');
							$('#' + meta.id).removeClass('required');
							$('#container_' + meta.id)
								.find("label[for=" + meta.id + "].error")
								.remove();
							$('#' + meta.id).addClass('error');

							$('#progress_' + meta.id).hide();
							$('#progress_' + meta.id + ' .progress-bar').css(
								'width',
								'0%'
							);
							$('#fileid_' + meta.id).val('');
							$('#' + meta.id).val('');
							$('#' + did).prop('disabled', true);
							$('#' + did).hide();
							alert('Could not upload document.');
						},
						done: function (e, data)
						{
							delete _w.jqXHR[meta.id];
							$('#progress_' + meta.id).hide();
							if (undefined == data.result)
							{
								var req = {};
								req.name = data.files[0].name;
								App.Ajax.JSON({
										"name": 'FileUpload.GetResponse',
										"url": 'workspace/get-upload-result',
										"data": req
									},
									$.proxy(function (meta, response)
									{
										$.each(response.Data, function (i, file)
										{
											if (file.error)
											{
												$('#' + meta.id).removeClass('valid');
												$('#' + meta.id).removeClass('required');
												$('#container_' + meta.id)
													.find("label[for=" + meta.id + "].error")
													.remove();
												$('#' + meta.id).addClass('error');

												$('#progress_' + meta.id + ' .progress-bar').css(
													'width',
													'0%'
												);
												$('#fileid_' + meta.id).val('');
												$('#' + meta.id).val('');
												$('#' + did).prop('disabled', true);
												$('#' + did).hide();
												return;
											}
											$('#' + meta.id).removeClass('error');
											$('#' + meta.id).removeClass('required');
											$('#container_' + meta.id)
												.find("label[for=" + meta.id + "].error")
												.remove();
											$('#' + meta.id).addClass('valid');
											$('#progress_' + meta.id + ' .progress-bar').css(
												'width',
												'0%'
											);
											$('#fileid_' + meta.id).val(file.id);
											$('#' + meta.id).val(file.name);
											$('#' + did).attr('data-download', '/document?id=' + file.id);
											$('#' + did).prop('disabled', false);
											$('#' + did).show();

											if (meta.afterSuccess)
											{
												meta.afterSuccess(file.id, file.name);
											}
										});
									}, this, meta),
									function (response)
									{
										//console.log('File upload data retrieval error');
										//console.log(response);
									}
								);
								return;
							}
							$.each(data.result, function (i, file)
							{
								if (file.error)
								{
									$('#' + meta.id).removeClass('valid');
									$('#' + meta.id).removeClass('required');
									$('#container_' + meta.id)
										.find("label[for=" + meta.id + "].error")
										.remove();
									$('#' + meta.id).addClass('error');

									$('#progress_' + meta.id + ' .progress-bar').css(
										'width',
										'0%'
									);
									$('#fileid_' + meta.id).val('');
									$('#' + meta.id).val('');
									$('#' + did).prop('disabled', true);
									$('#' + did).hide();
									return;
								}
								$('#' + meta.id).removeClass('error');
								$('#' + meta.id).removeClass('required');
								$('#container_' + meta.id)
									.find("label[for=" + meta.id + "].error")
									.remove();
								$('#' + meta.id).addClass('valid');
								$('#progress_' + meta.id + ' .progress-bar').css(
									'width',
									'0%'
								);
								$('#fileid_' + meta.id).val(file.id);
								$('#' + meta.id).val(file.name);
								$('#' + did).attr('data-download', '/document?id=' + file.id);
								$('#' + did).prop('disabled', false);
								$('#' + did).show();

								if (meta.afterSuccess)
								{
									meta.afterSuccess(file.id, file.name);
								}
							});
						}
					});
				}
				if ('video' == meta.type)
				{
					$('#' + meta.id).change($.proxy(function (meta)
					{
						$('#vid_' + meta.id).attr('src', 'http://www.youtube.com/embed/' + $('#' + meta.id).val());
						$('#vidcon_' + meta.id).show();
						$('#img_' + meta.id).hide();
					}, this, meta));
				}
				if ('image' == meta.type)
				{
					var did = undefined != meta.downloadButtonId
						? meta.downloadButtonId
						: 'btnDownload' + meta.id;
					var uid = undefined != meta.uploadButtonId
						? meta.downloadButtonId
						: 'btnUpload' + meta.id;
					$('#' + uid).click(function ()
					{
						$('#btn_' + meta.id).click();
					});
					$('#' + did).click(function ()
					{
						if (undefined != $(this).attr('data-download'))
						{
							var parts = $(this).attr('data-download').split('?');
							var parms = parts[1] && '' != parts[1]
								? parts[1].split('&')
								: {};
							var data = {};
							for (var i in parms)
							{
								var param = parms[i].split('=');
								data[param[0]] = param[1];
							}
							App.Ajax.DOWNLOAD({
								url: parts[0],
								data: data
							});
						}
					});
					$('#btn_' + meta.id).fileupload({
						dataType: 'json',
						dropZone: $('#' + meta.id),
						formData: meta.imageRules ? meta.imageRules : {},
						add: function (e, data)
						{
							_w.jqXHR[meta.id] = data.submit();
						},
						send: $.proxy(function (meta, e, data)
						{
							if (!meta.fileTypes)
							{
								return true;
							}
							for (var i in data.files)
							{
								var allGood = false;
								var file = data.files[i].name;
								for (var x in meta.fileTypes)
								{
									if (meta.fileTypes[x] == file.substr(file.lastIndexOf('.') + 1))
									{
										allGood = true;
										$('#' + meta.id).val(file);
									}
								}
								if (!allGood)
								{
									return false;
								}
							}
							return true;
						}, this, meta),
						start: $.proxy(function (meta)
						{
							$('#' + meta.id).removeClass('valid');
							$('#' + meta.id).removeClass('required');
							$('#' + meta.id).removeClass('error');
							$('#progress_' + meta.id).show();
							$('#progress_' + meta.id + ' .progress-bar').css(
								'width',
								'0%'
							);
						}, this, meta),
						progress: $.proxy(function (meta, e, data)
						{
							var progress = parseInt(data.loaded / data.total * 100, 10);
							$('#progress_' + meta.id + ' .progress-bar').css(
								'width',
								progress + '%'
							);
						}, this, meta),
						fail: function (e, data)
						{
							delete _w.jqXHR[meta.id];
							$('#' + meta.id).removeClass('valid');
							$('#' + meta.id).removeClass('required');
							$('#container_' + meta.id)
								.find("label[for=" + meta.id + "].error")
								.remove();
							$('#' + meta.id).addClass('error');

							$('#progress_' + meta.id).hide();
							$('#progress_' + meta.id + ' .progress-bar').css(
								'width',
								'0%'
							);
							$('#fileid_' + meta.id).val('');
							$('#' + meta.id).val('');
							$('#' + did).prop('disabled', true);
							$('#' + did).hide();
							alert('Could not upload document.');
						},
						done: $.proxy(function (meta, e, data)
						{
							delete _w.jqXHR[meta.id];
							$('#progress_' + meta.id).hide();
							if (undefined == data.result)
							{
								var req = {};
								req.name = data.files[0].name;
								App.Ajax.JSON({
										"name": 'FileUpload.GetResponse',
										"url": 'workspace/get-upload-result',
										"data": req
									},
									$.proxy(function (meta, response)
									{
										$.each(response.Data, function (i, file)
										{
											$('label.error[for="' + meta.id + '"]').remove();
											if (file.error)
											{
												$('#' + meta.id).removeClass('valid');
												$('#' + meta.id).removeClass('required');
												$('#container_' + meta.id)
													.find("label[for=" + meta.id + "].error")
													.remove();

												$('#' + meta.id).addClass('error');
												$('#' + meta.id).parent().parent().append('<label for="' + meta.id + '" class="error">' + file.error + '</label>');

												$('#progress_' + meta.id + ' .progress-bar').css(
													'width',
													'0%'
												);
												$('#fileid_' + meta.id).val('');
												$('#' + meta.id).val('');
												$('#' + did).prop('disabled', true);
												$('#' + did).hide();
												return;
											}
											$('#' + meta.id).removeClass('error');
											$('#' + meta.id).removeClass('required');
											$('#container_' + meta.id)
												.find("label[for=" + meta.id + "].error")
												.remove();
											$('#' + meta.id).addClass('valid');
											$('#progress_' + meta.id + ' .progress-bar').css(
												'width',
												'0%'
											);
											$('#fileid_' + meta.id).val(file.id);
											$('#img_' + meta.id).attr('src', '/thumbnail?id=' + file.id);
											$('#' + meta.id).val(file.name);
											$('#' + did).attr('data-download', '/image?id=' + file.id);
											$('#' + did).prop('disabled', false);
											$('#' + did).show();
											if (meta.afterSuccess)
											{
												meta.afterSuccess(file.id, file.name);
											}
										});
									}, this, meta),
									function (response)
									{
										//console.log('File upload data retrieval error');
										//console.log(response);
									}
								);
								return;
							}
							$.each(data.result, function (i, file)
							{
								$('label.error[for="' + meta.id + '"]').remove();
								if (file.error)
								{
									$('#' + meta.id).removeClass('valid');
									$('#' + meta.id).removeClass('required');
									$('#container_' + meta.id)
										.find("label[for=" + meta.id + "].error")
										.remove();

									$('#' + meta.id).addClass('error');
									$('#' + meta.id).parent().parent().append('<label for="' + meta.id + '" class="error">' + file.error + '</label>');

									$('#progress_' + meta.id + ' .progress-bar').css(
										'width',
										'0%'
									);
									$('#fileid_' + meta.id).val('');
									$('#' + meta.id).val('');
									$('#' + did).prop('disabled', true);
									$('#' + did).hide();
									return;
								}
								$('#' + meta.id).removeClass('error');
								$('#' + meta.id).removeClass('required');
								$('#container_' + meta.id)
									.find("label[for=" + meta.id + "].error")
									.remove();
								$('#' + meta.id).addClass('valid');
								$('#progress_' + meta.id + ' .progress-bar').css(
									'width',
									'0%'
								);
								$('#fileid_' + meta.id).val(file.id);
								$('#img_' + meta.id).attr('src', '/thumbnail?id=' + file.id);
								$('#' + meta.id).val(file.name);
								$('#' + did).attr('data-download', '/image?id=' + file.id);
								$('#' + did).prop('disabled', false);
								$('#' + did).show();
								if (meta.afterSuccess)
								{
									meta.afterSuccess(file.id, file.name);
								}
							});
						}, this, meta)
					});
				}
				if ('audio' == meta.type)
				{
					$('#img_' + meta.id).click(function ()
					{

						$('#btn_' + meta.id).click();
					});
					$('#btn_' + meta.id).fileupload({
						dataType: 'json',
						fail: function (e, data)
						{
							alert('Could not upload audio file.');
						},
						done: function (e, data)
						{
							if (undefined == data.result)
							{
								var req = {};
								req.name = data.files[0].name;
								App.Ajax.JSON({
										"name": 'FileUpload.GetResponse',
										"url": 'workspace/get-upload-result',
										"data": req
									},
									$.proxy(function (meta, response)
									{
										$.each(response.Data, function (i, file)
										{
											if (file.error)
											{
												alert(file.error);
												return;
											}
											var haveVal = ('' == $('#' + meta.id).val())
												? false
												: true;
											$('#' + meta.id).val(file.id);
											if (haveVal)
											{
												var parts = file.name.split('.');
												var mediaOptions = {};
												mediaOptions[parts[1]] = 'http://art.local/audio/' + file.name;
												$('#jquery_jplayer_' + meta.id)
													.jPlayer("setMedia", mediaOptions)
													.jPlayer("stop");
											}
											else
											{
												var parts = file.name.split('.');
												$('#jquery_jplayer_' + meta.id).jPlayer({
													ready: $.proxy(function (meta, file)
													{
														var parts = file.name.split('.');
														var mediaOptions = {};
														mediaOptions[parts[1]] = 'http://art.local/audio/' + value.name;
														$('#jquery_jplayer_' + meta.id)
															.jPlayer("setMedia", mediaOptions)
															.jPlayer("stop");
													}, this, meta, file),
													ended: function (event)
													{
														$(this).jPlayer("play");
													},
													cssSelectorAncestor: '#jp_interface_' + meta.id,
													swfPath: "js",
													supplied: parts[1]
												});
												$('#audcon_' + meta.id).show();
												$('#img_' + meta.id).hide();
											}
										});
									}, this, meta),
									function (response)
									{
										//console.log('File upload data retrieval error');
										//console.log(response);
									}
								);
								return;
							}
							$.each(data.result, function (i, file)
							{
								if (file.error)
								{
									alert(file.error);
									return;
								}
								var haveVal = ('' == $('#' + meta.id).val())
									? false
									: true;
								$('#' + meta.id).val(file.id);
								if (haveVal)
								{
									var parts = file.name.split('.');
									var mediaOptions = {};
									mediaOptions[parts[1]] = 'http://art.local/audio/' + file.name;
									$('#jquery_jplayer_' + meta.id)
										.jPlayer("setMedia", mediaOptions)
										.jPlayer("stop");
								}
								else
								{
									var parts = file.name.split('.');
									$('#jquery_jplayer_' + meta.id).jPlayer({
										ready: $.proxy(function (meta, file)
										{
											var parts = file.name.split('.');
											var mediaOptions = {};
											mediaOptions[parts[1]] = 'http://art.local/audio/' + value.name;
											$('#jquery_jplayer_' + meta.id)
												.jPlayer("setMedia", mediaOptions)
												.jPlayer("stop");
										}, this, meta, file),
										ended: function (event)
										{
											$(this).jPlayer("play");
										},
										cssSelectorAncestor: '#jp_interface_' + meta.id,
										swfPath: "js",
										supplied: parts[1]
									});
									$('#audcon_' + meta.id).show();
									$('#img_' + meta.id).hide();
								}
							});
						}
					});
				}
				if (meta.dataSource)
				{
					switch (meta.type)
					{
						case 'select':
							App.DataStore.listen(
								meta.id, meta.dataSource,
								$.proxy(App.ElementLibrary.BuildSelectOptions, this, tid, meta),
								'Recurring'
							);
							break;
						case 'checkGroup':
							App.DataStore.listen(
								meta.id, meta.dataSource,
								$.proxy(App.ElementLibrary.BuildCheckGroup, this, tid, meta),
								'Recurring'
							);
							break;
					}
				}
				if ('date' == meta.type)
				{
					var opt = meta.dtopt ? meta.dtopt : {};
					opt.autoclose = true;
					$('#' + meta.id)
						.datepicker(opt)
						.on('changeDate', $.proxy(function (meta, ev)
						{
							try
							{
								if ($('#' + meta.id).valid())
								{
									$('#' + meta.id).removeClass('invalid').addClass('success');
								}
							}
							catch (err)
							{
								// failure expected if not inside validation form.
							}
						}, this, meta));
				}
				if ('select' == meta.type)
				{
					$('#' + meta.id).change(function ()
					{
						if (!App.DataStore.getItem('BuildSelect:' + meta.id, false))
						{
							try
							{
								$(this).valid();
							}
							catch (err)
							{
								// no worries
							}
						}
					});
				}
				if (meta.rules && (meta.rules.number || meta.rules.digits))
				{
					var signed = meta.signed;
					App.Util.enforceNumericInput(meta.id, signed);
				}
				if (meta.rules && meta.rules.maxlength)
				{
					$('#' + meta.id).attr('maxlength', meta.rules.maxlength);
				}
				if (meta.onChange)
				{
					$('#' + meta.id).unbind('change');
					if ('select' == meta.type)
					{
						$('#' + meta.id).change(function (e)
						{
							if (!App.DataStore.getItem('BuildSelect:' + meta.id, false))
							{
								try
								{
									$(this).valid();
								}
								catch (err)
								{
									// no worries
								}
							}
						});
					}
					$('#' + meta.id).change(meta.onChange);
				}
				if (meta.onFocus)
				{
					$('#' + meta.id).on('focus', meta.onFocus);
				}
				if (meta.onBlur)
				{
					$('#' + meta.id).on('blur', meta.onBlur);
				}
				if (meta.bind)
				{
					meta['bind'](meta);
				}
				if ('checkbox' == meta.type || 'amountCheck' == meta.type)
				{
					App.Util.updateCheckboxStyle($('#' + meta.id));
				}
			}
		}


	};
})();
