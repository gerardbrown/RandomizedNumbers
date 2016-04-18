;
(function ()
{

	_App.Ajax = function ()
	{

		this.initialize();

	};

	_App.Ajax.prototype =
	{

		exportCounter: 0,

		initialize: function ()
		{

		},

		DOWNLOAD: function (args)
		{
			var target = !args.direct
				? 'target="_blank"'
				: '';
			var inputs = '';
			for (var item in args.data)
			{
				inputs += '<input type="hidden" id="' + item + '" name="' + item + '" value="' + args.data[item] + '">';
			}
			$('<form id="downloadForm' + this.exportCounter + '" method="get" ' + target + ' action="' + args.url + '">'
			  + inputs + '</form>').appendTo('body').submit();
			$('#downloadForm' + this.exportCounter).remove();
			this.exportCounter++;
		},

		EXPORTSAFE: function (args)
		{
			args.data = args.data[0];
			inputs = '';
			inputs += '<input type="hidden" name="Contract" value="' + args.data.Contract + '">';
			for (var group in args.data.Packet)
			{
				for (var param in args.data.Packet[group])
				{
					if ('object' == typeof args.data.Packet[group][param])
					{
						for (var subParam in args.data.Packet[group][param])
						{
							inputs += '<input type="hidden" name="Packet[' + group + '][' + param + '][' + subParam + ']" value="' + escape(args.data.Packet[group][param][subParam]) + '">';
						}
					}
					else
					{
						inputs += '<input type="hidden" name="Packet[' + group + '][' + param + ']" value="' + escape(args.data.Packet[group][param]) + '">';
					}
				}
			}
			if (args.data.Options)
			{
				for (var param in args.data.Options)
				{
					inputs += '<input type="hidden" name="Options[' + param + ']" value="' + escape(args.data.Options[param]) + '">';
				}
			}
			var target = !args.direct
				? 'target="_blank"'
				: '';
			$('<form id="exportForm' + this.exportCounter + '" method="post" ' + target + ' action="' + args.url + '">'
			  + inputs
			  + '</form>').appendTo('body').submit();
			$('#exportForm' + this.exportCounter).remove();
			this.exportCounter++;
		},

		EXPORT: function (args)
		{
			args.data = args.data[0];
			inputs = '';
			inputs += '<input type="hidden" name="Contract" value="' + args.data.Contract + '">';
			for (var group in args.data.Packet)
			{
				for (var param in args.data.Packet[group])
				{
					if ('object' == typeof args.data.Packet[group][param])
					{
						for (var subParam in args.data.Packet[group][param])
						{
							inputs += '<input type="hidden" name="Packet[' + group + '][' + param + '][' + subParam + ']" value="' + args.data.Packet[group][param][subParam] + '">';
						}
					}
					else
					{
						inputs += '<input type="hidden" name="Packet[' + group + '][' + param + ']" value="' + args.data.Packet[group][param] + '">';
					}
				}
			}
			if (args.data.Options)
			{
				for (var param in args.data.Options)
				{
					inputs += '<input type="hidden" name="Options[' + param + ']" value="' + args.data.Options[param] + '">';
				}
			}
			var target = !args.direct
				? 'target="_blank"'
				: '';
			$('<form id="exportForm' + this.exportCounter + '" method="post" ' + target + ' action="' + args.url + '">'
			  + inputs
			  + '</form>').appendTo('body').submit();
			$('#exportForm' + this.exportCounter).remove();
			this.exportCounter++;
		},

		JSON: function (args, callback, errorCallback)
		{
			args.type = 'POST';
			args.dataType = 'json';
			args.url = window.location.protocol
			           + '//' + window.location.hostname
			           + ( args.url.indexOf('/') === 0
				? args.url
				: '/' + args.url);
			args.data = JSON.stringify(args.data);


			$.post(args.url, args.data)
				.done(function (data)
				{
					_w.sessionUpdate();
					(args.id)
						? callback(args.id, data)
						: callback(data);
				})
				.fail(function (jqXHR, textStatus, errorThrown)
				{
					_w.sessionUpdate();
					if (errorCallback)
					{
						(args.id)
							? errorCallback(args.id, textStatus, errorThrown)
							: errorCallback(textStatus, errorThrown);
					}
				});
		},

		SCRIPT: function (args, callback, errorCallback)
		{
			args.type = 'GET';
			args.dataType = 'script';
			args.url = window.location.protocol
			           + '//' + window.location.hostname
			           + ( args.url.indexOf('/') === 0
				? args.url
				: '/' + args.url);
			$.ajax(args)
				.done(function (data)
				{
					if (callback)
					{
						(args.id)
							? callback(args.id, data)
							: callback(data);
					}
				})
				.fail(function (jqXHR, textStatus, errorThrown)
				{
					if (errorCallback)
					{
						(args.id)
							? errorCallback(args.id, textStatus, errorThrown)
							: errorCallback(textStatus, errorThrown);
					}
				})
				.error(function (jqXHR, textStatus, errorThrown)
				{
					if (errorCallback)
					{
						(args.id)
							? errorCallback(args.id, textStatus, errorThrown)
							: errorCallback(textStatus, errorThrown);
					}
				});
		},

		POST: function (args, callback, errorCallback)
		{
			args.type = 'POST';
			args.url = window.location.protocol
			           + '//' + window.location.hostname
			           + ( args.url.indexOf('/') === 0
				? args.url
				: '/' + args.url);
			$.ajax(args)
				.done(function (data)
				{
					_w.sessionUpdate();
					if (callback)
					{
						(args.id)
							? callback(args.id, data)
							: callback(data);
					}
				})
				.fail(function (jqXHR, textStatus, errorThrown)
				{
					_w.sessionUpdate();
					if (errorCallback)
					{
						(args.id)
							? errorCallback(args.id, textStatus, errorThrown)
							: errorCallback(textStatus, errorThrown);
					}
				});
		},

		GET: function (args, callback, errorCallback)
		{
			args.type = 'GET';
			args.url = window.location.protocol
			           + '//' + window.location.hostname
			           + ( args.url.indexOf('/') === 0
				? args.url
				: '/' + args.url);
			$.ajax(args)
				.done(function (data)
				{
					_w.sessionUpdate();
					if (callback)
					{
						(args.id)
							? callback(args.id, data)
							: callback(data);
					}
				})
				.fail(function (jqXHR, textStatus, errorThrown)
				{
					_w.sessionUpdate();
					if (errorCallback)
					{
						(args.id)
							? errorCallback(args.id, textStatus, errorThrown)
							: errorCallback(textStatus, errorThrown);
					}
				});
		}

	};

})();
