;
(function ()
{

	_App.Controller = function (args)
	{
		this.initialize(args);
	};

	_App.Controller.prototype =
	{

		currentPage: null,
		currentSection: {},
		onClose: {},
		formTemplate: {},
		widgetParams: {},
		formParams: {},
		gridParams: {},

		initialize: function (args)
		{
			for (var key in args)
			{
				this[key] = args[key];
			}

			this.getElems();
			this.setupScrollListener();
			$('#frmModal').on('hidden.bs.modal', $.proxy(function ()
			{
				if (this.onClose.modalFormContent
				    && this.onClose.modalFormContent[this.formTemplate])
				{
					this.onClose.modalFormContent[this.formTemplate]();
					delete this.onClose.modalFormContent[this.formTemplate];
				}
				if (this.currentSection.modalFormContent)
				{
					var prevSection = this.currentSection.modalFormContent;
					App.Event.trigger('Controller.RemovingSection:' + prevSection, {"sectionName": prevSection});
					_t[prevSection].remove();
					$('#modalFormContent').removeClass(prevSection);
					this.currentSection.modalFormContent = null;
				}
				_w.openForm = false;
				if (_w.onFormClose)
				{
					setTimeout(function ()
					{
						_w.onFormClose();
					}, 1000);
				}
			}, this));
		},

		getElems: function ()
		{
			this.$_head = $('head');
			this.$_body = $('body');
			this.$_htmlBody = $('html, body');
			this.$_navAnchors = $('#Header .nav a').map(function (i, a) { return $(a); });
		},

		changePage: function (section, pageName)
		{
			section = section.replaceAll('-', '');
			pageName = pageName.replaceAll('-', '');
			App.Event.trigger('Controller.LoadingTemplate:' + pageName, {"pageName": pageName});
			var prevPage = this.currentPage;
			this.currentPage = pageName || '';
			App.activePage = false;
			if (_t[prevPage])
			{
				App.Event.trigger('Controller.RemovingPage:' + prevPage, {"pageName": prevPage});
				_t[prevPage].remove();
				this.$_body.removeClass(prevPage);
			}
			App.Template.register(
				pageName, section, pageName, 'PageContent', {},
				$.proxy(this.renderPage, this)
			);
		},

		renderPage: function (id, pageName)
		{
			this.$_body.addClass(pageName);
			_t[pageName].publish();
			App.Event.trigger(
				'Controller.Published:' + pageName,
				{"id": "page", "pageName": pageName}
			);
			//this.$_el.removeClass('loading');
			this.$_htmlBody.animate({
				'scrollTop': 0
			}, 250);
			this.$_body.addClass(pageName);
			App.activePage = pageName;
		},

		loadGrid: function (containerName, title, section, template, params, options, onClose)
		{
			container = App.Container.get(containerName);
			section = section.replaceAll('-', '');
			template = template.replaceAll('-', '');
			if (!this.gridParams[template])
			{
				this.gridParams[template] = {};
			}
			this.gridParams[template] = (undefined == params)
				? {}
				: params;
			container.setTitle(title);
			container.show(options);
			this.formTemplate = template;
			if (!this.onClose[container.contentTarget])
			{
				this.onClose[container.contentTarget] = {};
			}
			if (onClose)
			{
				this.onClose[container.contentTarget][template] = onClose;
			}
			this.changeSection(containerName, container.contentTarget, section, template);
		},

		loadForm: function (containerName, title, section, template, params, options, onClose)
		{
			$('.btn[data-role="end"]').click();
			_w.openForm = containerName;
			_w.onFormClose = false;
			container = App.Container.get(containerName);
			section = section.replaceAll('-', '');
			template = template.replaceAll('-', '');
			if (!this.formParams[template])
			{
				this.formParams[template] = {};
			}
			this.formParams[template] = (undefined == params)
				? {}
				: params;
			container.setTitle(title);
			container.show(options);
			this.formTemplate = template;
			if (!this.onClose[container.contentTarget])
			{
				this.onClose[container.contentTarget] = {};
			}
			if (onClose)
			{
				this.onClose[container.contentTarget][template] = onClose;
			}
			this.changeSection(containerName, container.contentTarget, section, template, onClose);
		},

		closeForm: function (container, message)
		{
			container = App.Container.get(container);
			if (message)
			{
				if ('Success' == message)
				{
					_w.alert('Success', 'Changes successfully saved.', 'success');
				}
				if ('Cancel' == message)
				{
					_w.alert('Success', 'Changes cancelled.', 'info');
				}
			}
			if (this.onClose[container.contentTarget]
			    && this.onClose[container.contentTarget][this.formTemplate])
			{
				this.onClose[container.contentTarget][this.formTemplate]();
				delete this.onClose[container.contentTarget][this.formTemplate];
			}
			container.hide();
			if (this.currentSection[container.contentTarget])
			{
				var prevSection = this.currentSection[container.contentTarget];
				App.Event.trigger('Controller.RemovingSection:' + prevSection, {"sectionName": prevSection});
				_t[prevSection].remove();
				this.currentSection[container.contentTarget] = null;
			}
		},

		changeSection: function (containerName, target, section, sectionName, onClose, force)
		{
			section = section.replaceAll('-', '');
			sectionName = sectionName.replaceAll('-', '');
			App.Event.trigger('Controller.LoadingTemplate:' + sectionName, {"sectionName": sectionName});
			if (!this.currentSection)
			{
				this.currentSection = {};
			}
			var prevSection = this.currentSection[target]
				? this.currentSection[target]
				: null;
			if (!force && prevSection == sectionName)
			{
				return;
			}
			this.currentSection[target] = sectionName || '';

			if (_t[prevSection])
			{
				if (this.onClose[target][sectionName])
				{
					this.onClose[target][sectionName]();
					delete this.onClose[target][sectionName];
				}
				App.Event.trigger('Controller.RemovingSection:' + prevSection, {"sectionName": prevSection});
				_t[prevSection].remove();
				$('#' + target).removeClass(prevSection);
			}
			App.Template.register(
				sectionName, section, sectionName, 'SectionContent', {},
				$.proxy(this.renderSection, this, target, containerName)
			);
			if (!this.onClose[target])
			{
				this.onClose[target] = {};
			}
			if (onClose)
			{
				this.onClose[target][sectionName] = onClose;
			}
		},

		renderSection: function (target, containerName, id, sectionName)
		{
			if (undefined != this.widgetParams[sectionName])
			{
				_t[sectionName].template.params = this.widgetParams[sectionName];
			}
			_t[sectionName].publish(target);
			_t[sectionName].container = containerName;
			App.Event.trigger(
				'Controller.Published:' + sectionName,
				{"id": "section", "sectionName": sectionName}
			);
		},

		closeSection: function (target, sectionName, callback)
		{
			sectionName = sectionName.replaceAll('-', '');
			if (undefined != this.widgetParams[sectionName])
			{
				delete this.widgetParams[sectionName];
			}
			var prevSection = this.currentSection[target]
				? this.currentSection[target]
				: null;

			delete this.currentSection[target];

			if (_t[prevSection])
			{
				if (this.onClose[target][sectionName])
				{
					this.onClose[target][sectionName]();
					delete this.onClose[target][sectionName];
				}
				App.Event.trigger('Controller.RemovingSection:' + prevSection, {"sectionName": prevSection});
				_t[prevSection].remove();
				$('#' + target).removeClass(prevSection);
			}
			if (undefined != callback)
			{
				callback();
			}
		},

		setupScrollListener: function ()
		{
			$(window).on('scroll', function ()
			{
				if ($(window).scrollTop() > 50)
				{
					$('#Header').addClass('compressed');
				}
				else
				{
					$('#Header').removeClass('compressed');
				}
			});
		}

	};

})();
