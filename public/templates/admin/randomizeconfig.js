var template_randomizeconfig = function (static)
{
	$.extend(this, App.Template.emptyTemplate);
	this.static = static;
	this.haveData = true;
	this.meta = {
		General: {}
	};
	this.init = function () {};
	this.construct = $.proxy(function ()
	{
		App.API.execTask(
			'configGrid',
			'Randomizer',
			'ListConfig',
			{},
			function(response)
			{
                console.log('response',response);

				for (var i in response.Data.DataSet)
				{
					var config = response.Data.DataSet[i];
					//-- Populate order details.
					$('#configDetails').append(
						'<tr class="config-row handy" data-id="' + config.id + '">'
                        + '<td>' + config.ballsInMainSet + '</td>'
                        + '<td>' + config.ballsDrawnInMainSet + '</td>'
                        + '<td>' + config.ballsInPowerBallSet + '</td>'
                        + '<td>' + config.ballsDrawnPowerBallSet + '</td>'
						+ '</tr>'
					);
				}
				$('.config-row').click(function()
				{
					var id = $(this).attr('data-id');
					window.location.hash = '/view-config?id=' + id;
				});
			}
		);
	}, this);
	this.destruct = function () {};
};
