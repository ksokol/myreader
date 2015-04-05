<#macro reader>
<!DOCTYPE HTML>
<html>
<head>
    <title>MyReader</title>

    <link rel="icon" type="image/gif" href="${requestContext.getContextUrl("/static/img/favicon.gif")}">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="${requestContext.getContextUrl("/static/css/bootstrap-2.1.min.css")}" rel="stylesheet">
    <link href="${requestContext.getContextUrl("/static/css/myreader.css")}" rel="stylesheet">

    <script src="${requestContext.getContextUrl("/static/js/jquery-1.8.min.js")}"></script>
    <script src="${requestContext.getContextUrl("/static/js/bootstrap-2.1.min.js")}"></script>
    <script src="${requestContext.getContextUrl("/static/js/plugins.js")}"></script>
    <script src="${requestContext.getContextUrl("/static/js/myreader.js")}"></script>

<#noparse>
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

            $(document).ajaxError(function(event, request, settings) {
                if(request != null && request.status === 401) {
                    window.location= '<c:url value="/login" />';
                } else {
                    $.notification({type : 'error',  message: request.statusText});
                }
            });

            //TODO
            $.notification({type : 'success',  message: '${success}'});
            $.notification({type : 'error',  message: '${error}'});

            //TODO
            var func = null;
            $.refresh = function ( options ) {
                if(options && options.onRefresh instanceof Function) {
                    func = options.onRefresh;
                } else {
                    if(func !== null)
                        func(options);
                }
            };

        })(jQuery);

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
            <ul class="nav visible-desktop">
                <li>
                    <form class="navbar-search pull-left" action="${myreader.ignore(queryString,'q')}" method="POST">
                        <div class="input-append">
                            <input type="text" class="search-query" placeholder="Search" value="${myreader.queryParam('q')}" name="q" autocomplete="off">
                        <#if queryString??>
                            <#if queryString['q']?has_content>
                                <span class="add-on"><a href="${myreader.ignore(queryString, 'q')}"><i class="icon-remove-sign"></i></a></span>
                            </#if>
                        </#if>
                        </div>
                    </form>
                </li>
            </ul>

            <ul class="nav pull-right">
                <li>
                    <a id="reader-backward" href="#">
                        <i class="icon-backward"></i>
                    </a>
                </li>
                <li>
                    <a id="reader-refresh" href="#">
                        <i class="icon-refresh"></i>
                    </a>
                </li>
                <li>
                    <a id="reader-forward" href="#">
                        <i class="icon-forward"></i>
                    </a>
                </li>
                <li class="divider-vertical"></li>
                <li class="dropdown">
                    <a data-toggle="dropdown" class="dropdown-toggle" href="#"><i class="icon-align-justify"></i> </a>
                    <ul class="dropdown-menu">
                        <li>
                            <a href="${requestContext.getContextUrl("/web/rss/all")}">
                                <i class="icon-list"></i>
                                Reader
                            </a>
                        </li>
                        <li>
                            <a href="${requestContext.getContextUrl("/web/subscription")}">
                                <i class="icon-pencil"></i>
                                Subscriptions
                            </a>
                        </li>
                        <li>
                            <a href="${requestContext.getContextUrl("/web/tags/all")}">
                                <i class="icon-tags"></i>
                                Tags
                            </a>
                        </li>

                        <li class="divider"></li>

                        <#if queryString??>
                    <#if queryString['showAll']>
                        <li>
                            <a href="${myreader.replace(queryString, 'showAll', 'false')}">
                                <i class="icon-eye-open"></i>
                                <span>New entries only</span>
                            </a>
                        </li>
                    <#else>
                        <li>
                            <a href="${myreader.replace(queryString, 'showAll', 'true')}">
                                <i class="icon-eye-close"></i>
                                <span>All entries</span>
                            </a>
                        </li>
                    </#if>

                    <#if queryString['showDetails']>
                        <li>
                            <a href="${myreader.replace(queryString, 'showDetails', 'false')}">
                                <i class="icon-th-large"></i>
                                <span>Less details</span>
                            </a>
                        </li>
                    <#else>
                        <li>
                            <a href="${myreader.replace(queryString, 'showDetails', 'true')}">
                                <i class="icon-th"></i>
                                <span>More details</span>
                            </a>
                        </li>
                    </#if>

                        <li class="divider"></li>
                        </#if>
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

<div class="container">
    <div class="row">
        <#nested>
    </div>
</div>
</body>
</html>
</#macro>
