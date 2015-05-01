<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <@style id="mobile"></@style>
    <title>MyReader</title>
</head>
<body>

<div class="topbar-inner">
    <div class="container-fluid">
        <ul class="nav">
            <li><a href="${requestContext.getContextUrl("/web/logout")}">logout</a></li>
            <li><a href="">refresh</a></li>
            <li><a id="feeds" href="${requestContext.getContextUrl("/mobile/reader")}">feeds</a></li>
        </ul>
    </div>
</div>

<form method="POST">
    <table>
        <#list entryList as entry>
            <tr>
                <td class="col1">
                    <a href="?id=${entry.id?string.computer}">
                        <h3 class="entry-title">${entry.title?html}</h3>
                        <span class="entry-producer">${entry.feedTitle?html}</span>
                    </a>
                </td>
                <td class="col2">
                    <a target="_blank" href="${entry.url}">open</a>
                </td>
                <td class="col2">
                    <input  type="checkbox" name="id[]" value="${entry.id?string.computer}">
                </td>
            </tr>
        </#list>
    </table>

    <input class="read-button" type="submit" value="mark as read">
</form>
</body>
</html>
