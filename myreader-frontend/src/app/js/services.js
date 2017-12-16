import angular from 'angular';
import {Bookmarks, SubscriptionTags} from './models';
import {getPageSize, isShowUnseenEntries} from "./store/settings/settings";
import {entryPageReceived, entryUpdated} from './store/entry/index';

angular.module('common.services', [])

.service('subscriptionsTagService', ['$rootScope', '$http', function($rootScope, $http) {

    var cache = {
        decrementSubscriptionUnseen: function () {},
        incrementSubscriptionUnseen: function () {}
    };

    $rootScope.$on('subscriptionEntry:updateEntries', function(event, subscriptionEntries) {
        if(subscriptionEntries === undefined || subscriptionEntries.length === 0) {
            return;
        }

        for(var i=0;i<subscriptionEntries.length;i++) {
            if(subscriptionEntries[i].seen) {
                cache.decrementSubscriptionUnseen(subscriptionEntries[i].feedUuid);
            } else {
                cache.incrementSubscriptionUnseen(subscriptionEntries[i].feedUuid)
            }
        }
    });

    return {
        findAllByUnseen: function(unseen) {
            var withUnseen = unseen ? '?unseenGreaterThan=0' : '';

            return $http.get('/myreader/api/2/subscriptions' + withUnseen)
                .then(function(response) {
                    cache = new SubscriptionTags(response.data.content);
                    return cache;
                });
        }
    }
}])

.service('subscriptionEntryService', ['$ngRedux', '$rootScope', '$http', '$q', function($ngRedux, $rootScope, $http, $q) {
    var url = '/myreader/api/2/subscriptionEntries?';

    return {
        findBy: function(params) {
            var tmp = url;

            if(angular.isString(params)) {
                tmp = params;
            } else {
                if (!params['size']) {
                    params['size'] = getPageSize();
                }

                if (!params['seenEqual']) {
                    if(isShowUnseenEntries()) {
                        params['seenEqual'] = false;
                    }
                }

                for(var key in params) {
                    if (params.hasOwnProperty(key)) {
                        tmp += "&" + key + "=" + params[key];
                    }
                }
            }

            return $http.get(tmp)
                .then(function (response) {
                    $ngRedux.dispatch(entryPageReceived(response.data));
                    return response.data.content;
                });
        },
        updateEntries: function(entries) {
            var converted = [];
            angular.forEach(entries, function(val) {
                if(angular.isString(val.uuid) && val.uuid.length > 0) {
                    var obj = {};
                    obj["uuid"] = val.uuid;

                    if(val.seen === true || val.seen === false) {
                        obj["seen"] = val.seen;
                    }

                    if(angular.isDefined(val.tag)) {
                        obj["tag"] = val.tag;
                    }

                    converted.push(obj);
                }
            });

            return $http.patch(url, {content: converted})
                .then(function (response) {
                    $ngRedux.dispatch(entryUpdated(response.data.content[0]));
                    $rootScope.$broadcast('subscriptionEntry:updateEntries', response.data.content);
                    return response.data.content;
                });
        },
        save: function(entry) {
            var deferred = $q.defer();

            this.updateEntries([entry])
            .then(function (data) {
                deferred.resolve(data[0]);
            })
            .catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }
}])

.service('bookmarkService', ['$http', function($http) {
    var url = '/myreader/api/2/subscriptionEntries/availableTags';

    return {
        findAll: function() {
            return $http.get(url)
                .then(function (response) {
                    return new Bookmarks(response.data);
                });
        }
    }
}]);
