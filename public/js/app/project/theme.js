;
(function ()
{

	_App.Theme = function ()
	{

		this.initialize();

	};

	_App.Theme.prototype =
	{

		initialize: function ()
		{
			// Nothing needed here just yet.
		},

		Icon: {
			'Glyphicon': '<span [eid] class="glyphicon glyphicon-[name] [style]"></span>'
		},

		Menu: {
			'SectionOpen': '<div class="sub-menu no-capture [span]">',
			'SectionClose': '</div>',
			'ListOpen': '<ul>',
			'ListClose': '</ul>',
			'MenuHeader': '<li id="[eid]" class="sub-menu-header no-capture">[title]</li>',
			'MenuMain': '<li id="[eid]" class="no-capture"><a class="no-capture" href="#/[href]">[title]</a></li>',
			'MenuSub': '<li id="[eid]"><a class="menu-indent no-capture" href="#/[href]">[title]</a></li>',
			'DropDown': '<li class="dropdown no-capture">'
			            + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">[title] <b class="caret"></b></a>'
			            + '<div class="dropdown-menu no-capture [dropDownStyle]">'
			            + '[items]'
			            + '</div>'
			            + '</li>',
			'ContextOptionsHeading': '<a class="list-group-item heading">Options</a>',
			'ContextMenuItem': '<a id="[eid]" class="list-group-item [active]" href="#/[href]"> [title] </a>',
			'ContextMenuItemNoHref': '<a id="[eid]" class="list-group-item handy [active]"> [title] </a>'
		},

		NotifyList: {
			'DefaultContent': '<ul id="notificationsList"><li class="notice-header">Notifications</li></ul>',
			'Category': '<ul data-category="[category]"></ul>',
			'Item': '<li id="[eid]" class="notice-item" data-category="[category]">'
			        + '[title]'
			        + '</li>'
		},

		Button: {
			'GridExport': '&nbsp;<button type="[type]" [eid] [href] class="btn [style]" [disabled]>'
			               + '	[icon] [label]'
			               + '</button>',
			'Default':     '&nbsp;<button type="[type]" [eid] [href] class="btn [style]" [disabled]>'
			               + '	[icon] [label]'
			               + '</button>',
			'Big':         '&nbsp;<button type="[type]" [eid] [href] class="btn btn-lg [style]" [disabled]>'
			               + '	[icon] [label]'
			               + '</button>',
			'Small':       '&nbsp;<button type="[type]" [eid] [href] class="btn btn-sm [style]" [disabled]>'
			               + '	[icon] [label]'
			               + '</button>',
			'Tiny':        '&nbsp;<button type="[type]" [eid] [href] class="btn btn-xs [style]" [disabled]>'
			               + '	[icon] [label]'
			               + '</button>',
			'GroupButton': '<button type="button" [eid] class="btn btn-default [style]" [disabled]>'
			               + '	[icon] [label] '
			               + '</button>'
		},

		Grid: {
			'defaults': {
				searchButtonStyle: 'btn-primary btn-sm btn-submit-search',
				resetButtonStyle: 'btn-sm btn-clear-search',
				contextDivSpan: 'col-sm-4',
				contextLabelSpan: 'col-sm-12',
				contextLabelStyle: '',
				contextInputSpan: 'col-sm-12',
				contextInputWrapperStyle: '',
				contextInputStyle: 'input-sm',
				columnInputSpan: 'col-sm-12',
				columnInputWrapperStyle: 'filter-input',
				columnInputStyle: '',
			},
			'SingleSearchWrapper': '<td colspan="[itemCount]">'
			                       + '<form id="[formId]" class="form-inline singleSearchFilter" role="form">'
			                       + '<div class="form-group col-sm-4">[filter]</div>'
			                       + '</form>'
			                       + '</td>',
			'ColumnHeader':        '<th class="[headerStyle]">'
			                       + '[order]<span class="text" data-item="[item]">[label]</span>'
			                       + '</th>',
			'ColumnFilterWrapper': '<td>'
			                       + '[filter]'
			                       + '</td>',
			'DataRow':             '<tr [rowId] class="[rowStyle]" [rowAttrib]>'
			                       + '[cells]'
			                       + '</tr>',
			'DataCell':            '<td class="[cellStyle]" [cellAttrib]>'
			                       + '[prepend][value][append]'
			                       //+ '<a href="#" class="[cellStyle] editable editable-click" data-type="text" data-placement="right" data-title="[cellStyle]"> [prepend][value][append]</a>'
			                       + '</td>',
			'IconCheckLocked': '<span class="glyphicon glyphicon-lock green"></span>',
			'IconCheckTrue': '<span class="glyphicon glyphicon-ok green"></span>',
			'IconCheckFalse': '<span class="glyphicon glyphicon-remove red"></span>',
			'IconTransfer': '<span class="glyphicon glyphicon-transfer yellow"></span>',
			'CheckValueEditableTrue': '<span data-id="[rowId]" data-field="[dataField]" data-value="1" class="glyphicon glyphicon-ok green handy editable-check"></span>',
			'CheckValueEditableFalse': '<span data-id="[rowId]" data-field="[dataField]" data-value="0" class="glyphicon glyphicon-remove red handy editable-check"></span>',
			'Pager':               '<div class="col-sm-12 [wrapperStyle]">'
			                       + '<ul class="pagination pagination-sm pull-right handy [eid]">'
			                       + '<li><a data-page="1" class="[eid] [itemStyle]"> <span class="glyphicon glyphicon-chevron-left"></span><span class="glyphicon glyphicon-chevron-left"></span> </a></li>'
			                       + '<li><a data-page="[stepDown]" class="[eid] [itemStyle]"> <span class="glyphicon glyphicon-chevron-left"></span> </a></li>'
			                       + '[items]'
			                       + '<li><a data-page="[stepUp]" class="[eid] [itemStyle]"> <span class="glyphicon glyphicon-chevron-right"></span> </a></li>'
			                       + '<li><a data-page="[maxPage]" class="[eid] [itemStyle]"> <span class="glyphicon glyphicon-chevron-right"></span><span class="glyphicon glyphicon-chevron-right"></span> </a></li>'
			                       + '</ul></div>',
			'PagerItem': '<li><a data-page="[pageNumber]" class="[eid] [itemStyle]"><b>[pageNumber]</b></a></li>',
			'PagerActiveItem': '<li class="active"><span data-page="[pageNumber]" class="[eid] [itemStyle]"><b>[pageNumber]</b></span></li>',
			'PageSizeSelector':    '<div class="btn-group hidden-xs [eid]">'
			                       + '<button type="button" class="btn btn-sm btn-default">Display [recordsPerPage] Rows</button>'
			                       + '<button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">'
			                       + '<span class="caret"></span>'
			                       + '<span class="sr-only">Toggle Dropdown</span>'
			                       + '</button>'
			                       + '<ul id="[eid]Options" class="dropdown-menu" role="menu">'
			                       + '<li data-size="10"><a class="handy">Display 10 Rows</a></li>'
			                       + '<li data-size="25"><a class="handy">Display 25 Rows</a></li>'
			                       + '<li data-size="50"><a class="handy">Display 50 Rows</a></li>'
			                       + '<li data-size="100"><a class="handy">Display 100 Rows</a></li>'
			                       + '<li data-size="500" class="ghost"><a class="handy">Display 500 Rows</a></li>'
			                       + '</ul>'
			                       + '</div>',
			'RecordUpdateAction':  'Are you sure you want to save your changes? '
			                       + '<a id="[eid]_yes" class="handy">YES</a> | '
			                       + '<a id="[eid]_no" class="handy">NO</a>',
			'ActionDropdown':      '<span class="confirm" data-id="[rowId]"></span><div class="btn-group">'
			                       + '<button id="aDrpBtn[rowId]" type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown">'
			                       + '<span id="aDrpBtnIcn[rowId]" class="glyphicon glyphicon-cog"></span>'
			                       + '&nbsp;&nbsp;&nbsp;<span id="aDrpBtnCrt[rowId]" class="caret"></span>'
			                       + '</button>'
			                       + '<ul id="aDrpUl[rowId]" class="dropdown-menu dropdown-sm" role="menu" data-id="[rowId]">'
			                       + '[items]'
			                       + '</ul>'
			                       + '</div>',
			'MultiActionDropdown': '<div class="btn-group">'
			                       + '<button type="button" class="btn btn-sm btn-sm [btnStyle] btn-title-action dropdown-toggle" data-toggle="dropdown">'
			                       + '<span>[buttonLabel]</span>'
			                       + '&nbsp;&nbsp;&nbsp;<span class="caret"></span>'
			                       + '</button>'
			                       + '<ul class="dropdown-menu" role="menu"">'
			                       + '[items]'
			                       + '</ul>'
			                       + '</div>',
			'ActionDropdownItem': '<li><a class="handy" data-action="[action]">[label]</a></li>',
			'ConfirmationContent': '<button type="button" id="actionConfirmation" class="btn btn-sm btn-success">'
			                       + '<span class="glyphicon glyphicon-ok"></span>&nbsp;&nbsp;'
			                       + 'Yes </button>&nbsp;'
			                       + '<button type="button" id="actionDecline" class="btn btn-sm btn-danger">'
			                       + '<span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;'
			                       + 'No </button>'
		},

		Display: {

			'InlineNotification': '<div class="col-md-12 grey-bg">'
			                      + '<div class="col-md-1 glyphicon-margin-top-8"><span class="glyphicon glyphicon-info-sign"></span></div>'
			                      + '<div class="col-md-10">[message]</div>'
			                      + '</div>',
			'Wizard':             '<div id="[eid]" class="wizard">'
			                      + '<ul class="steps">'
			                      + '[steps]'
			                      + '</ul>'
			                      + '</div>'
			                      + '<div class="step-content">'
			                      + '[contentItems]'
			                      + '</div>',
			'WizardStep':         '<li data-target="#[contentId]" class="[active]"><span class="badge">[stepNumber]</span>'
			                      + '<span class="content">'
			                      + '<span class="step-title">Step [stepNumber]</span><br/>'
			                      + '<span class="step-description">[title]</span>'
			                      + '</span>'
			                      + '<span class="chevron"></span></li>',
			'WizardContent': '<div class="step-pane [active]" id="[eid]">[content]</div>',
			'BoxListItem':        '<div class="box-list-item">'
			                      + '<span data-id="[dataId]" class="box-list-item-remove glyphicon glyphicon-remove handy pull-right"></span>'
			                      + '<div class="box-list-item-title">[title]</div>'
			                      + '<div class="box-list-item-content">[content]</div>'
			                      + '</div>'
		},

		Field: {
			'defaults': {
				labelSpan: 'col-sm-5',
				labelStyle: '',
				inputSpan: 'col-sm-7',
				inputWrapperStyle: '',
				inputStyle: '',
			},
			'Collection': {
				'GeneralContainer': '<label for="collectionContainer_[eid]" class="[labelStyle]">[label]</label>'
				                    + '<div id="collectionContainer_[eid]" class="[containerStyle]">'
				                    + '[items]'
				                    + '</div>',
				'GeneralItem':      '<span id="collectionTag_[eid]">'
				                    + '[value]'
				                    + '</span>'
			},
			'Editable': '<a class="handy editable-display" id="[eid]" data-type="[dataType]" data-pk="[pid]" data-title="[dataTile]">'
			                           + '[value]'
			                           + '</a>',
			'CustomEditable':          '<a class="handy editable-display [style]" id="[eid]" data-pk="[pid]" data-sk="[sid]" data-type="[dataType]">'
			                           + '[value]'
			                           + '</a>'
			                           + '<input type="text" id="[eid]_input" class="editable-input ghost [style]" data-pk="[pid]" data-sk="[sid]">',
			'Input':                   '<label for="[eid]" class="[labelSpan] control-label [labelStyle]">[label]</label>'
			                           + '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<input type="[type]" id="[eid]" name="[eid]" value="[value]"'
			                           + ' class="form-control [inputStyle]" placeholder="[placeholder]" [attrib] [disabled]>'
			                           + '</div>',
			'InputNoLabel':            '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<input type="[type]" id="[eid]" name="[eid]" value="[value]"'
			                           + ' class="form-control [inputStyle]" placeholder="[placeholder]" [attrib] [disabled]>'
			                           + '</div>',
			'InputWithPrepend':        '<label for="[eid]" class="[labelSpan] control-label [labelStyle]">[label]</label>'
			                           + '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<div class="input-group">'
			                           + '<span class="input-group-addon">[prepend]</span>'
			                           + '<input type="[type]" id="[eid]" name="[eid]" value="[value]"'
			                           + ' class="form-control [inputStyle]" placeholder="[placeholder]" [attrib] [disabled]>'
			                           + '</div>'
			                           + '</div>',
			'InputWithAppend':         '<label for="[eid]" class="[labelSpan] control-label [labelStyle]">[label]</label>'
			                           + '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<div class="input-group">'
			                           + '<input type="[type]" id="[eid]" name="[eid]" value="[value]"'
			                           + ' class="form-control [inputStyle]" placeholder="[placeholder]" [attrib] [disabled]>'
			                           + '<span class="input-group-addon">[append]</span>'
			                           + '</div>'
			                           + '</div>',
			'InputWithPrependNoLabel': '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<div class="input-group">'
			                           + '<span class="input-group-addon">[prepend]</span>'
			                           + '<input type="[type]" id="[eid]" name="[eid]" value="[value]"'
			                           + ' class="form-control [inputStyle]" placeholder="[placeholder]" [attrib] [disabled]>'
			                           + '</div>'
			                           + '</div>',
			'Checkbox':                '<label for="[eid]" class="checkbox-inline [labelStyle]">'
			                           + '<input type="checkbox" id="[eid]" name="[eid]" class="[inputStyle]" value="[value]"'
			                           + ' [attrib] [checked] [disabled]> [label]'
			                           + '</label>',
			'FormCheckbox':            '<label for="[eid]" class="[labelSpan] control-label [labelStyle]">[label]</label>'
			                           + '<div class="[inputSpan] [inputWrapperStyle] check-align-left">'
			                           + '<input type="checkbox" id="[eid]" name="[eid]" class="[inputStyle]" value="[value]"'
			                           + ' [attrib] [checked] [disabled]>'
			                           + '</div>',
			'Select':                  '<label for="[eid]" class="[labelSpan] control-label [labelStyle]">[label]</label>'
			                           + '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<select id="[eid]" name="[eid]" class="sp selectpicker show-menu-arrow [inputStyle]"'
			                           + ' data-size="[dataSize]" [attrib] [disabled]>'
			                           + '[options]'
			                           + '</select>'
			                           + '</div>',
			'Select2':                 '<label for="[eid]" class="[labelSpan] control-label [labelStyle]">[label]</label>'
			                           + '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<select id="[eid]" name="[eid]" class="selector2 show-menu-arrow [inputStyle]"'
			                           + ' [attrib] [disabled]>'
			                           + '[options]'
			                           + '</select>'
			                           + '</div>',
			'Select2Div':              '<label for="[eid]" class="[labelSpan] control-label [labelStyle]">[label]</label>'
			                           + '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<div id="[eid]" name="[eid]" class="selector2 show-menu-arrow [inputStyle]"'
			                           + ' [attrib] [disabled]>'
			                           + '</div>'
			                           + '</div>',
			'SelectNoLabel':           '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<select id="[eid]" name="[eid]" class="sp selectpicker show-menu-arrow [inputStyle]"'
			                           + ' data-size="[dataSize]" [attrib] [disabled]>'
			                           + '[options]'
			                           + '</select>'
			                           + '</div>',
			'Select2NoLabel':          '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<select id="[eid]" name="[eid]" class="selector2 show-menu-arrow [inputStyle]"'
			                           + ' [attrib] [disabled]>'
			                           + '[options]'
			                           + '</select>'
			                           + '</div>',
			'Select2NoLabelDiv':       '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<div id="[eid]" name="[eid]" class="selector2 show-menu-arrow [inputStyle]"'
			                           + ' [attrib] [disabled]>'
			                           + '</div>'
			                           + '</div>',
			'SelectOption': '<option value="[value]" [selected]>[label]</option>',
			'TextArea':                '<label for="[eid]" class="[labelSpan] control-label [labelStyle]">[label]</label>'
			                           + '<div class="[inputSpan] [inputWrapperStyle]">'
			                           + '<textarea id="[eid]" name="[eid]" class="form-control [inputStyle]" rows="[rows]" [attrib] [disabled]>[value]</textarea>'
			                           + '</div>',
			'HtmlTextArea':            '<div id="[eid]" name="[eid]" class="[inputStyle]" [attrib] [disabled]>'
			                           + '[value]</div>',
			'Image':                   '<label for="btn_[eid]" class="[labelSpan] control-label [labelStyle] no-capture">[label]</label>'
			                           + '<div id="container_[eid]" class="[inputSpan] [inputWrapperStyle] no-capture">'
			                           + '<input id="btn_[eid]" class="hide no-capture" type="file" name="files[]" data-url="/workspace/image-upload">'
			                           + '<input type="hidden" id="fileid_[eid]" value="[value]">'
			                           + '<div class="input-group no-capture">'
			                           + '<input type="[type]" id="[eid]" name="[eid]" value="[value]" progress-id="progress_[eid]"'
			                           + ' class="form-control file-input [inputStyle] no-capture" placeholder="[placeholder]" [attrib] disabled>'
			                           + '<span class="input-group-btn no-capture">'
			                           + '<button type="button" id="[uid]" class="btn btn-sm btn-primary no-capture" [disabled] title="Browse for file"><span class="glyphicon glyphicon-search"></span></button>'
			                           + '<button type="button" id="[did]" class="btn btn-sm btn-primary no-capture ghost" title="Download" disabled><span class="glyphicon glyphicon-download"></span></button>'
			                           + '</span>'
			                           + '</div>'
			                           + '<div id="progress_[eid]" class="progress progress-thin progress-striped active progress-container ghost no-capture">'
			                           + '<div class="progress-bar progress-bar-success no-capture"></div>'
			                           + '</div>'
			                           + '</div>',
			'Video':                   '<input type="text" id="[eid]" value="[value]" class="col-sm-12" placeholder="YouTube Video ID">'
			                           + '<img id="img_[eid]" src="/img/app/misc/[defaultImage]" class="img-responsive img-thumbnail [videoStyle]">'
			                           + '<div id="vidcon_[eid]" class="video-container" style="display:none;">'
			                           + '<iframe id="vid_[eid]"></iframe>'
			                           + '</div>',
			'Audio':                   '<input id="btn_[eid]" class="hide" type="file" name="files[]" data-url="/workspace/audio-upload">'
			                           + '<input type="hidden" id="[eid]" value="[value]">'
			                           + '<img id="img_[eid]" src="/img/app/misc/[defaultImage]" class="img-responsive img-thumbnail [audioStyle]">'
			                           + '<div id="jquery_jplayer_[eid]" class="jp-jplayer"></div>'
			                           + '<div id="audcon_[eid]" class="jp-audio-container" style="display:none;">'
			                           + '<div class="jp-audio">'
			                           + '<div class="jp-type-single">'
			                           + '<div id="jp_interface_[eid]" class="jp-interface">'
			                           + '<ul class="jp-controls">'
			                           + '<li><a class="jp-play handy" tabindex="1">play</a></li>'
			                           + '<li><a class="jp-pause handy" tabindex="1">pause</a></li>'
			                           + '<li><a class="jp-mute handy" tabindex="1">mute</a></li>'
			                           + '<li><a " class="jp-unmute handy" tabindex="1">unmute</a></li>'
			                           + '</ul>'
			                           + '<div class="jp-progress-container">'
			                           + '<div class="jp-progress">'
			                           + '<div class="jp-seek-bar">'
			                           + '<div class="jp-play-bar"></div>'
			                           + '</div></div></div>'
			                           + '<div class="jp-volume-bar-container">'
			                           + '<div class="jp-volume-bar">'
			                           + '<div class="jp-volume-bar-value"></div>'
			                           + '</div></div></div></div></div></div>',
			'Attachment':              '<div class="[iconSpan]">'
			                           + '<input id="btn_[eid]" class="hide no-capture" type="file" name="files[]" data-url="/workspace/attachment-upload">'
			                           + '<input type="hidden" id="[eid]" value="[value]">'
			                           + '<img id="doc_[eid]" src="/img/vendor/misc/upload.png" class="img-thumbnail handy [imageStyle] no-capture">'
			                           + '</div><div class="[labelSpan] no-capture">'
			                           + '<label for="btn_[eid]" class="no-capture">[label]</label>'
			                           + '</div>',
			'Document':                '<label for="btn_[eid]" class="[labelSpan] control-label [labelStyle] no-capture">[label]</label>'
			                           + '<div id="container_[eid]" class="[inputSpan] [inputWrapperStyle] no-capture">'
			                           + '<input id="btn_[eid]" class="hide no-capture" type="file" name="files[]" data-url="/workspace/document-upload">'
			                           + '<input type="hidden" id="fileid_[eid]" value="[value]">'
			                           + '<div class="input-group no-capture">'
			                           + '<input type="[type]" id="[eid]" name="[eid]" value="[value]" progress-id="progress_[eid]"'
			                           + ' class="form-control file-input [inputStyle] no-capture" placeholder="[placeholder]" [attrib] disabled>'
			                           + '<span class="input-group-btn no-capture">'
			                           + '<button type="button" id="[uid]" class="btn btn-sm btn-primary no-capture" [disabled] title="Browse for file"><span class="glyphicon glyphicon-search"></span></button>'
			                           + '<button type="button" id="[did]" class="btn btn-sm btn-primary no-capture ghost" title="Download" disabled><span class="glyphicon glyphicon-download"></span></button>'
			                           + '</span>'
			                           + '</div>'
			                           + '<div id="progress_[eid]" class="progress progress-thin progress-striped active progress-container ghost no-capture">'
			                           + '<div class="progress-bar progress-bar-success"></div>'
			                           + '</div>'
			                           + '</div>',
			'Collector':               '<div class="accordion" id="[eid]">'
			                           + '</div>'
		}

	};

})();
