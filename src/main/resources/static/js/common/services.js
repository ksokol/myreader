angular.module('common.services', ['common.api'])

.service('subscriptionTagService', ['api', function(api) {

    return {
        findAllByUnseen: function(unseen) {
            var withUnseen = unseen ? '?unseenGreaterThan=-1' : '';
            return api.get('subscriptionTag', '/myreader/api/2/subscriptions' + withUnseen);
        }
    }
}]);
