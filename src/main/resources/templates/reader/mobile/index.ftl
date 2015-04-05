<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>MyReader</title>
        <#noparse>
            <style type="text/css">
                a:focus{outline:thin dotted;}
                a:hover,a:active{outline:0;}
                body{margin:0;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px;font-weight:normal;line-height:18px;color:#404040;}
                a{color:#0069d6;text-decoration:none;line-height:inherit;font-weight:inherit;}
                body div {padding: 15px;border-bottom: 1px solid #b3b2b2;}
            </style>
        </#noparse>
    </head>
    <body>
        <div>
            <span>
                <a href="${requestContext.getContextUrl("/mobile/reader/entry")}">${treeNavigation.title?html}</a>
            </span>
        </div>
        <#list treeNavigation.iterator() as tree>
            <div>
                <span>
                    <a href="${requestContext.getContextUrl("/mobile/reader/entry/${myreader.uriEncode(tree.name)}")}">${tree.title?html}</a>
                </span>
            </div>
        </#list>
    </body>
</html>
