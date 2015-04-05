<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <#noparse>
    <style type="text/css">

        html{overflow-y:scroll;font-size:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
        body {margin:50px 0px; padding:0px;text-align:center;margin:0;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px;font-weight:normal;line-height:18px;color:#404040;}
        h3{margin:0;padding:0;border:0;font-weight:normal;font-style:normal;font-size:100%;font-family:inherit;line-height:36px;font-size:14px;}
        ol,ul{list-style:none;}
        a:focus{outline:thin dotted;}
        a:hover,a:active{outline:0;}
        a{color:#0069d6;text-decoration:none;line-height:inherit;font-weight:inherit;}
        input[type="radio"] {margin: 30px;}
        .error { color: red; }

        .button {
            overflow:visible; /* Shrinkwrap the text in IE7- */
            margin:0;
            padding:0;
            border:0;
            color:#0069D6; /* Match your link colour */
            background:transparent;
            font:inherit; /* Inherit font settings (doesn’t work in IE7-) */
            line-height:normal; /* Override line-height to avoid spacing issues */
            text-decoration:none; /* Make it look linky */
            cursor:pointer; /* Buttons don’t make the cursor change in all browsers */
            -moz-user-select:text; /* Make button text selectable in Gecko */
        }

        /* Remove mystery padding in Gecko browsers.
         * See https://bugzilla.mozilla.org/show_bug.cgi?id=140562
         */
        .text::-moz-focus-inner {
            padding:0;
            border:0;
        }
        .button, a {font-size:24px; margin-right: 25px;}

    </style>
    </#noparse>
    <title>MyReader</title>
</head>
<body>
<h3>${entry.title?html}</h3>

<form method="POST">
    <input type="hidden" value="${entry.id?string.computer}">

    <select name="tag">
        <option value="">none</option>

        <#list tagList as tag>
                <#if entry.tag?? && entry.tag == tag>
                    <option selected="selected">${tag?html}</option>
                <#else>
                    <option>${tag?html}</option>
                </#if>

        </#list>
    </select>

    <div id="chooseRadio">
        <#if entry.unseen == "true">
            <input type="radio" value="false" name="unseen"> Yes
            <input type="radio" checked="checked" value="true" name="unseen"> No
        <#else>
            <input type="radio" checked="checked" value="false" name="unseen"> Yes
            <input type="radio" value="true" name="unseen"> No
        </#if>
    </div>

    <input class="button" type="submit" value="save">
    <a href="?">back</a>
</form>
</body>
</html>
