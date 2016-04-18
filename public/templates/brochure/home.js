var template_home = function (static)
{
    $.extend(this, App.Template.emptyTemplate);
    this.static = static;
    this.defaultForm = 'frmHome';
    this.haveData = true;
    this.forms =
    {
        frmHome: {
            namespace: 'WinningNumbers',
            buttons: [],
            defaults: {
                labelSpan: '',
                inputSpan: ''
            },
            workspace: 'WinningNumbers',
            choose: $.proxy(function ()
            {
                if (this.actionContext)
                {
                    return this.actionContext;
                }
                return 'play';
            }, this),
            actions: {
                play: {
                    enable: function ()
                    {
                        return true;
                    },
                    taskAlias: $.proxy(function ()
                    {
                        return 'Play';
                    }, this),
                    task: 'Play',
                    dataHandler: false,
                    successHandler: $.proxy(function (response) {
                        $('#resultContainer').html('Loading...');
                        this.getWinningResults();
                        $('#btnPlay').prop('disabled', false);
                    }, this),
                    errorHandler: $.proxy(function (response) {
                        $('#btnPlay').prop('disabled', false);
                        _w.notify('Error', response.Message);
                    }, this),
                    button: $.extend(true, {}, App.DataElement.Button, {
                        id: 'btnPlay',
                        label: 'Play',
                        btnType: 'button',
                        btnStyle: 'btn-primary btn-lg',
                        onClick: $.proxy(function()
                        {
                            $('#btnPlay').prop('disabled', true);
                        }, this)
                    })
                },
                export: {
                    enable: function ()
                    {
                        return true;
                    },
                    taskAlias: $.proxy(function ()
                    {
                        return 'ExportResult';
                    }, this),
                    task: 'ExportResult',
                    successHandler: $.proxy(function (response) {

                        window.open('http://' + window.location.hostname + '/csvExport/' + response.Data.fileName, '_blank');

                        var downloadhtml = '<div class="col-offset-top-10">';
                        downloadhtml += 'If the download did not start automatically please click ';
                        downloadhtml += '<span class="green">';
                        downloadhtml += '<a href="http://' + window.location.hostname + '/csvExport/' + response.Data.fileName + '" target="_new"><span class="green">here</span></a>';
                        downloadhtml += '</span>';
                        downloadhtml += ' to download the updated file ';
                        downloadhtml += '</div>';
                        $('#downloadRedlist').html(downloadhtml);

                        $('#downloadResultContainer').html(downloadhtml);

                        setTimeout(
                            $.proxy(function(){
                                $('#downloadResultContainer').hide();
                            }, this),
                            30000
                        );
                        console.log('export response',response);

                    }, this),
                    errorHandler: $.proxy(function (response) {
                        _w.notify('Error', response.Message);
                    }, this),
                    button: $.extend(true, {}, App.DataElement.Button, {
                        id: 'btnExportResult',
                        label: 'Export All',
                        btnType: 'button',
                        btnStyle: 'btn-warning btn-lg',
                        onClick: $.proxy(function()
                        {
                            this.actionContext = 'export';
                        }, this)
                    })
                }
            },
            fields: {}
        }
    };
    this.meta = {
        General: {},
        Login: {}
    };
    this.init = function () {};
    this.construct = $.proxy(function ()
    {
        this.actionContext = 'play';
        this.getWinningResults();

    }, this);

    this.getWinningResults = $.proxy(function ()
    {
        App.API.execTask(
            'getWinningResults', 'WinningNumbers', 'GetWinningResults',
            {}, $.proxy(function (response)
            {
                console.log('response',response);
                $('#resultContainer').html('');
                var data = response.Data;
                for (var i in data)
                {
                    if(0 == i)
                    {
                        var html = '<div class="col-md-12">';
                        html += '<div class="result-block blue" data-id="' + data[i].id + '">';
                        html += '<br/><h2>' + data[i].winningNumbers + ' + ' + data[i].powerBallNumber + '</h2>';
                        html += '<p><i>' + data[i].created + '</i></p><br/>';
                        html += '</div>';
                        html += '</div>';
                        $('#resultContainer').append(html);
                    }
                    else
                    {
                        var html = '<div class="col-md-12">';
                        html += '<div class="result-block" data-id="' + data[i].id + '">';
                        html += '<br/><h2>' + data[i].winningNumbers + ' + ' + data[i].powerBallNumber + '</h2>';
                        html += '<p><i>' + data[i].created + '</i></p><br/>';
                        html += '</div>';
                        html += '</div>';
                        $('#resultContainer').append(html);
                    }


                }
            }, this),
            function () {}
        );

    }, this);

    this.destruct = function () {};
};
