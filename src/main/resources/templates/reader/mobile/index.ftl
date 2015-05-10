<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>MyReader</title>
        <@style id="mobile"></@style>
    </head>
    <body ng-app="myreader">
        <div class="topbar-inner" ng-controller="NavigationBarCtrl">
            <div class="container-fluid">
                <ul class="nav">
                    <li>
                        <loading-indicator>
                            <div class="spinner hidden"></div>
                            <span class="error-message hidden"></span>
                        </loading-indicator>
                    </li>
                    <li><a href="../web/logout">logout</a></li>
                    <li><a ui-sref-active="hidden" ui-sref="subscriptionTags">feeds</a></li>
                    <li><a href="#" ng-click="refresh()">refresh</a></li>
                </ul>
            </div>
        </div>

        <div ui-view></div>

        <script type="text/ng-template" id="subscriptionTags">
            <table>
                <tr ng-repeat="item in data.tags">
                   <td class="col1">
                       <a ui-sref="entries-tags({tag: item.uuid})">
                           <h3 class="entry-title">{{item.title}}</h3>
                           <span class="entry-producer">{{item.unseen}}</span>
                       </a>
                   </td>
                   <td class="col2">
                       <a ui-sref="entries-tags({tag: item.uuid})">open</a>
                   </td>
                </tr>

                <tr ng-repeat="item in data.subscriptions">
                   <td class="col1">
                       <a ui-sref="entries-subscription({uuid: item.uuid})">
                           <h3 class="entry-title">{{item.title}}</h3>
                           <span class="entry-producer">{{item.unseen}}</span>
                       </a>
                   </td>
                   <td class="col2">
                       <a ui-sref="entries-subscription({uuid: item.uuid})">open</a>
                   </td>
                </tr>
            </table>
        </script>

        <script type="text/ng-template" id="entries">
            <table>
                <tr ng-repeat="entry in data">
                    <td class="col1">
                        <a href="?id=entry.id?string.computer">
                            <h3 class="entry-title">{{entry.title}}</h3>
                            <span class="entry-producer">{{entry.feedTitle}}</span>
                        </a>
                    </td>
                    <td class="col2">
                        <a target="_blank" ng-href="{{entry.origin}}">open</a>
                    </td>
                    <td class="col2">
                        <input ng-model="entry.seen" type="checkbox" name="id[]" value="{{entry.uuid}}">
                    </td>
                </tr>
            </table>

            <input class="read-button" type="submit" value="mark as read" ng-click="markAsRead()">
        </script>

        <@script id="mobile"></@script>
    </body>
</html>
