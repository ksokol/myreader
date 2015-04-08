<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>MyReader</title>
        <@style id="mobile"></@style>
    </head>
    <body>
        <div>
            <span>
                <a href="${requestContext.getContextUrl("/mobile/reader/entry/all")}">${treeNavigation.title?html}</a>
            </span>
        </div>
        <#list treeNavigation.iterator() as tree>
            <div>
                <span>
                    <a href="${requestContext.getContextUrl("/mobile/reader/entry/${myreader.uriEncode(tree.name)}")}">${tree.title?html}</a>
                </span>
            </div>
        </#list>
        <@script id="mobile"></@script>
    </body>
</html>
