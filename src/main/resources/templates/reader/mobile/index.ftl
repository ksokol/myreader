<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>MyReader</title>
        <@style id="mobile"></@style>
    </head>
    <body ng-app="myreader" ng-controller="subscriptionNavigationCtrl">
        <div class="topbar-inner">
            <div class="container-fluid">
                <ul class="nav">
                    <li>
                        <loading-indicator>
                            <div class="spinner hidden"></div>
                            <span class="error-message hidden"></span>
                        </loading-indicator>
                    </li>
                    <li><a href="../web/logout">logout</a></li>
                    <li><a href="#" ng-click="refresh()">refresh</a></li>
                </ul>
            </div>
        </div>

        <table>
            <tr ng-repeat="item in data.tags">
               <td class="col1">
                   <a ng-href="reader/entry/{{item.title}}">
                       <h3 class="entry-title">{{item.title}}</h3>
                       <span class="entry-producer">{{item.unseen}}</span>
                   </a>
               </td>
               <td class="col2">
                   <a ng-href="reader/entry/{{item.title}}">open</a>
               </td>
            </tr>

            <tr ng-repeat="item in data.subscriptions">
               <td class="col1">
                   <a ng-href="reader/entry/{{item.title}}">
                       <h3 class="entry-title">{{item.title}}</h3>
                       <span class="entry-producer">{{item.unseen}}</span>
                   </a>
               </td>
               <td class="col2">
                   <a ng-href="reader/entry/{{item.title}}">open</a>
               </td>
            </tr>
        </table>

<@script id="mobile"></@script>
</body>
</html>
