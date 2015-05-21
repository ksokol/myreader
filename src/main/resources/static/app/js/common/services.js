angular.module('common.services', ['common.api'])

.service('subscriptionTagService', ['api', function(api) {

    return {
        findAllByUnseen: function(unseen) {
            var withUnseen = unseen ? '?unseenGreaterThan=0' : '';
            return api.get('subscriptionTag', '/myreader/api/2/subscriptions' + withUnseen);
        }
    }
}])

.service('subscriptionEntryService', ['api', function(api) {
     var url = '/myreader/api/2/subscriptionEntries?';
     var url2 = '/myreader/api/2/subscriptionEntries';

    return {
        findBy: function(params) {
            var tmp = url;
            for(key in params) {
                tmp += "&" + key + "=" + params[key]
            }
            return api.get('subscriptionEntries', tmp);
        },
        updateEntries: function(entries) {
            return api.patch('subscriptionEntries', url, entries);
        },
        findOne: function(id) {
            return api.get('subscriptionEntry', url2 + '/' + id);
        },
        save: function(entry) {
            return api.patch('subscriptionEntry', url2 + '/' + entry.uuid, entry);
        }
    }
}]);
