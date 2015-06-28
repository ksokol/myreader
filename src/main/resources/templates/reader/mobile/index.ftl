<!DOCTYPE html>
<html ng-app="myreader">
    <head>
        <title>MyReader</title>
        <@style id="mobile"></@style>
        <meta name="viewport" content="initial-scale=1">
    </head>
    <body layout="row" ui-view="body">

        <script type="text/ng-template" id="SubscriptionTags">
            <md-sidenav layout="column" class="site-sidenav md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia('gt-md')">
                <md-toolbar></md-toolbar>

                <md-content flex role="navigation">
                    <ul class="subscription-tag-menu">
                        <li class="md-2-line" ng-repeat="item in data.tags" class="parent-list-item" ng-class="{'parentActive' : isItemSelected(item)}" ng-hide="item.unseen < 1">
                            <md-button md-no-ink class="md-button-toggle" ng-click="toggleOpen(item)">{{::item.title}} ({{item.unseen}})</md-button>
                            <ul ng-show="isOpen(item)" class="menu-toggle-list">
                                <li ng-repeat="subscription in item.subscriptions" ng-hide="subscription.unseen < 1">
                                    <md-button md-no-ink
                                            ng-class="{'active' : isSelected(subscription)}"
                                            ui-sref="app.entries-tag-subscription({tag: subscription.tag, uuid: subscription.uuid})">
                                        {{::subscription.title}} ({{subscription.unseen}})
                                    </md-button>
                                </li>
                            </ul>
                        </li>
                        <li class="md-2-line" ng-repeat="item in data.subscriptions" class="parent-list-item" ng-class="{'parentActive' : isItemSelected(item)}" ng-hide="item.unseen < 1">
                            <md-button md-no-ink class="md-button-toggle" ng-click="toggleOpen(item)">{{::item.title}} ({{item.unseen}})</md-button>
                        </li>
                        <li>
                            <md-button ng-click="open('app.subscriptions')">subscriptions</md-button>
                        </li>
                        <li>
                            <!-- TODO -->
                            <md-button href="../web/logout">logout</md-button>
                        </li>
                    </ul>
                </md-content>
            </md-sidenav>
            <div layout="column" tabIndex="-1" role="main" flex>
                <md-toolbar >
                    <div ui-view="actions" class="md-toolbar-tools"></div>
                </md-toolbar>

                <div hide-gt-md id="md-progress-linear-wrapper">
                    <md-progress-linear loading-indicator md-mode="indeterminate"></md-progress-linear>
                </div>

                <md-content ui-view="content" md-scroll-y flex layout-padding ></md-content>
            </div>
        </script>

        <script type="text/ng-template" id="SubscriptionEntries">
            <my-list class="md-default-theme">
                <my-list-item class="my-2-line" ng-repeat="entry in data.entries | filter: visible">
                    <div class="my-no-style my-list-item-inner">
                        <div layout="row">
                            <div class="my-list-item-text">
                                <div>
                                    <h3 hide-gt-md class="my-entry-title" ng-click="navigateToDetailPage(entry)">{{::entry.title | htmlEntities}}</h3>
                                    <h3 hide show-gt-md class="my-entry-title my-a" ng-click="openOrigin(entry)">{{::entry.title | htmlEntities}}</h3>
                                    <h4>
                                        <md-icon class="my-a" hide show-gt-md ng-click="toogleRead(entry)" ng-hide="{{entry.seen}}" md-font-library="material-icons">{{seenIcon(entry)}}</md-icon>
                                        {{::entry.createdAt | timeago}} on {{::entry.feedTitle | htmlEntities}}
                                    </h4>
                                </div>
                                <p hide show-gt-md ng-bind-html="entry.content | targetBlank" my-wrap-entry-content></p>
                                <div hide-gt-md>
                                    <md-checkbox ng-change="markAsReadAndHide(entry)" class="my-secondary" ng-model="entry.seen" aria-label="Mark as seen"></md-checkbox>
                                </div>
                                <div>
                                    <my-entry-tags hide show-gt-md entry="entry"></my-entry-tags>
                                </div>
                            </div>
                        </div>

                        <my-divider class="my-default-theme"></my-divider>
                    </div>
                </my-list-item>
                <my-list-item align="center" ng-click="loadMore()" ng-show="data.next()">
                    <md-button>load more</md-button>
                </my-list-item>
            </my-list>
        </script>

        <script type="text/ng-template" id="SubscriptionEntry">
            <h3>{{::entry.title | htmlEntities}}</h3>
            <div layout="row">
                <div flex="50">
                    <md-select ng-options="" placeholder="none" ng-model="entry.tag">
                        <md-option ng-repeat="tag in availableTags" value="{{tag}}">{{tag}}</md-option>
                    </md-select>
                </div>
                <div flex="50">
                    <md-radio-group ng-model="entry.seen">
                        <md-radio-button ng-value="true">true</md-radio-button>
                        <md-radio-button ng-value="false">false</md-radio-button>
                    </md-radio-group>
                </div>
            </div>
            <div ng-bind-html="entry.content | targetBlank" my-wrap-entry-content></div>
        </script>

        <script type="text/ng-template" id="SubscriptionEntriesActions">
            <md-button class="md-icon-button" hide-gt-md ng-click="openMenu()" aria-label="Menu">
                <md-icon md-font-library="material-icons">menu</md-icon>
            </md-button>
            <h2>
                <span></span>
            </h2>
            <span flex></span>

            <md-button class="md-icon-button" aria-label="Refresh" ng-click="broadcast('refresh')">
                <md-icon md-font-library="material-icons">refresh</md-icon>
            </md-button>
            <md-button class="md-icon-button" hide-gt-md aria-label="Upload" ng-click="broadcast('update')">
                <md-icon md-font-library="material-icons">file_upload</md-icon>
            </md-button>
        </script>

        <script type="text/ng-template" id="SubscriptionEntryActions">
            <md-button class="md-icon-button" aria-label="Back" ng-click="back()">
                <md-icon md-font-library="material-icons">arrow_back</md-icon>
            </md-button>
            <h2>
                <span></span>
            </h2>
            <span flex></span>

            <md-button class="md-icon-button" aria-label="Hide" ng-click="broadcast('hide')">
                <md-icon md-font-library="material-icons">visibility_off</md-icon>
            </md-button>
            <md-button class="md-icon-button" aria-label="Open" ng-click="broadcast('open')">
                <md-icon md-font-library="material-icons">open_in_new</md-icon>
            </md-button>
            <md-button class="md-icon-button" aria-label="Save" ng-click="broadcast('save')">
                <md-icon md-font-library="material-icons">save</md-icon>
            </md-button>
        </script>

        <script type="text/ng-template" id="SubscriptionsActions">
            <md-button class="md-icon-button" hide-gt-md ng-click="openMenu()" aria-label="Menu">
                <md-icon md-font-library="material-icons">menu</md-icon>
            </md-button>
            <h2>
                <span></span>
            </h2>
        </script>

        <script type="text/ng-template" id="SubscriptionActions">
            <md-button hide-gt-md class="md-icon-button" aria-label="Back" ng-click="back()">
                <md-icon md-font-library="material-icons">arrow_back</md-icon>
            </md-button>
            <h2>
                <span></span>
            </h2>
            <span flex></span>

            <md-button class="md-icon-button" aria-label="Open" ng-click="broadcast('open')">
                <md-icon md-font-library="material-icons">open_in_new</md-icon>
            </md-button>
            <md-button class="md-icon-button" aria-label="Save" ng-click="broadcast('save')">
                <md-icon md-font-library="material-icons">save</md-icon>
            </md-button>
        </script>

        <script type="text/ng-template" id="Tags">
            <md-chips class="my-tag-chips" ng-model="tags" md-on-append="addTag($chip)">
                <md-chip-template>
                    <span>
                      <strong>{{$chip}}</strong>
                    </span>
                </md-chip-template>
                <button md-chip-remove ng-click="removeTag($chip)" class="md-primary my-tag-chip">
                    <md-icon md-font-library="material-icons">close</md-icon>
                </button>
            </md-chips>
        </script>

        <script type="text/ng-template" id="Subscriptions">
            <md-list>
                <md-list-item ng-click="open(subscription)" md-no-ink class="md-2-line" ng-repeat="subscription in data.subscriptions">
                    <div layout="row">
                        <div class="md-list-item-text">
                            <div>
                                <h3 class="my-entry-title" ng-click="navigateToDetailPage(entry)">{{::subscription.title | htmlEntities}}</h3>
                                <h4>
                                    {{::subscription.createdAt | timeago}}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <md-divider></md-divider>
                </md-list-item>
            </md-list>
        </script>

        <script type="text/ng-template" id="Subscription">
            <form name="subscriptionForm">
            <md-input-container>
                <label>Title</label>
                <input required name="title" ng-model="subscription.title">
                <div  ng-messages="subscriptionForm.title.$error">
                    <div ng-message="required">required</div>
                </div>
            </md-input-container>

            <md-input-container>
                <label>Url</label>
                <input ng-model="subscription.origin" disabled>
            </md-input-container>

            <md-autocomplete
                    md-selected-item="subscription.tag"
                    md-search-text="searchText"
                    md-items="item in querySearch(searchText)"
                    md-item-text="item"
                    md-min-length="0"
                    md-floating-label="Tag">
                <md-item-template>
                    <span md-highlight-text="searchText" md-highlight-flags="^i">{{item}}</span>
                </md-item-template>
            </md-autocomplete>

            <my-exclusions ng-show="subscription.uuid" subscription="subscription"></my-exclusions>
                </form>
        </script>

        <script type="text/ng-template" id="Exclusions">
            <h2 class="md-title">Subscription entries to ignore</h2>
            <md-chips class="my-tag-chips" ng-model="exclusions" md-on-append="addTag($chip)">
                <md-chip-template>
                    <span>
                      <strong>{{$chip.pattern}}</strong>
                        <em>({{$chip.hitCount}})</em>
                    </span>
                </md-chip-template>
                <button md-chip-remove ng-click="removeTag($chip.uuid)" class="md-primary my-tag-chip">
                    <md-icon md-font-library="material-icons">close</md-icon>
                </button>
            </md-chips>
        </script>
        <@script id="mobile"></@script>
    </body>
</html>
