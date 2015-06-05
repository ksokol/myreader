<!DOCTYPE HTML>
<html>
<head>
    <title>MyReader</title>

    <link rel="icon" type="image/gif" href="${requestContext.getContextUrl("/static/img/favicon.gif")}">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${requestContext.getContextUrl("/static/css/bootstrap-2.1.min.css")}" rel="stylesheet">

    <style type="text/css">
        body {
            padding-top:40px;
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
        .container {
            width: 260px !important;
        }
        .form-horizontal .control-label {
            width: 0px !important;
        }
        .form-horizontal .controls {
            margin-left: 80px !important;
        }
    </style>
</head>
<body>

<@login result="failed">
    <div id="alerts">
        <div class="alert alert-error">
            <i class="icon-exclamation-sign"></i>
            <span>Login failed. Try again.</span>
        </div>
    </div>

</@login>

<div class="container">
    <form action="${requestContext.getContextUrl(LOGIN_PROCESSING_URL)}" method="POST" class="form-horizontal" name="loginForm">
        <#--
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
        -->
        <fieldset>
            <legend>MyReader Login</legend>

            <div class="control-group">
                <label class="control-label" for="email">Username</label>
                <div class="controls">
                    <input id="email" type="text" class="email input-medium" name="username" placeholder="user@example.com">
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="email">Password</label>
                <div class="controls">
                    <input type="password" class="pw input-medium" name="password">
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="email">Remember me</label>
                <div class="controls">
                    <input type="checkbox" class="input-medium" name="remember-me">
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary pull-right">Login</button>
            </div>
        </fieldset>
    </form>
</div>

<@script id="login"></@script>
</body>
</html>
