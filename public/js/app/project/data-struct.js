;
(function ()
{

	_App.DataStruct = function ()
	{

		this.initialize();

	};

	_App.DataStruct.prototype =
	{

		dateFormat: 'yyyy-mm-dd',
		currencyUnit: 'R',
		mobileUnit: '<span class="glyphicon glyphicon-phone"></span>',
		currencyPrepend: 'R ',
		mobilePrepend: '+27 ',

		initialize: function ()
		{
			// Nothing needed here just yet.
		},

		Company: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'company',
				field: 'id',
				label: 'Company Id',
				rules: {required: false}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'company',
				field: 'name',
				label: 'Company Name',
				rules: {required: true}
			})
		},

		DataTransform: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'dataTransform',
				field: 'id',
				label: 'DataTransform Id',
				rules: {required: false}
			}),
			owner: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'dataTransform',
				field: 'owner',
				label: 'Owner',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'dataTransform',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			entityNames: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'dataTransform',
				field: 'entityNames',
				label: 'Data Entity',
				dataSource: 'DataTransform.Entity.List',
				dataQuery: {
					isStatic: false,
					workspace: 'DataTransform',
					task: 'DataTransform.EntitySelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true, digits: false},
				messages: {required: 'This field is required'}
			}),
			eventActions: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'dataTransform',
				field: 'eventActions',
				label: 'Data Action',
				multiple: true,
				dataSource: 'DataTransform.DataAction.List',
				dataList: [
					{value: 'Create', label: 'Create'},
					{value: 'Update', label: 'Update'},
					{value: 'Route', label: 'Route'},
					{value: 'Archive', label: 'Archive'},
					{value: 'UnArchive', label: 'UnArchive'},
					{value: 'Delete', label: 'Delete'},
					{value: 'UnDelete', label: 'UnDelete'},
				],
				rules: {maxlength: 100},
				messages: {required: 'This field is required'}
			}),
			eventName: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'dataTransform',
				field: 'eventName',
				label: 'Event Name',
				dataType: 'text',
				rules: {maxlength: 250},
				messages: {required: 'This field is required'}
			}),
			inputFields: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'dataTransform',
				field: 'inputFields',
				label: 'Input Fields',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			transformations: $.extend(true, {}, _App.DataElement.prototype.Collection, {
				namespace: 'dataTransform',
				field: 'transformations',
				label: 'Transformations',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			})
		},

		Import: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'import',
				field: 'id',
				label: 'Import Id',
				rules: {required: false}
			}),
			label: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'import',
				disabled: true,
				field: 'label',
				label: 'Label',
				dataType: 'text',
				rules: {minlength: 3, maxlength: 150, required: false}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'import',
				field: 'name',
				label: 'Importer',
				dataSource: 'importHandlers',
				dataQuery: {
					isStatic: false,
					workspace: 'Import',
					task: 'Import.ListHandlers',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true, digits: false},
				messages: {required: "This field is required"}
			}),
			importDocument: $.extend(true, {}, _App.DataElement.prototype.Document, {
				namespace: 'import',
				field: 'importDocument',
				label: 'Import File',
				fileTypes: ['csv', 'txt'],
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			fileType: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'import',
				field: 'fileType',
				label: 'File Type',
				dataSource: 'import.fileTypes',
				dataList: [
					{value: 'CSV', label: 'CSV'}/*,
					 { value : 'Excel', label : 'Excel' }*/
				],
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			delimiter: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'import',
				field: 'delimiter',
				label: 'Delimiter',
				dataSource: 'import.delimiters',
				dataList: [
					{value: '1', label: ','},
					{value: '2', label: ';'},
					{value: '3', label: '|'},
					{value: "4", label: 'TAB'}
				],
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			enclosure: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'import',
				field: 'enclosure',
				label: 'Enclosure',
				dataSource: 'import.enclosures',
				dataList: [
					{value: '1', label: '"'},
					{value: '2', label: "'"},
					{value: '3', label: '`'}
				],
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			escape: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'import',
				field: 'escape',
				label: 'Escape',
				dataSource: 'import.escapes',
				dataList: [
					{value: '1', label: "\\"}
				],
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			haveHeaders: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'import',
				field: 'haveHeaders',
				label: 'First line contains headers',
				dataSource: 'import.haveHeaders',
				dataList: [
					{value: 0, label: 'No'},
					{value: 1, label: 'Yes'}
				],
				rules: {required: true},
				messages: {required: "This field is required"}
			})
		},

		ImportException: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'importException',
				field: 'id',
				label: 'Import Id',
				rules: {required: false}
			}),
			'import': $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'importException',
				field: 'import',
				label: 'Import',
				dataType: 'select',
				dataSource: 'importException.import.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Import',
					task: 'Import.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			row: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'importException',
				field: 'row',
				label: 'Row number',
				dataType: 'text',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			data: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'importException',
				field: 'data',
				label: 'Row data',
				dataType: 'textarea',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			'error': $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'importException',
				field: 'error',
				label: 'Error',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			})
		},

		ContractLog: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'contractLog',
				field: 'id',
				label: 'Audit Id',
				rules: {required: false}
			}),
			workFlow: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'contractLog',
				field: 'workFlow',
				label: 'Workflow',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			contractName: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'contractLog',
				field: 'contractName',
				label: 'Contract name',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			profile: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'contractLog',
				field: 'profile',
				label: 'Profile',
				dataType: 'select',
				dataSource: 'contractLog.profile.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'Profile.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {},
				messages: {required: 'This field is required'}
			}),
			ipAddress: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'contractLog',
				field: 'ipAddress',
				label: 'IP address',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			memUsage: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'contractLog',
				field: 'memUsage',
				label: 'Memory usage ',
				dataType: 'text',
				rules: {required: true},
				messages: {required: 'This field is required'}
			})
		},

		ExecuteLog: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'executeLog',
				field: 'id',
				label: 'Audit Id',
				rules: {required: false}
			}),
			workFlow: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'executeLog',
				field: 'workFlow',
				label: 'Workflow',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			contractName: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'executeLog',
				field: 'contractName',
				label: 'Contract name',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			profile: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'executeLog',
				field: 'profile',
				label: 'Profile',
				dataType: 'select',
				dataSource: 'executeLog.profile.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'Profile.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {},
				messages: {required: 'This field is required'}
			}),
			ipAddress: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'executeLog',
				field: 'ipAddress',
				label: 'IP address',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			memUsage: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'executeLog',
				field: 'memUsage',
				label: 'Memory usage ',
				dataType: 'text',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			result: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'executeLog',
				field: 'result',
				label: 'Result',
				dataType: 'text',
				rules: {maxlength: 30, required: true},
				messages: {required: 'This field is required'}
			}),
			requestPacket: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'executeLog',
				field: 'requestPacket',
				label: 'Request packet',
				dataType: 'textarea',
				rules: {required: true},
				messages: {required: 'This field is required'}
			})
		},

		AccessLog: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'accessLog',
				field: 'id',
				label: 'Audit Id',
				rules: {required: false}
			}),
			url: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'accessLog',
				field: 'url',
				label: 'URL',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			profile: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'accessLog',
				field: 'profile',
				label: 'Profile',
				dataType: 'select',
				dataSource: 'accessLog.profile.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'Profile.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {},
				messages: {required: 'This field is required'}
			}),
			ipAddress: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'accessLog',
				field: 'ipAddress',
				label: 'IP address',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			})
		},

		Report: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'report',
				field: 'id',
				label: 'ReportBuilder Id',
				rules: {required: false}
			}),
			reportName: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'report',
				field: 'reportName',
				label: 'Report name',
				dataType: 'text',
				rules: {maxlength: 200, required: true},
				messages: {required: 'This field is required'}
			}),
			baseEntityMeta: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'report',
				field: 'baseEntityMeta',
				label: 'Base report table',
				dataType: 'select',
				dataSource: 'report.baseEntityMeta.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'ReportBuilder',
					task: 'Meta.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			reportMode: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'report',
				field: 'reportMode',
				label: 'reportMode',
				dataType: 'text',
				rules: {},
				messages: {required: 'This field is required'}
			}),
			reportDql: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'report',
				field: 'reportDql',
				label: 'DQL',
				dataType: 'textarea',
				rules: {required: false},
				messages: {required: 'This field is required'}
			}),
			reportJoins: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'report',
				field: 'reportJoins',
				label: 'Joins',
				dataType: 'textarea',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			staticSearchFields: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'report',
				field: 'staticSearchFields',
				label: 'Static search fields',
				dataType: 'textarea',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			dynamicSearchFields: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'report',
				field: 'dynamicSearchFields',
				label: 'Dynamic search fields',
				dataType: 'textarea',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			orderBy: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'report',
				field: 'orderBy',
				label: 'Order by',
				dataType: 'textarea',
				rules: {required: false},
				messages: {required: 'This field is required'}
			})
		},

		UnBlackList: {
			ipAddress: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'user',
				field: 'ipAddress',
				label: 'IP address',
				dataType: 'select',
				dataSource: 'loginFailures',
				dataQuery: false,
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			confirm: $.extend(true, {}, _App.DataElement.prototype.Checkbox, {
				namespace: 'user',
				field: 'confirmUnBlacklist',
				label: 'Yes, I\'m sure',
				dataType: 'checkbox',
				rules: {required: false},
				messages: {}
			}),
		},
		PermissionGroup: {
			select: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'permissionGroup',
				field: 'name',
				label: 'Select group to edit',
				dataType: 'select',
				dataSource: 'permissiongroup.select',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'PermissionGroup.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			permissionLevel: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'permissionGroup',
				field: 'permissionLevel',
				label: 'Permission level',
				dataType: 'select',
				dataSource: 'permissiongroup.permissionLevel',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'PermissionGroup.GetPermissionLevels',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: "This field is required"}
			})
		},

		Profile: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'profile',
				field: 'id',
				label: 'Profile Id',
				rules: {required: false}
			}),
			permissionGroup: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'profile',
				field: 'permissionGroup',
				label: 'Permissions *',
				dataType: 'select',
				dataSource: 'profile.permissionGroup.select',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'PermissionGroup.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			permissionLevel: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'profile',
				field: 'permissionLevel',
				label: 'Permission level',
				dataType: 'select',
				dataSource: 'profile.permissionLevel',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'PermissionGroup.GetPermissionLevels',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			permissions: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'profile',
				field: 'permissions',
				label: 'Permissions',
				dataType: 'select',
				dataSource: 'permissions',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'Permissions.FullSelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			department: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'profile',
				field: 'department',
				label: 'Department',
				dataType: 'select',
				dataSource: 'departments',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'Department.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			username: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'profile',
				field: 'username',
				label: 'Username',
				dataType: 'text',
				rules: {
					minlength: 3, maxlength: 100, required: true, create: {
						remote: {
							url: "/workspace/check-unique-username",
							type: "post"
						}
					}
				},
				messages: {required: "This field is required"}
			}),
			firstName: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'profile',
				field: 'firstName',
				label: 'Name',
				dataType: 'text',
				rules: {minlength: 3, maxlength: 100, required: true},
				messages: {required: "This field is required"}
			}),
			familyName: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'profile',
				field: 'familyName',
				label: 'Surname',
				dataType: 'text',
				rules: {minlength: 3, maxlength: 100, required: true},
				messages: {required: "This field is required"}
			}),
			email: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'profile',
				inputType: 'email',
				field: 'email',
				label: 'Email',
				rules: {
					maxlength: 255, email: true, required: true, create: {
						remote: {
							url: "/workspace/check-unique-email",
							type: "post"
						}
					}
				}
			}),
			mobile: $.extend(true, {}, _App.DataElement.prototype.Mobile, {
				namespace: 'profile',
				field: 'mobile',
				label: 'Mobile number',
				dataType: 'text',
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			jobState: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'profile',
				field: 'jobState',
				label: 'Status',
				dataSource: 'userstatuses',
				dataList: [
					{value: 'Active', label: 'Active'},
					{value: 'Suspended', label: 'Suspended'},
					{value: 'Archived', label: 'Archived'}
				],
				rules: {required: true},
				messages: {required: "This field is required"}
			})
		},

		Department: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'department',
				field: 'id',
				label: 'User Id',
				rules: {required: false}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'department',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 150, required: true},
				messages: {required: 'This field is required'}
			})
		},

		BusinessRule: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'businessRule',
				field: 'id',
				label: 'BusinessRule Id',
				rules: {required: false}
			}),
			owner: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'businessRule',
				field: 'owner',
				label: 'Owner',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'businessRule',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 50, required: true},
				messages: {required: 'This field is required'}
			}),
			dealType: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'businessRule',
				field: 'dealType',
				label: 'Deal type',
				dataType: 'select2',
				dataSource: 'businessRule.dealtypes',
				dataList: [
					{value: 'Pre-paid', label: 'Pre-paid'},
					{value: 'Post paid', label: 'Post paid'}
				],
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			description: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'businessRule',
				field: 'description',
				label: 'Description',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			metaData: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'businessRule',
				field: 'metaData',
				label: 'Meta',
				dataType: 'textarea',
				rules: {required: true},
				messages: {required: 'This field is required'}
			})
		},

		Calculation: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'calculation',
				field: 'id',
				label: 'Calculation Id',
				rules: {required: false}
			}),
			priority: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'calculation',
				field: 'priority',
				label: 'Order',
				rules: {required: true}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'calculation',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			description: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'calculation',
				field: 'description',
				label: 'Description',
				dataType: 'text',
				rules: {maxlength: 250},
				messages: {required: 'This field is required'}
			}),
			dealType: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'calculation',
				field: 'dealType',
				label: 'Deal type',
				dataType: 'select2',
				dataSource: 'calculation.dealtypes',
				dataList: [
					{value: 'Pre-paid', label: 'Pre-paid'},
					{value: 'Post paid', label: 'Post paid'}
				],
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			dealCategory: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'calculation',
				field: 'dealCategory',
				label: 'Deal category',
				dataType: 'select2',
				dataSource: 'dealcategories',
				dataList: [
					{value: 'Device', label: 'Device'},
					{value: 'Data', label: 'Data'}
				],
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			inputFields: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'calculation',
				field: 'inputFields',
				label: 'Input Fields',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			transformations: $.extend(true, {}, _App.DataElement.prototype.Collection, {
				namespace: 'calculation',
				field: 'transformations',
				label: 'Transformations',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			})
		},

		DelegationHost: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'delegationHost',
				field: 'id',
				label: 'Delegation Id',
				rules: {required: false}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationHost',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			module: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationHost',
				field: 'module',
				label: 'Module',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			entityBase: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationHost',
				field: 'entityBase',
				label: 'Entity Name',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			entity: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationHost',
				field: 'entity',
				label: 'Full Entity Name',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			initStatus: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationHost',
				field: 'initStatus',
				label: 'DOA init status',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			})
		},

		DelegationGroup: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'delegationGroup',
				field: 'id',
				label: 'Delegation Id',
				rules: {required: false}
			}),
			delegationHost: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'delegationGroup',
				field: 'delegationHost',
				label: 'Delegation host',
				dataType: 'select',
				dataSource: 'delegationGroup.delegationHost.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Delegation',
					task: 'DelegationHost.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationGroup',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			})
		},

		DelegationGroupUser: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'delegationGroupUser',
				field: 'id',
				label: 'Delegation Id',
				rules: {required: false}
			}),
			delegationGroup: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'delegationGroupUser',
				field: 'delegationGroup',
				label: 'Delegation group',
				dataType: 'select',
				dataSource: 'delegationGroupUser.delegationGroup.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Delegation',
					task: 'DelegationGroup.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			profile: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'delegationGroupUser',
				field: 'profile',
				label: 'User',
				dataType: 'select',
				dataSource: 'delegationGroupUser.profile.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'Profile.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			})
		},

		DelegationRule: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'delegationRule',
				field: 'id',
				label: 'Delegation Id',
				rules: {required: false}
			}),
			delegationHost: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'delegationRule',
				field: 'delegationHost',
				label: 'Delegation host',
				dataType: 'select',
				dataSource: 'delegationRule.delegationHost.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Delegation',
					task: 'DelegationHost.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			delegationGroup: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'delegationRule',
				field: 'delegationGroup',
				label: 'Delegation group',
				dataType: 'select',
				dataSource: 'delegationGroup.delegationGroup.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Delegation',
					task: 'DelegationGroup.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationRule',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 150, required: true},
				messages: {required: 'This field is required'}
			}),
			message: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'delegationRule',
				field: 'message',
				label: 'Assignment message',
				dataType: 'text',
				rules: {},
				messages: {required: 'This field is required'}
			}),
			status: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationRule',
				field: 'status',
				label: 'Status',
				dataType: 'text',
				rules: {maxlength: 20},
				messages: {required: 'This field is required'}
			})
		},

		DelegationMessage: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'delegationMessage',
				field: 'id',
				label: 'Delegation Id',
				rules: {required: false}
			}),
			delegationHost: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'delegationMessage',
				field: 'delegationHost',
				label: 'Delegation host',
				dataType: 'select',
				dataSource: 'delegationMessage.delegationHost.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Delegation',
					task: 'DelegationHost.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationMessage',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			message: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'delegationMessage',
				field: 'message',
				label: 'Message',
				dataType: 'textarea',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			entityNames: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'delegationMessage',
				field: 'entityNames',
				label: 'Entity names',
				dataType: 'textarea',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			inputFields: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'delegationMessage',
				field: 'inputFields',
				label: 'Input fields',
				dataType: 'textarea',
				rules: {required: true},
				messages: {required: 'This field is required'}
			})
		},

		DelegationItem: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'delegationItem',
				field: 'id',
				label: 'Delegation Id',
				rules: {required: false}
			}),
			delegationHost: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'delegationItem',
				field: 'delegationHost',
				label: 'Delegation host',
				disabled: true,
				dataType: 'select',
				dataSource: 'delegationItem.delegationHost.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Delegation',
					task: 'DelegationHost.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			delegationGroup: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'delegationItem',
				field: 'delegationGroup',
				label: 'Delegation group',
				disabled: true,
				dataType: 'select',
				dataSource: 'delegationItem.delegationGroup.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Delegation',
					task: 'DelegationGroup.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			delegationRule: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'delegationItem',
				field: 'delegationRule',
				label: 'Delegation rule',
				disabled: true,
				dataType: 'select',
				dataSource: 'delegationItem.delegationRule.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Delegation',
					task: 'DelegationRule.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			itemId: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'delegationItem',
				field: 'itemId',
				label: 'Item ID',
				disabled: true,
				dataType: 'text',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationItem',
				field: 'name',
				label: 'Name',
				disabled: true,
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			description: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationItem',
				field: 'description',
				label: 'Description',
				disabled: true,
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			escalationLevel: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'delegationItem',
				field: 'escalationLevel',
				label: 'Escalation level',
				disabled: true,
				dataType: 'text',
				rules: {},
				messages: {required: 'This field is required'}
			}),
			escalationDeadline: $.extend(true, {}, _App.DataElement.prototype.Date, {
				namespace: 'delegationItem',
				field: 'escalationDeadline',
				label: 'Escalation deadline',
				disabled: true,
				rules: {},
				messages: {required: 'This field is required'}
			}),
			declineReason: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'delegationItem',
				field: 'declineReason',
				label: 'Decline reason',
				dataType: 'text',
				rules: {maxlength: 250},
				messages: {required: 'This field is required'}
			}),
			previousState: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'delegationItem',
				field: 'previousState',
				label: 'Previous status',
				disabled: true,
				dataType: 'text',
				rules: {maxlength: 50},
				messages: {required: 'This field is required'}
			}),
			stateChanged: $.extend(true, {}, _App.DataElement.prototype.Date, {
				namespace: 'delegationItem',
				field: 'stateChanged',
				label: 'Status changed',
				disabled: true,
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			jobState: {
				dataList: [
					{value: 'Pending', label: 'Pending'},
					{value: 'Approved', label: 'Approved'},
					{value: 'Declined', label: 'Declined'},
					{value: 'Cancelled', label: 'Cancelled'}
				]
			}
		},

		EscalationItem: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'escalationItem',
				field: 'id',
				label: 'Escalation Id',
				rules: {required: false}
			}),
			escalationHost: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'escalationItem',
				field: 'escalationHost',
				label: 'Escalation host',
				dataType: 'select',
				dataSource: 'escalationItem.escalationHost.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Escalation',
					task: 'EscalationHost.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			escalationRule: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'escalationItem',
				field: 'escalationRule',
				label: 'Escalation rule',
				dataType: 'select',
				dataSource: 'escalationItem.escalationRule.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Escalation',
					task: 'EscalationRule.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			itemId: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'escalationItem',
				field: 'itemId',
				label: 'Item ID',
				dataType: 'text',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationItem',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			description: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationItem',
				field: 'description',
				label: 'Description',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			escalationLevel: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'escalationItem',
				field: 'escalationLevel',
				label: 'Escalation level',
				dataType: 'text',
				rules: {},
				messages: {required: 'This field is required'}
			}),
			escalationDeadline: $.extend(true, {}, _App.DataElement.prototype.Date, {
				namespace: 'escalationItem',
				field: 'escalationDeadline',
				label: 'Escalation deadline',
				rules: {},
				messages: {required: 'This field is required'}
			})
		},

		EscalationHost: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'escalationHost',
				field: 'id',
				label: 'Escalation Id',
				rules: {required: false}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationHost',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			module: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationHost',
				field: 'module',
				label: 'Module',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			entityBase: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationHost',
				field: 'entityBase',
				label: 'Entity Name',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			entity: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationHost',
				field: 'entity',
				label: 'Full Entity Name',
				dataType: 'text',
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			assignmentField: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationHost',
				field: 'assignmentField',
				label: 'Assignment Field',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			}),
			displayStateField: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationHost',
				field: 'displayStateField',
				label: 'Display-state Field',
				dataType: 'text',
				rules: {maxlength: 100, required: true},
				messages: {required: 'This field is required'}
			})
		},

		EscalationRule: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'escalationRule',
				field: 'id',
				label: 'Escalation Id',
				rules: {required: false}
			}),
			escalationHost: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'escalationRule',
				field: 'escalationHost',
				label: 'Escalation host',
				dataType: 'select',
				dataSource: 'escalationRule.escalationHost.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'Escalation',
					task: 'EscalationHost.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationRule',
				field: 'name',
				label: 'Name',
				dataType: 'text',
				rules: {maxlength: 150, required: true},
				messages: {required: 'This field is required'}
			}),
			targetState: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'escalationRule',
				field: 'targetState',
				label: 'Target status',
				dataType: 'select',
				dataSource: 'EscalationRule.HostStatus.List',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			escalationLevel: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'escalationRule',
				field: 'escalationLevel',
				label: 'Escalation level',
				dataType: 'text',
				rules: {},
				messages: {required: 'This field is required'}
			}),
			timeUnit: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'escalationRule',
				field: 'timeUnit',
				label: 'Time measure',
				dataType: 'select',
				dataSource: 'EscalationRule.TimeUnit.List',
				dataList: [
					{value: 'minutes', label: 'Minutes'},
					{value: 'hours', label: 'Hours'},
					{value: 'days', label: 'Days'},
				],
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			numUnits: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'escalationRule',
				field: 'numUnits',
				label: 'Time units',
				dataType: 'text',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			assignmentId: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'escalationRule',
				field: 'assignmentId',
				label: 'Assign to',
				dataType: 'select',
				dataSource: 'EscalationRule.HostAssignment.List',
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			assignmentLabel: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationRule',
				field: 'assignmentLabel',
				label: 'Assign to',
				dataType: 'text',
				disabled: true,
				rules: {maxlength: 250, required: true},
				messages: {required: 'This field is required'}
			}),
			displayStateValue: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'escalationRule',
				field: 'displayStateValue',
				label: 'New status',
				dataType: 'select',
				dataSource: 'EscalationRule.HostStatus.List',
				rules: {maxlength: 50, required: true},
				messages: {required: 'This field is required'}
			}),
			emailTo: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'escalationRule',
				field: 'emailTo',
				label: 'Email to',
				dataType: 'text',
				rows: 3,
				rules: {maxlength: 1000, required: false},
				messages: {required: 'This field is required'}
			}),
			message: $.extend(true, {}, _App.DataElement.prototype.TextArea, {
				namespace: 'escalationRule',
				field: 'message',
				label: 'Escalation message',
				dataType: 'text',
				rows: 6,
				rules: {maxlength: 1000, required: false},
				messages: {required: 'This field is required'}
			}),
			status: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'escalationRule',
				field: 'status',
				label: 'Status',
				dataType: 'text',
				rules: {maxlength: 20},
				messages: {required: 'This field is required'}
			})
		},

		Meta: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'meta',
				field: 'id',
				label: 'Company Id',
				rules: {required: false}
			}),
			project: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'meta',
				field: 'project',
				label: 'Project',
				dataSource: 'projects',
				dataQuery: {
					isStatic: true,
					workspace: 'Construct',
					task: 'Project.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true}
			}),
			module: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'meta',
				field: 'module',
				label: 'Module',
				dataSource: 'modules',
				dataQuery: {
					isStatic: true,
					workspace: 'Construct',
					task: 'Module.SelectList',
					jobId: null,
					data: {
						Filter: {
							project: _App.prototype.projectId
						}
					},
					options: {},
					callback: null
				},
				rules: {required: true}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'meta',
				field: 'name',
				label: 'Name',
				rules: {required: true, maxlength: 100}
			}),
			type: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'meta',
				field: 'type',
				label: 'Type',
				rules: {required: true, maxlength: 100}
			}),
			subType: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'meta',
				field: 'subType',
				label: 'Sub Type',
				rules: {required: true, maxlength: 100}
			}),
			description: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'meta',
				field: 'description',
				label: 'Description',
				rules: {required: false, maxlength: 100}
			}),
			data: $.extend(true, {}, _App.DataElement.prototype.Textarea, {
				namespace: 'meta',
				field: 'data',
				label: 'Data',
				rules: {required: true, maxlength: 65000}
			}),
			created: $.extend(true, {}, _App.DataElement.prototype.Date, {
				namespace: 'meta',
				field: 'created',
				label: 'Created',
				rules: {required: false}
			}),
			updated: $.extend(true, {}, _App.DataElement.prototype.Date, {
				namespace: 'meta',
				field: 'updated',
				label: 'Updated',
				rules: {required: false}
			})
		},

		DocumentCategory: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'documentCategory',
				field: 'id',
				label: 'Document Category Id',
				rules: {required: false}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'documentCategory',
				field: 'name',
				label: 'Name',
				rules: {required: true, maxlength: 100},
				messages: {required: 'This field is required'}
			}),
			created: $.extend(true, {}, _App.DataElement.prototype.Date, {
				namespace: 'documentCategory',
				field: 'created',
				label: 'Created',
				rules: {required: false}
			}),
			updated: $.extend(true, {}, _App.DataElement.prototype.Date, {
				namespace: 'documentCategory',
				field: 'updated',
				label: 'Updated',
				rules: {required: false}
			})
		},

		DocumentRepo: {
			id: $.extend(true, {}, _App.DataElement.prototype.Number, {
				namespace: 'documentRepo',
				field: 'id',
				label: 'Document Category Id',
				rules: {required: false}
			}),
			profile: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'documentRepo',
				field: 'profile',
				label: 'Profile',
				dataType: 'select',
				dataSource: 'documentRepo.profile.selectlist',
				dataQuery: {
					isStatic: false,
					workspace: 'User',
					task: 'Profile.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {},
				messages: {}
			}),
			documentCategory: $.extend(true, {}, _App.DataElement.prototype.Reference, {
				namespace: 'documentRepo',
				field: 'documentCategory',
				label: 'Category',
				dataSource: 'documentRepo.categories',
				dataQuery: {
					isStatic: true,
					workspace: 'DocumentRepo',
					task: 'DocumentCategory.SelectList',
					jobId: null,
					data: {},
					options: {},
					callback: null
				},
				rules: {required: true},
				messages: {required: 'This field is required'}
			}),
			document: $.extend(true, {}, _App.DataElement.prototype.Document, {
				namespace: 'documentRepo',
				field: 'document',
				label: 'Document',
				fileTypes: ['txt', 'docx', 'doc', 'xls', 'jpg', 'jpeg', 'png', 'bmp', 'tiff'],
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			name: $.extend(true, {}, _App.DataElement.prototype.String, {
				namespace: 'documentRepo',
				field: 'name',
				label: 'Name',
				rules: {required: true, maxlength: 100},
				messages: {required: 'This field is required'}
			}),
			tags: $.extend(true, {}, _App.DataElement.prototype.Tags, {
				namespace: 'documentRepo',
				field: 'tags',
				label: 'Tags',
				rules: {required: false, maxlength: 250}
			}),
			jobState: $.extend(true, {}, _App.DataElement.prototype.DataList, {
				namespace: 'documentRepo',
				field: 'jobState',
				label: 'Status',
				dataSource: 'documentRepo.statusList',
				dataList: [
					{value: 'Active', label: 'Active'},
					{value: 'Archived', label: 'Archived'}
				],
				rules: {required: true},
				messages: {required: "This field is required"}
			}),
			created: $.extend(true, {}, _App.DataElement.prototype.Date, {
				namespace: 'documentRepo',
				field: 'created',
				label: 'Created',
				rules: {required: false}
			}),
			updated: $.extend(true, {}, _App.DataElement.prototype.Date, {
				namespace: 'documentRepo',
				field: 'updated',
				label: 'Updated',
				rules: {required: false}
			})
		},

		/* ConStruct::Append */

	};

})();