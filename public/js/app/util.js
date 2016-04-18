;
(function ()
{

	_App.Util = function ()
	{
		this.initialize();
	};

	_App.Util.prototype =
	{

		startupTime: 0,

		initialize: function ()
		{
			this.startupTime = this.unixTimestamp();
		},

		resetImageUploaderWidget: function (eid)
		{
			$('#' + eid).val('');
			$('#' + eid).removeClass('valid');
			$('#fileid_' + eid).val('');
			$('#btn_' + eid).attr('data-url', '');
			$('#btnDownload' + eid).hide();
			$('#btnDownload' + eid).attr('data-download', '');
		},

		formatDecimalDisplayValue: function (input)
		{
			var output = '' + input;
			output = "." == output.substring(0, 1)
				? '0' + output
				: output;
			return output;
		},

		formatMultipleStringCase: function (input)
		{
			var output = '' + input;
			return output.formatMultipleStringCase();
		},

		formatSingleStringCase: function (input)
		{
			var output = '' + input;
			return output.formatSingleStringCase();
		},

		enforceNumericInput: function (identity, signed)
		{
			$('#' + identity).keydown(function (evt)
			{
				var key = evt.keyCode || evt.which;

				/*
				 * Implement minus sign at front
				 */
				if (true === signed
				    && ('' == $('#' + identity).val()
				        || '-' != $('#' + identity).val().substring(0, 1))
				    && (109 == key || 189 == key))
				{
					$('#' + identity).val('-' + $('#' + identity).val());
					return false;
				}

				return (key >= 48 && key <= 57)
				       || (key >= 96 && key <= 105)
				       || 8 === key
				       || 9 === key
				       || 46 === key
				       || 110 === key
				       || 190 === key;
			});
		},

		buildReportsMenu: function (container, page, identifier, data, staticItems)
		{
			$(container).empty();
			for (var i in staticItems)
			{
				var subMenu = staticItems[i];
				switch (subMenu.type)
				{
					case 'head':
						$(container).append(
							App.Theme.Menu.MenuHeader
								.replaceAll('[eid]', 'mainmenu_' + subMenu.id)
								.replaceAll('[title]', subMenu.title)
						);
						break;
					case 'main':
						$(container).append(
							App.Theme.Menu.MenuMain
								.replaceAll('[eid]', 'mainmenu_' + subMenu.id)
								.replaceAll('[href]', subMenu.href)
								.replaceAll('[title]', subMenu.title)
								.replaceAll('href="#/false"', 'class="handy"')
						);
						break;
					case 'sub':
						$(container).append(
							App.Theme.Menu.MenuSub
								.replaceAll('[eid]', 'mainmenu_' + subMenu.id)
								.replaceAll('[href]', subMenu.href)
								.replaceAll('[title]', subMenu.title)
								.replaceAll('href="#/false"', 'class="handy"')
						);
						break;
				}
				/*$(container).append(
				 '<li><a href="/#/' + App.allowedSection + '/'
				 + staticItems[i].href + '">'
				 + staticItems[i].title + '</a></li>'
				 );*/
			}

			for (var i in data)
			{
				$(container).append(
					App.Theme.Menu.MenuSub
						.replaceAll('[eid]', 'mainmenu_' + data[i].id)
						.replaceAll('[href]', page + '?' + identifier + '=' + data[i].id)
						.replaceAll('[title]', data[i].reportName)
				);
				/*$(container).append(
				 '<li><a href="/#/' + App.allowedSection + '/'
				 + page + '?' + identifier + '=' + data[i].id + '">'
				 + data[i].reportName + '</a></li>'
				 );*/
			}
		},

		cleanHTML: function (input)
		{
			// 1. remove line breaks / Mso classes
			var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
			var output = input.replace(stringStripper, ' ');
			// 2. strip Word generated HTML comments
			var commentSripper = new RegExp('<!--(.*?)-->', 'g');
			var output = output.replace(commentSripper, '');
			var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
			// 3. remove tags leave content if any
			output = output.replace(tagStripper, '');
			// 4. Remove everything in between and including tags '<style(.)style(.)>'
			var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];

			for (var i = 0; i < badTags.length; i++)
			{
				tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
				output = output.replace(tagStripper, '');
			}
			// 5. remove attributes ' style="..."'
			var badAttributes = ['style', 'start'];
			for (var i = 0; i < badAttributes.length; i++)
			{
				var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
				output = output.replace(attributeStripper, '');
			}
			return output;
		},

		handleToolbarState: function (selector, activateCallback, deactivateCallback)
		{
			$(selector + ' button').each(function (i, elem)
			{
				App.Util.handleButtonState(elem, activateCallback, deactivateCallback);
			});
		},

		handleButtonState: function (selector, activateCallback, deactivateCallback)
		{
			$(selector).click($.proxy(function (activateCallback, deactivateCallback, evt)
			{
				if ($(evt.currentTarget).hasClass('active'))
				{
					$(evt.currentTarget).removeClass('active');
					if (deactivateCallback)
					{
						deactivateCallback($(evt.currentTarget).attr('data-deactivate'));
					}
				}
				else
				{
					if ($(evt.currentTarget).parent().find('button.active').length)
					{
						return;
					}
					$(evt.currentTarget).addClass('active');
					if (activateCallback)
					{
						activateCallback($(evt.currentTarget).attr('data-activate'));
					}
				}
			}, this, activateCallback, deactivateCallback));
		},

		unixTimestamp: function ()
		{
			return Math.round((new Date().getTime() / 1000));
		},

		getUrlParam: function (name)
		{
			hashLoc = window.location.hash.split("?");
			var ret = decodeURI(
				(RegExp(name + '=' + '(.+?)(&|$)').exec(hashLoc[1]) || [,])[1]
			);
			return ('undefined' == ret)
				? null
				: ret;
		},

		ie: (function ()
		{
			var undef,
			    v = 3,
			    div = document.createElement('div'),
			    all = div.getElementsByTagName('i');
			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
					all[0]
				)
			{
				;
			}
			return v > 4
				? v
				: undef;
		}()),

		updateCheckboxStyle: function ($_checkbox)
		{
			if ($_checkbox.hasClass('no-mod'))
			{
				return;
			}
			$_checkbox.addClass('no-mod');
			var label = $_checkbox.parent('label');
			if (label.length)
			{
				$(label).addClass('checkbox');
			}
			else
			{
				$_checkbox.wrap('<label class="checkbox"/>');
			}
			$('<span class="styled-checkbox" />').insertAfter($_checkbox);
			if (!!this.ie && this.ie < 9)
			{
				$_checkbox.set_checked = function ()
				{
					if (this.checked)
					{
						form.find('input[name="' + this.name + '"] + span').removeClass('checked');
						$(this).next('span').addClass('checked').blur();
					}
				};
				$_checkbox.set_checked();
				$_checkbox.bind('change', function ()
				{
					this.set_checked();
				});
			}
			if ($_checkbox.value == 'on')
			{
				$_checkbox.value = true;
			}
		},

		updateCheckboxStyles: function (form)
		{
			var $$_checkboxes = form.find('input[type=checkbox]');
			$.each($$_checkboxes, function (i, checkbox)
			{
				var $_checkbox = $(checkbox);
				if ($_checkbox.hasClass('no-mod'))
				{
					return;
				}
				var label = $_checkbox.parent('label');
				if (label.length)
				{
					$(label).addClass('checkbox');
				}
				else
				{
					$_checkbox.wrap('<label class="checkbox"/>');
				}
				$('<span class="styled-checkbox" />').insertAfter($_checkbox);
				if (!!this.ie && this.ie < 9)
				{
					checkbox.set_checked = function ()
					{
						if (this.checked)
						{
							form.find('input[name="' + this.name + '"] + span').removeClass('checked');
							$(this).next('span').addClass('checked').blur();
						}
					};
					checkbox.set_checked();
					$_checkbox.bind('change', function ()
					{
						this.set_checked();
					});
				}
				if (checkbox.value == 'on')
				{
					checkbox.value = true;
				}
			});
		},

		calculateTimeLeft: function (value, numDays, endDate)
		{
			var dateTime = value.split(' '),
			    date = dateTime[0],
			    time = dateTime[1],
			    dateParts = date.split('-').map(function (part)
			    {
				    return parseInt(part, 10);
			    }),
			    timeParts = time.split(':').map(function (part)
			    {
				    return parseInt(part, 10);
			    });
			var currentDateTime = new Date();
			if (endDate)
			{
				var dateTime = endDate.split(' '),
				    date = dateTime[0],
				    time = dateTime[1],
				    dateParts = date.split('-').map(function (part)
				    {
					    return parseInt(part, 10);
				    }),
				    timeParts = time.split(':').map(function (part)
				    {
					    return parseInt(part, 10);
				    });
				var expireDateTime = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
			}
			else
			{
				var dateTime = value.split(' '),
				    date = dateTime[0],
				    time = dateTime[1],
				    dateParts = date.split('-').map(function (part)
				    {
					    return parseInt(part, 10);
				    }),
				    timeParts = time.split(':').map(function (part)
				    {
					    return parseInt(part, 10);
				    });
				var expireDateTime = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
				expireDateTime.setDate(expireDateTime.getDate() + numDays);
			}
			var difference = expireDateTime.getTime() - currentDateTime.getTime();
			var daysDifference, hoursDifference, minutesDifference;

			daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
			difference -= daysDifference * 1000 * 60 * 60 * 24;
			hoursDifference = Math.floor(difference / 1000 / 60 / 60);
			difference -= hoursDifference * 1000 * 60 * 60;
			minutesDifference = Math.floor(difference / 1000 / 60);
			difference -= minutesDifference * 1000 * 60;

			if (expireDateTime.getTime() < currentDateTime.getTime())
			{
				return '0m';
			}

			return daysDifference > 0
				? daysDifference + 'd, ' + hoursDifference + 'h, ' + minutesDifference + 'm'
				: hoursDifference + 'h, ' + minutesDifference + 'm';
		},

		updateClock: function ()
		{
			var currentTime = new Date();
			var currentHours = currentTime.getHours();
			var currentMinutes = currentTime.getMinutes();
			var currentSeconds = currentTime.getSeconds();
			currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
			currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
			currentHours = ( currentHours == 0 ) ? 12 : currentHours;
			var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds;
			$("#clock").html(currentTimeString);
		},

		setCookie: function (name, value, days)
		{
			if (days)
			{
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				var expires = "; expires=" + date.toGMTString();
			}
			else
			{
				var expires = "";
			}
			document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
		},

		getCookie: function (name, defaultValue)
		{
			var nameEQ = escape(name) + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++)
			{
				var c = ca[i];
				while (c.charAt(0) == ' ')
				{
					c = c.substring(1, c.length);
				}
				if (c.indexOf(nameEQ) == 0)
				{
					return unescape(c.substring(nameEQ.length, c.length));
				}
			}
			return undefined == defaultValue
				? null
				: defaultValue;
		},

		htmlEncode: function (value)
		{
			return ('string' == typeof value)
				? value.htmlEncode()
				: value;
		},

		htmlDecode: function (value)
		{
			return ('string' == typeof value)
				? value.htmlDecode()
				: value;
		}

	};

	/*
	 * Make sure we have the browser functionality available from previous versions.
	 */
	if (!jQuery.browser)
	{
		jQuery.browser = {};
		(function ()
		{
			jQuery.browser.msie = false;
			jQuery.browser.version = 0;
			if (navigator.userAgent.match(/MSIE ([0-9]+)\./))
			{
				jQuery.browser.msie = true;
				jQuery.browser.version = RegExp.$1;
			}
		})();
	}

	//-------------------------------------------------------- FUNCTION EXTENSIONS
	Function.prototype.scope = function (scope)
	{
		var callee = this,
		    args = Array.prototype.slice.call(arguments,1);
		return function ()
		{
			callee.apply(
				scope,
				args.concat(Array.prototype.slice.call(arguments,0))
			);
		};
	};

	//-------------------------------------------------------- STRING EXTENSIONS
	String.prototype.replaceAll = function (str1, str2, ignore)
	{
		return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
	};


	String.prototype.formatMultipleStringCase = function ()
	{
		var output = '' + this;
		if ('s' != output.substring(output.length - 1, output.length))
		{
			if ('y' == output.substring(output.length - 1, output.length))
			{
				output = output.substring(0, output.length - 1) + 'ies';
			}
			else
			{
				output += 's';
			}
		}
		return output;
	};

	String.prototype.formatSingleStringCase = function ()
	{
		var output = '' + this;
		if ('s' == output.substring(output.length - 1, output.length))
		{
			if ('ies' == output.substring(output.length - 3, output.length))
			{
				output = output.substring(0, output.length - 3) + 'y';
			}
			else
			{
				output = output.substring(0, output.length - 1);
			}
		}
		return output;
	};

	String.prototype.htmlEncode = function ()
	{
		return this.replaceAll('&', '&amp;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#39;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;');
	};

	String.prototype.htmlDecode = function ()
	{
		return this.replaceAll('&amp;', '&')
			.replaceAll('&quot;', '"')
			.replaceAll('&#39;', "'")
			.replaceAll('&lt;', '<')
			.replaceAll('&gt;', '>');
	};

	String.prototype.ucFirst = function ()
	{
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	String.prototype.trim = function ()
	{
		return this.replace(/^\s+|\s+$/g, "");
	};

	String.prototype.ltrim = function ()
	{
		return this.replace(/^\s+/, "");
	}

	String.prototype.rtrim = function ()
	{
		return this.replace(/\s+$/, "");
	}

	String.prototype.removeDoubleSpaces = function ()
	{
		return this.replace('  ', ' ').replace('  ', ' ').replace('  ', ' ').replace('  ', ' ').replace('  ', ' ');
	}

	String.prototype.dashToCamel = function ()
	{
		return this.replace(/(\-[a-z])/g, function ($1) {return $1.toUpperCase().replace('-', '');});
	};

	String.prototype.underscoreToCamel = function ()
	{
		return this.replace(/(\_[a-z])/g, function ($1) {return $1.toUpperCase().replace('_', '');});
	};

	String.prototype.camelToDash = function ()
	{
		return this.replace(/([A-Z])/g, function ($1) {return "-" + $1.toLowerCase();});
	};

	String.prototype.underscoreToDash = function ()
	{
		return this.replace(/(\_[a-z])/g, function ($1) {return "-" + $1.toLowerCase().replace('_', '');});
	};

	String.prototype.camelToUnderscore = function ()
	{
		return this.replace(/([A-Z])/g, function ($1) {return "_" + $1.toLowerCase();});
	};
	String.prototype.camelToSpace = function ()
	{
		return this.replace(/([A-Z])/g, function ($1) {return " " + $1.toLowerCase();});
	};

	String.prototype.dashToUnderscore = function ()
	{
		return this.replace(/(\-[a-z])/g, function ($1) {return "_" + $1.toLowerCase().replace('-', '');});
	};

	//-------------------------------------------------------- VALIDATOR MODIFICATIONS
	if (jQuery.validator)
	{
		jQuery.validator.addMethod("notNull", function (value, element, params)
			{
				return this.optional(element) || value != null;
			}, "Please select a value."
		);

		jQuery.validator.addMethod("mobile", function (value, element, params)
			{
				return this.optional(element) || '' != value;
			}, "Must be a valid mobile number."
		);

		jQuery.validator.addMethod("companyReg", function (value, element, params)
			{
				return this.optional(element) || value.match(/^\d{4}\/\d{6}\/\d{2}$/) != null;
			}, "Incorrect format."
		);

		jQuery.validator.addMethod("complexPassword", function (value, element, params)
			{
				var hasUpperCase = /[A-Z]/.test(value);
				var hasLowerCase = /[a-z]/.test(value);
				var hasNumbers = /\d/.test(value);
				var hasNonAlphas = /\W/.test(value);
				var badPass = (hasUpperCase + hasLowerCase + hasNumbers + hasNonAlphas < 4);
				return this.optional(element) || !badPass;
			}, "Password must contain at least<br/>one capital letter,<br/>one lower case letter,<br/>one numeric value and one symbol."
		);

		jQuery.validator.addMethod('minDate', function (v, el, minDate)
			{
				if (this.optional(el))
				{
					return true;
				}
				if (isNaN(minDate.getTime()))
				{
					return true;
				}
				else
				{
					var curDate = $(el).datepicker('getDate');
					return minDate <= curDate;
				}
			}, 'Date must be after start date'
		);


		jQuery.validator.addMethod("simplePassword", function (value, element, params)
			{
				var hasUpperCase = /[A-Z]/.test(value);
				var hasLowerCase = /[a-z]/.test(value);
				var hasNumbers = /\d/.test(value);
				var hasNonAlphas = /\W/.test(value);
				var badPass = (hasUpperCase + hasLowerCase + hasNumbers + hasNonAlphas < 1);
				return this.optional(element) || !badPass;
			}, "Password must contain at least<br/>one capital letter,<br/>one lower case letter,<br/>one numeric value and one symbol."
		);


		$.validator.setDefaults({
			ignore: [],
			errorPlacement: function (error, element)
			{
				if (element.hasClass('selectpicker'))
				{
					var elem = $('button[data-id=' + element.attr("name") + ']');
					elem.addClass('error');
					error.insertAfter(elem);
				}
				else if (element.hasClass('file-input'))
				{
					var elem = $('#' + element.attr('progress-id'));
					element.addClass('error');
					error.insertAfter(elem);
				}
				else if (element.parent().hasClass('input-group'))
				{
					element.addClass('error');
					error.insertAfter(element.parent());
				}
				else
				{
					error.insertAfter(element);
				}
			},
			unhighlight: function (element, errorClass, validClass)
			{
				if ($(element).hasClass('selectpicker'))
				{
					$('button[data-id=' + $(element).attr("name") + ']').removeClass(errorClass).addClass(validClass);
				}
				else
				{
					$(element).removeClass(errorClass).addClass(validClass);
				}
				$(element.form).find("label[for=" + element.id + "]." + errorClass)
					.remove();
			}
		});
	}

})();


$.fn.extend({
	getPath: function ()
	{
		var path, node = this;
		while (node.length)
		{
			var realNode = node[0],
			    id = realNode.id,
			    name = realNode.localName;

			if (id)
			{
				return '#' + id + (path ? '>' + path : '');
			}

			if (!name)
			{
				break;
			}

			name = name.toLowerCase();
			var parent = node.parent();
			var sameTagSiblings = parent.children(name);
			if (sameTagSiblings.length > 1)
			{
				allSiblings = parent.children();
				var index = allSiblings.index(realNode) + 1;
				if (index > 1)
				{
					name += ':nth-child(' + index + ')';
				}
			}
			path = name + (path ? '>' + path : '');
			node = parent;
		}
		return path;
	}
});
$.fn.setCursorPosition = function (pos)
{
	if ($(this).get(0).setSelectionRange)
	{
		$(this).get(0).setSelectionRange(pos, pos);
	}
	else if ($(this).get(0).createTextRange)
	{
		var range = $(this).get(0).createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
};

;
(function ()
{


})();
