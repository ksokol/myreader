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

    return {
        findBy: function(params) {
            var tmp = url;
            for(key in params) {
                tmp += "&" + key + "=" + params[key]
            }
            return api.get('subscriptionEntry', tmp);
        },
        updateEntries: function(entries) {
            return api.patch('subscriptionEntry', url, entries);
        }
    }
}]);
