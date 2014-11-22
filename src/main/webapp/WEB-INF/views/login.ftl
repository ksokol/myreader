<html>
<head>
    <title>Login</title>
</head>
<body>
Login

<form action="${requestContext.getContextUrl(LOGIN_PROCESSING_URL)}" method="post" name="loginForm">

    <input type="text" name="username">
    <input type="text" name="password">
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>

    <input type="submit">
</form>

</body>
</html>
