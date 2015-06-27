<#macro page>
<!DOCTYPE HTML>
<html>
<head>
    <title>MyReader</title>

    <link rel="icon" type="image/gif" href="${requestContext.getContextUrl("/static/img/favicon.ico")}">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="${requestContext.getContextUrl("/static/css/bootstrap-2.1.min.css")}" rel="stylesheet">

    <script src="${requestContext.getContextUrl("/static/js/jquery-1.8.min.js")}"></script>
    <script src="${requestContext.getContextUrl("/static/js/jquery.tablesorter-2.0.js")}"></script>
    <script src="${requestContext.getContextUrl("/static/js/bootstrap-2.1.min.js")}"></script>

<#noparse>
    <style type="text/css">
        body {
            padding-top:40px;
        }
        .hidden {
            display: none;
        }
        #alerts {
            position: fixed;
            top: 0px;
            z-index: 1031;
            right: 0;
            left: 0;
        }
        .alert {
            margin-bottom: 0px !important;
        }
    </style>

    <script>
        (function($){
            $.notification = function ( options ) {
                var id = null;

                if(options.message) {
                    var selector = '.alert-' + options.type;
                    $('#alerts .alert').addClass('hidden');

                    clearTimeout(id);
                    $(selector).find('span').text(options.message).parent().removeClass("hidden");

                    id = setTimeout(function() {
                        $(selector).addClass("hidden");
                    }, 3000);
                }
            };

            $.notification({type : 'success',  message: '${success}'});
            $.notification({type : 'error',  message: '${error}'});
        })(jQuery);

        $(document).ready(function() {
            $('#rebuild-search').on('click', function(event) {
                event.preventDefault();
                $.post($(this).attr('href'))
                .success(function() {
                    $.notification({type : 'success', message : 'search index rebuild triggered'});
                })
                .error(function() {
                    $.notification({type : 'error', message : 'error during search index rebuild'});
                })
            });
        });
    </script>
</#noparse>
</head>
<body>
<div id="alerts">
    <div class="alert alert-success hidden">
        <i class="icon-ok-sign"></i>
        <span></span>
    </div>
    <div class="alert alert-error hidden">
        <i class="icon-exclamation-sign"></i>
        <span></span>
    </div>
</div>

<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <div class="nav-collapse">
                <ul class="nav">
                    <li>
                        <a href="${requestContext.getContextUrl("/web/admin")}">
                            <i class="icon-home"></i>
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="${requestContext.getContextUrl("/web/admin/feeds")}"><i class="icon-chevron-right"></i> Feeds</a>
                    </li>
                    <li>
                        <a id="rebuild-search" href="${requestContext.getContextUrl("/web/admin/searchIndex")}"><i class="icon-refresh"></i>Rebuild search index</a>
                    </li>
                </ul>
                <ul class="nav pull-right">
                    <li class="dropdown">
                        <a data-toggle="dropdown" class="dropdown-toggle" href="#"><i class="icon-user"></i> ${myreader.authentication()} <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li>
                                <a href="${requestContext.getContextUrl("/web/logout")}">
                                    <i class="icon-off"></i>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

<div class="container-fluid">
    <#nested>
</div>
</body>
</html>
</#macro>
