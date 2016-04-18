var template_viewconfig = function (static)
{
    $.extend(this, App.Template.emptyTemplate);
    this.static = static;
    this.defaultForm = 'frmEditConfig';
    this.haveData = true;
    this.forms =
    {
        frmEditConfig: {
            namespace: 'Randomizer',
            buttons: [],
            defaults: {
                labelSpan: '',
                inputSpan: ''
            },
            workspace: 'Randomizer',
            choose: $.proxy(function ()
            {
                if (this.actionContext)
                {
                    return this.actionContext;
                }
                return 'update';
            }, this),
            actions: {
                update: {
                    enable: function ()
                    {
                        return true;
                    },
                    taskAlias: $.proxy(function ()
                    {
                        return 'Update';
                    }, this),
                    task: 'Update',
                    dataHandler: false,
                    dataTransform: $.proxy(function (data)
                    {
                        console.log('data',data);

                        var packet = {
                            id: App.Util.getUrlParam('id'),
                            ballsInMainSet: data.Randomizer.ballsInMainSet,
                            ballsDrawnInMainSet: data.Randomizer.ballsDrawnInMainSet,
                            ballsInPowerBallSet: data.Randomizer.ballsInPowerBallSet,
                            ballsDrawnPowerBallSet: data.Randomizer.ballsDrawnPowerBallSet
                        };

                        return packet;
                    }, this),
                    successHandler: $.proxy(function (response) {
                        //-- Display order data
                        var data = response.Data;

                        console.log('data',data);

                        window.location.hash = '/randomize-config';

                        $('#btnEdit').prop('disabled', false);
                    }, this),
                    errorHandler: $.proxy(function (response) {
                        _w.notify('Error', response.Message);
                    }, this),
                    button: $.extend(true, {}, App.DataElement.Button, {
                        id: 'btnEdit',
                        label: 'Update',
                        btnType: 'button',
                        btnStyle: 'btn-primary btn-lg',
                        onClick: $.proxy(function()
                        {
                            console.log('update');

                            this.actionContext = 'update';
                        }, this)
                    })
                },
                cancel: {
                    enable: function ()
                    {
                        return true;
                    },
                    taskAlias: $.proxy(function ()
                    {
                        return 'Cancel';
                    }, this),
                    task: 'Cancel',
                    button: $.extend(true, {}, App.DataElement.Button, {
                        id: 'btnCancel',
                        disabled: true,
                        label: 'Cancel',
                        btnType: 'button',
                        btnStyle: 'btn-warning btn-lg',
                        onClick: $.proxy(function()
                        {
                            this.actionContext = 'cancel';
                            window.location.hash = '/randomize-config';
                        }, this)
                    })
                }
            },
            fields: {
                ballsInMainSet: $.extend(true, {}, App.DataElement.Number, {
                    label: 'Number of balls in a main set of balls',
                    labelStyle: 'col-md-6',
                    inputStyle: 'input-sm',
                    inputWrapperStyle: 'col-md-6',
                    rules: {required: true}
                }),
                ballsDrawnInMainSet: $.extend(true, {}, App.DataElement.Number, {
                    label: 'Number of balls drawn from the main set',
                    labelStyle: 'col-md-6',
                    inputStyle: 'input-sm',
                    inputWrapperStyle: 'col-md-6',
                    rules: {required: true}
                }),
                ballsInPowerBallSet: $.extend(true, {}, App.DataElement.Number, {
                    label: 'Number of balls in a powerball set',
                    labelStyle: 'col-md-6',
                    inputStyle: 'input-sm',
                    inputWrapperStyle: 'col-md-6',
                    rules: {required: true}
                }),
                ballsDrawnPowerBallSet: $.extend(true, {}, App.DataElement.Number, {
                    label: 'Number of balls drawn from a powerball set',
                    labelStyle: 'col-md-6',
                    inputStyle: 'input-sm',
                    inputWrapperStyle: 'col-md-6',
                    rules: {required: true}
                })
            }
        }
    };
    this.meta = {
        General: {},
        Login: {}
    };
    this.init = function () {};
    this.construct = $.proxy(function ()
    {
        //-- Retrieve rates.
        this.actionContext = 'update';


        App.API.execTask(
            'ViewConfig', 'Randomizer', 'ViewConfig',
            {id: App.Util.getUrlParam('id')},
            $.proxy(function (response)
            {
                var data = response.Data;

                console.log('data',data);

                $('#ballsInMainSet').val(data.ballsInMainSet);
                $('#ballsDrawnInMainSet').val(data.ballsDrawnInMainSet);
                $('#ballsInPowerBallSet').val(data.ballsInPowerBallSet);
                $('#ballsDrawnPowerBallSet').val(data.ballsDrawnPowerBallSet);


            }, this),
            function () {}
        );

    }, this);
    this.destruct = function () {};
};
