<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>MyReader</title>
        <@style id="mobile"></@style>
    </head>
    <body>
        <div class="topbar-inner">
            <div class="container-fluid">
                <ul class="nav">
                    <li><a href="${requestContext.getContextUrl("/web/logout")}">logout</a></li>
                    <li><a href="">refresh</a></li>
                </ul>
            </div>
        </div>

        <table>
            <tr>
                <td class="col1">
                    <a href="${requestContext.getContextUrl("/mobile/reader/entry/all")}">
                        <h3 class="entry-title">${treeNavigation.name?html}</h3>
                        <span class="entry-producer">${treeNavigation.unseen?string.computer}</span>
                    </a>
                </td>
                <td class="col2">
                    <a href="${requestContext.getContextUrl("/mobile/reader/entry/all")}">open</a>
                </td>
            </tr>
            <#list treeNavigation.iterator() as tree>
                <tr>
                    <td class="col1">
                        <a href="${requestContext.getContextUrl("/mobile/reader/entry/${myreader.uriEncode(tree.name)}")}">
                            <h3 class="entry-title">${tree.name?html}</h3>
                            <span class="entry-producer">${tree.unseen?string.computer}</span>
                        </a>
                    </td>
                    <td class="col2">
                        <a href="${requestContext.getContextUrl("/mobile/reader/entry/${myreader.uriEncode(tree.name)}")}">open</a>
                    </td>
                </tr>
            </#list>
        </table>

        <@script id="mobile"></@script>
    </body>
</html>
