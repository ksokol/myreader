<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <#noparse>
    <style type="text/css">

        html,body{margin:0;padding:0;background-color:#ffffff;}
        html{overflow-y:scroll;font-size:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
        a:focus{outline:thin dotted;}
        a:hover,a:active{outline:0;}
        body{margin:0;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px;font-weight:normal;line-height:18px;color:#404040;}
        .container{width:940px;margin-left:auto;margin-right:auto;zoom:1;}.container:before,.container:after{display:table;content:"";zoom:1;*display:inline;}
        .container:after{clear:both;}
        .container-fluid{position:relative;padding-left:5px;padding-right:5px;zoom:1;}.container-fluid:before,.container-fluid:after{display:table;content:"";zoom:1;*display:inline;}
        .container-fluid:after{clear:both;}
        .container-fluid>.sidebar{width:260px;position:fixed;margin-top: 5px;}
        .container-fluid>.content{min-width:100px;max-width:1900px;margin-left:260px;}

        a{color:#0069d6;text-decoration:none;line-height:inherit;font-weight:inherit;}

        .topbar-inner a{color:#bfbfbf;text-shadow:0 -1px 0 rgba(0, 0, 0, 0.25);}
        .topbar-inner p{margin:0;line-height:40px;}.topbar p a:hover{background-color:transparent;color:#ffffff;}
        .topbar-inner,.topbar .fill{background-color:#222;background-color:#222222;background-repeat:repeat-x;background-image:-khtml-gradient(linear, left top, left bottom, from(#333333), to(#222222));background-image:-moz-linear-gradient(top, #333333, #222222);background-image:-ms-linear-gradient(top, #333333, #222222);background-image:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #333333), color-stop(100%, #222222));background-image:-webkit-linear-gradient(top, #333333, #222222);background-image:-o-linear-gradient(top, #333333, #222222);background-image:linear-gradient(top, #333333, #222222);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#333333', endColorstr='#222222', GradientType=0);-webkit-box-shadow:0 1px 3px rgba(0, 0, 0, 0.25),inset 0 -1px 0 rgba(0, 0, 0, 0.1);-moz-box-shadow:0 1px 3px rgba(0, 0, 0, 0.25),inset 0 -1px 0 rgba(0, 0, 0, 0.1);box-shadow:0 1px 3px rgba(0, 0, 0, 0.25),inset 0 -1px 0 rgba(0, 0, 0, 0.1);}
        .topbar-inner div>ul,.nav{display:block;float:right;margin:0 20px 0 0;position:relative;left:0;}.topbar div>ul>li,.nav>li{display:block;float:left;}
        .topbar-inner div>ul a,.nav a{display:block;float:none;padding:10px 10px 11px;line-height:19px;text-decoration:none;}.topbar div>ul a:hover,.nav a:hover{color:#ffffff;text-decoration:none;}
        .topbar-inner div>ul .active>a,.nav .active>a{background-color:#222;background-color:rgba(0, 0, 0, 0.5);}

        .entry-title {
            color: #404040;
            margin: 0;
        }

        .entry-producer {
            color: #404040;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th .col1 {
            width: 80%
        }

        td {
            border-bottom: 1px solid #aaa;
        }

        .read-button {
            height: 50px;
            width: 100%;
        }

        input[type="checkbox"] {
            height: 30px;
            width: 30px;
        }

    </style>
    </#noparse>
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
