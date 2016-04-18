;
(function ()
{

	_App.DataElement = function ()
	{

		this.initialize();

	};

	_App.DataElement.prototype =
	{

		initialize: function ()
		{
			// Nothing needed here just yet.
		},

		singleFilter: function (filter, value, fields)
		{
			if ('' == value)
			{
				return filter;
			}
			if (isNaN(value))
			{
				value = value.toLowerCase();
			}
			value = '%' + value + '%';
			var nested = {};
			for (var field in fields)
			{
				var param = App.Config.dataManglerCs
					? 'LOWER(' + fields[field] + ')'
					: fields[field];
				nested[param] = value;
			}
			filter.filters['singleSearch'] = nested;
			filter.count++;
			return filter;
		},

		populateSingleFilter: function (filters, filterId)
		{
			for (var field in filters)
			{
				var value = filters[field].substring(1, filters[field].length - 1)
				if ('' == $('#' + filterId).val())
				{
					$('#' + filterId).val(value);
				}
				return;
			}
		},

		filterIfnotEmpty: function (filter, element, field, op, append, defaultValue)
		{
			append = (append)
				? append
				: '';
			if ('' != $('#' + element).val() && null != $('#' + element).val())
			{
				op = op ? op + ' ' : '';
				var val = $('#' + element).val();
				val = ('' == val || !isNaN(val) || '' != op)
					? val
					: '%' + val + '%';
				if (filter.filters[field])
				{
					var nested = {};
					nested[field] = op + val + append;
					filter.filters[field + '-to'] = nested;
				}
				else
				{
					filter.filters[field] = op + val + append;
				}
				filter.count++;
			}
			return filter;
		},

		populateFilters: function (filters, map)
		{
			for (var field in map)
			{
				if (filters[field])
				{
					filters[field] = isNaN(filters[field])
						? filters[field].substring(1, filters[field].length - 1)
						: filters[field];
					$('#' + map[field]).val(filters[field]);
				}
			}
		},

		/*Example :
		 {
		 // General
		 id 				: '',
		 label 			: '',
		 icon 			: '',
		 disabled 		: false,
		 permission 		: true,
		 inputType 		: '',
		 maxlength 		: 100,
		 placeholder 	: '',
		 // Button
		 href 			: '',
		 btnPreset 		: 'Default',
		 btnType 		: 'button',
		 btnStyle 		: 'btn-default',
		 // Grid
		 headerStyle 	: '',
		 orderAsc 		:
		 {
		 id : '',
		 bind : $.proxy(
		 _w.namespace.orderSomeGrid,
		 this,
		 'table.fieldname',
		 'ASC'
		 )
		 },
		 orderDesc 	:
		 {
		 id : '',
		 bind : $.proxy(
		 _w.namespace.orderSomeGrid,
		 this,
		 'table.fieldname',
		 'DESC'
		 )
		 },
		 placeholder 	: '',
		 inputType 		: '',
		 actions 		: false,
		 bindClear 		: $.proxy(
		 _w.namespace.clearSomeGrid,
		 this
		 ),
		 bindSearch 		: $.proxy(
		 _w.namespace.searchSomeGrid,
		 this
		 ),
		 context 					: '',
		 contextLabelSpan 			: '',
		 contextLabelStyle 			: '',
		 contextInputSpan 			: '',
		 contextInputWrapperStyle 	: '',
		 contextInputStyle 			: '',
		 contextAttrib 				: '',
		 columnInputSpan 			: '',
		 columnInputWrapperStyle 	: '',
		 columnInputStyle 			: '',
		 columnAttrib 				: '',
		 rowStyle 					: '',
		 rowAttrib 					: '',
		 cellStyle 					: '',
		 cellAttrib 					: '',
		 cellPrepend 				: '',
		 pagerItemStyle 				: '',
		 pagerWrapperStyle 			: '',
		 // Form
		 labelSpan 				: '',
		 labelStyle 				: '',
		 inputSpan 				: '',
		 inputWrapperStyle 		: '',
		 inputStyle 				: '',
		 inputAttrib 			: '',
		 inputPrepend 			: '',
		 imageStyle 				: '',
		 iconSpan 				: '',
		 bind 					: '',
		 rules 					: {}
		 },*/
		GridTitleButtons: {
			handler: 'ConstructorComponentCollection',
			constructor: 'Button',
			items: {}
		},
		GridContextFilter: {
			handler: 'ConstructorComponentCollection',
			constructor: 'GridContextFilter',
			items: {}
		},
		GridColumns: {
			handler: 'GridConstructorComponentCollection',
			headerId: 'gridColumnHeaders',
			filterId: 'gridColumnFilters',
			items: {}
		},
		GridRowRepeater: {
			handler: 'ConstructorGridRowCollection',
			constructor: 'GridDataRow',
			items: {}
		},
		GridPageSize: {
			handler: 'GridPageSize',
			allowLarge: false
		},
		GridPager: {
			handler: 'GridPager'
		},
		GridRecords: {
			handler: 'GridRecords'
		},
		Button: {
			handler: 'Button',
			href: '',
			btnPreset: 'Default',
			btnType: 'button',
			btnStyle: 'btn-default',
		},
		Text: {
			handler: 'Text'
		},
		InlineNotification: {
			handler: 'InlineNotification'
		},
		LabeledText: {
			handler: 'LabeledText',
			labelStyle: '',
			textStyle: '',
		},
		Password: {
			handler: 'FieldComponent',
			type: 'input',
			inputType: 'password',
			rules: {minlength: 5, maxlength: 150}
		},
		Checkbox: {
			handler: 'FieldComponent',
			type: 'checkbox',
			dataType: 'checkbox',
			checked: false,
			rules: {}
		},
		String: {
			handler: 'FieldComponent',
			type: 'input',
			inputType: 'text',
			rules: {minlength: 2, maxlength: 150}
		},
		Tags: {
			handler: 'FieldComponent',
			type: 'input',
			inputType: 'text',
			dataType: 'tags',
			rules: {maxlength: 250}
		},
		Number: {
			handler: 'FieldComponent',
			type: 'input',
			inputType: 'text',
			rules: {number: true}
		},
		Digit: {
			handler: 'FieldComponent',
			type: 'input',
			inputType: 'text',
			rules: {digits: true}
		},
		Date: {
			handler: 'FieldComponent',
			type: 'date',
			rules: {dateISO: true}
		},
		Mobile: {
			handler: 'FieldComponent',
			type: 'mobile',
			mask: '+99 99 999 9999',
			rules: {mobile: true}
		},
		Amount: {
			handler: 'FieldComponent',
			type: 'amount',
			rules: {number: true}
		},
		Percentage: {
			handler: 'FieldComponent',
			type: 'percentage',
			rules: {number: true}
		},
		TextArea: {
			handler: 'FieldComponent',
			type: 'textarea',
			rows: 5,
			rules: {}
		},
		HtmlText: {
			handler: 'FieldComponent',
			type: 'htmltext',
			rules: {}
		},
		Image: {
			handler: 'FieldComponent',
			type: 'image',
			rules: {}
		},
		Video: {
			handler: 'FieldComponent',
			type: 'video',
			rules: {}
		},
		Audio: {
			handler: 'FieldComponent',
			type: 'audio',
			rules: {}
		},
		Attachment: {
			handler: 'FieldComponent',
			type: 'attachment',
			rules: {}
		},
		Document: {
			handler: 'FieldComponent',
			type: 'document',
			rules: {}
		},
		Collection: {
			handler: 'FieldComponent',
			type: 'collection',
			container: {
				container: 'GeneralCollectionContainer',
				containerTags: ['eid', 'label', 'labelStyle', 'containerStyle', 'items'],
				display: 'GeneralCollectionItem',
				displayTags: ['eid', 'label']
			},
			rules: {}
		},
		DependantDataSource: {
			handler: 'FieldComponent',
			type: 'select',
			dataSource: '',
			rules: {}
		},
		DataList: {
			handler: 'FieldComponent',
			type: 'select',
			title: 'Select',
			dataSource: '',
			dataList: [],
			rules: {}
		},
		Reference: {
			handler: 'FieldComponent',
			type: 'select',
			title: 'Select',
			dataSource: '',
			dataQuery: {
				isStatic: false,
				workspace: '',
				task: '',
				jobId: null,
				data: {},
				options: {},
				callback: null
			},
			rules: {digits: true}
		}

	};

})();
