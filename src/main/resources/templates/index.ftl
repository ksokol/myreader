<!DOCTYPE html>
<html ng-app="myreader">
    <head>
        <title>MyReader</title>

        <link rel="icon" type="image/gif" href="${requestContext.getContextUrl("/static/img/favicon.gif")}">
        <@style id="mobile"></@style>
        <meta name="viewport" content="initial-scale=1">
    </head>
    <body layout="row" ui-view="body">

        <script type="text/ng-template" id="SubscriptionTags">
            <md-sidenav layout="column" class="site-sidenav md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia('gt-md')">
                <md-toolbar></md-toolbar>

                <md-content flex role="navigation">
                    <ul class="subscription-tag-menu">
                        <li class="md-2-line" ng-repeat="item in data.tags" class="parent-list-item" ng-class="{'parentActive' : isItemSelected(item)}" ng-show="visible(item)">
                            <md-button md-no-ink class="md-button-toggle" ng-click="toggleOpen(item)" my-click-broadcast="navigation-close">{{item | navigationItemTitle}}</md-button>
                            <ul ng-show="isOpen(item)" class="menu-toggle-list">
                                <li ng-repeat="subscription in item.subscriptions" ng-hide="subscription.unseen < 1">
                                    <md-button md-no-ink
                                               ng-class="{'active' : isSelected(subscription)}"
                                               ui-sref="app.entries({tag: subscription.tag, uuid: subscription.uuid})"
                                               my-click-broadcast="navigation-close">
                                        {{::subscription.title}} ({{subscription.unseen}})
                                    </md-button>
                                </li>
                            </ul>
                        </li>
                        <li class="md-2-line" ng-repeat="item in data.items" class="parent-list-item" ng-class="{'parentActive' : isItemSelected(item)}" ng-show="visible(item)">
                            <md-button md-no-ink class="md-button-toggle" ng-click="toggleOpen(item)">{{item | navigationItemTitle}}</md-button>
                        </li>
                        <li>
                            <md-button my-click-broadcast="navigation-close navigation-clear-selection" ui-sref="app.subscriptions">subscriptions</md-button>
                        </li>
                        <li ui-sref-active="hide">
                            <md-button my-click-broadcast="navigation-close" ui-sref="app.bookmarks">bookmarks</md-button>
                        </li>
                        <li ui-sref-active="hide">
                            <md-button my-click-broadcast="navigation-close" ui-sref="app.entries">Stream</md-button>
                        </li>
                        <li my-show-admin>
                            <md-button my-click-broadcast="navigation-close" ui-sref="app.admin">Admin</md-button>
                        </li>
                        <li>
                            <md-button my-click-broadcast="navigation-close" ui-sref="app.settings">Settings</md-button>
                        </li>
                        <li>
                            <!-- TODO -->
                            <md-button href="logout">logout</md-button>
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
                <my-list-item ng-class="{{isFocused(entry)}}" class="my-2-line" ng-repeat="entry in data.entries | filter: visible">
                    <div class="my-no-style my-list-item-inner">
                        <div layout="row">
                            <div class="my-list-item-text">
                                <div>
                                    <h3 hide-gt-md class="my-entry-title" ng-click="navigateToDetailPage(entry)">{{::entry.title | htmlEntities}}</h3>
                                    <h3 hide show-gt-md class="my-entry-title my-a" ng-click="openOrigin(entry)">{{::entry.title | htmlEntities}}</h3>
                                    <h4>
                                        <md-icon class="my-a" hide show-gt-md ng-click="toggleRead(entry)" md-font-library="material-icons">{{seenIcon(entry)}}</md-icon>
                                        {{::entry.createdAt | timeago}} on {{::entry.feedTitle | htmlEntities}}
                                    </h4>
                                </div>
                                <p hide show-gt-md ng-show="showDetails()" ng-bind-html="entry.content | targetBlank" my-wrap-entry-content></p>
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
            <md-button class="md-icon-button" ng-hide="isInvisible('gt-md')" ng-click="openMenu()" aria-label="Menu">
                <md-icon md-font-library="material-icons">menu</md-icon>
            </md-button>
            <h2>
                <span></span>
            </h2>

            <md-input-container ng-show="isInvisible('gt-md')" class="md-icon-float">
                <md-icon md-font-library="material-icons">search</md-icon>
                <input class="my-input"
                       ng-model="searchKey"
                       aria-label="Subscription search"
                       ng-keyup="onKey()"
                       my-enter-key="broadcast('search', searchKey)"
                       my-delete-key="broadcast('search', searchKey)">
            </md-input-container>

            <span flex></span>

            <md-button ng-hide="isInvisible('gt-md')" tabindex="-1" class="md-icon-button" aria-label="subscription search" ng-click="openSearch()">
                <md-icon md-font-library="material-icons">search</md-icon>
            </md-button>
            <md-button hide show-gt-md class="md-icon-button" hide-gt-md aria-label="Upload" ng-click="broadcast('move-down')">
                <md-icon md-font-library="material-icons">keyboard_arrow_down</md-icon>
            </md-button>
            <md-button hide show-gt-md class="md-icon-button" hide-gt-md aria-label="Upload" ng-click="broadcast('move-up')">
                <md-icon md-font-library="material-icons">keyboard_arrow_up</md-icon>
            </md-button>
            <md-button ng-hide="isInvisible()" class="md-icon-button" aria-label="Refresh" ng-click="broadcast('refresh')">
                <md-icon md-font-library="material-icons">refresh</md-icon>
            </md-button>
            <md-button ng-hide="isInvisible('gt-md')" class="md-icon-button" hide-gt-md aria-label="Upload" ng-click="broadcast('update')">
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
            <md-button class="md-icon-button" ng-hide="isInvisible('gt-md')" ng-click="openMenu()" aria-label="Menu">
                <md-icon md-font-library="material-icons">menu</md-icon>
            </md-button>
            <h2>
                <span></span>
            </h2>

            <md-input-container ng-show="isInvisible('gt-md')" class="md-icon-float">
                <md-icon md-font-library="material-icons">search</md-icon>
                <input class="my-input"
                       ng-model="searchKey"
                       aria-label="Subscription search"
                       ng-keyup="onKey()"
                       my-enter-key="broadcast('search', searchKey)"
                       my-delete-key="broadcast('search', searchKey)">
            </md-input-container>

            <span flex></span>

            <md-button ng-hide="isInvisible('gt-md')" tabindex="-1" class="md-icon-button" aria-label="subscription search" ng-click="openSearch()">
                <md-icon md-font-library="material-icons">search</md-icon>
            </md-button>
            <md-button ng-hide="isInvisible()" tabindex="-1" class="md-icon-button" aria-label="Open" ui-sref="app.subscription-add">
                <md-icon md-font-library="material-icons">add</md-icon>
            </md-button>
        </script>

        <script type="text/ng-template" id="SubscriptionActions">
            <md-button hide-gt-md class="md-icon-button" aria-label="Back" ng-click="back()">
                <md-icon md-font-library="material-icons">arrow_back</md-icon>
            </md-button>
            <h2>
                <span></span>
            </h2>
            <span flex></span>

            <md-button class="md-icon-button" aria-label="Save" ng-click="broadcast('delete')">
                <md-icon md-font-library="material-icons">delete</md-icon>
            </md-button>
            <md-button class="md-icon-button" aria-label="Open" ng-click="broadcast('open')">
                <md-icon md-font-library="material-icons">open_in_new</md-icon>
            </md-button>
            <md-button class="md-icon-button" aria-label="Save" ng-click="broadcast('save')">
                <md-icon md-font-library="material-icons">save</md-icon>
            </md-button>
        </script>

        <script type="text/ng-template" id="SubscriptionAddActions">
            <md-button hide-gt-md class="md-icon-button" aria-label="Back" ng-click="back()">
                <md-icon md-font-library="material-icons">arrow_back</md-icon>
            </md-button>
            <h2>
                <span></span>
            </h2>
            <span flex></span>

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
                <md-list-item ng-click="open(subscription)" md-no-ink class="md-2-line" ng-repeat="subscription in data.subscriptions | filter: search">
                    <div layout="row">
                        <div class="md-list-item-text">
                            <div>
                                <h3 class="my-entry-title" ng-click="navigateToDetailPage(entry)" tabindex="-1">{{::subscription.title | htmlEntities}}</h3>
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

                <md-input-container ng-hide="isEditForm()">
                    <label>Url</label>
                    <input required
                           name="origin"
                           ng-model="subscription.origin"
                           my-valid-syndication disable="isEditForm()"
                           ng-model-options="{ debounce: 500 }"
                           ng-disabled="subscriptionForm.origin.$pending">

                    <div ng-messages="subscriptionForm.origin.$error">
                        <div ng-message="required">required</div>
                        <div ng-message="validSyndication">This is not a valid syndication feed</div>
                    </div>
                </md-input-container>

                <md-input-container ng-show="isEditForm()">
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

        <script type="text/ng-template" id="AdminActions">
            <md-button class="md-icon-button" ng-hide="isInvisible('gt-md')" ng-click="openMenu()" aria-label="Menu">
                <md-icon md-font-library="material-icons">menu</md-icon>
            </md-button>
            <h2>
                <span></span>
            </h2>
            <span flex></span>


            <md-button ng-hide="isInvisible()" class="md-icon-button" aria-label="Build search index" ng-click="broadcast('build-search-index')">
                <md-icon md-font-library="material-icons">build</md-icon>
            </md-button>
            <md-button ng-hide="isInvisible()" class="md-icon-button" aria-label="Refresh" ng-click="broadcast('refresh')">
                <md-icon md-font-library="material-icons">refresh</md-icon>
            </md-button>
        </script>

        <script type="text/ng-template" id="Admin">
            <md-list>
                <md-list-item ng-click="openOrigin(feed)" md-no-ink class="md-2-line" ng-repeat="feed in data.feeds">
                    <div layout="row">
                        <div class="md-list-item-text">
                            <div>
                                <h3 class="my-entry-title" tabindex="-1">{{::feed.title | htmlEntities}}</h3>
                                <h4>
                                    {{::feed.createdAt | timeago}}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <md-divider></md-divider>
                </md-list-item>
            </md-list>
        </script>

        <script type="text/ng-template" id="SettingsActions">
            <md-button class="md-icon-button" ng-hide="isInvisible('gt-md')" ng-click="openMenu()" aria-label="Menu">
                <md-icon md-font-library="material-icons">menu</md-icon>
            </md-button>
            <h2>
                <span></span>
            </h2>
            <span flex></span>

            <md-button class="md-icon-button" aria-label="Save" ng-click="broadcast('save')">
                <md-icon md-font-library="material-icons">save</md-icon>
            </md-button>
        </script>

        <script type="text/ng-template" id="Settings">
            <form name="settingsForm">
                <label>Page size</label>
                <md-select ng-model="currentSize" placeholder="Page Size">
                    <md-option ng-repeat="size in sizes" value="{{size}}">{{size}}</md-option>
                </md-select>

                <label>Unseen entries only</label>
                <md-radio-group ng-model="showUnseenEntries">
                    <md-radio-button ng-value="true">true</md-radio-button>
                    <md-radio-button ng-value="false">false</md-radio-button>
                </md-radio-group>

                <label>Show entry details</label>
                <md-radio-group ng-model="showEntryDetails">
                    <md-radio-button ng-value="true">true</md-radio-button>
                    <md-radio-button ng-value="false">false</md-radio-button>
                </md-radio-group>
            </form>
        </script>

        <@script id="mobile"></@script>
    </body>
</html>