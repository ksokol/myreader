import angular from 'angular';
import {Bookmarks} from './models';
import {getPageSize, isShowUnseenEntries} from './store/settings/index';
import {entryPageReceived, entryChanged} from './store/entry/index';
import {showErrorNotification} from './store/common/index';

angular.module('common.services', [])

.service('subscriptionEntryService', ['$ngRedux', '$http', function($ngRedux, $http) {
    var url = '/myreader/api/2/subscriptionEntries';

    return {
        findBy: function(params) {
            var tmp = url + '?';

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

            return $http.get(tmp)
                .then(function (response) {
                    $ngRedux.dispatch(entryPageReceived(response.data));
                    return response.data.content;
                }).catch(function (error) {
                    $ngRedux.dispatch(showErrorNotification(error));
                });
        },
        save: function(entry) {
            var obj = {};

            if(entry.seen === true || entry.seen === false) {
                obj["seen"] = entry.seen;
            }

            if(angular.isDefined(entry.tag)) {
                obj["tag"] = entry.tag;
            }

            return $http.patch(url + '/' + entry.uuid, obj)
                .then(function (response) {
                    $ngRedux.dispatch(entryChanged(response.data));
                    return response.data;
                }).catch(function (error) {
                    $ngRedux.dispatch(showErrorNotification(error));
                });
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
