angular.module('common.controllers', ['common.services'])

.controller('NavigationBarCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

    $scope.refresh = function() {
        $rootScope.$broadcast('refresh');
    }
}])

.controller('SubscriptionNavigationCtrl', ['$scope', 'subscriptionTagService', function($scope, subscriptionTagService) {
    $scope.data = {
        tags: [],
        subscriptions: []
    };

    var refresh = function() {
        subscriptionTagService.findAllByUnseen(true)
        .then(function (data) {
            $scope.data = data;
        });
    };

    $scope.refresh = function() {
        refresh();
    };

    $scope.$on('refresh', function() {
        refresh();
    });

    refresh();

}])

.controller('SubscriptionEntryListCtrl', ['$scope', '$stateParams', 'subscriptionEntryService', function($scope, $stateParams, subscriptionEntryService) {

    $scope.data = [];
    $scope.param = $stateParams;

    var refresh = function(param) {
        subscriptionEntryService.findBy(param)
        .then(function(data) {
            $scope.data = data;
        })
    };

    var params = function() {
        var param = {};
        if($stateParams.uuid) {
            param['feedUuidEqual'] = $stateParams.uuid;
        }
        if($stateParams.tag) {
            param['feedTagEqual'] = $stateParams.tag;
        }
        //TODO
        param['seenEqual'] = false;
        return param;
    };

    $scope.markAsRead = function(){
        var selected = [];
        var tmp = [];
        angular.forEach($scope.data, function(entry) {
            if(entry.seen) {
                selected.push(entry);
            } else {
                tmp.push(entry);
            }
        });

        if(selected.length > 0) {
            subscriptionEntryService.updateEntries(selected)
            .then(function() {
                $scope.data = tmp;
            });
        }
    };

    $scope.$on('refresh', function() {
        refresh(params());
    });

    refresh(params())

}])

.controller('SubscriptionEntryCtrl', ['$rootScope', '$scope', '$stateParams', '$previousState', 'subscriptionEntryService', 'subscriptionTagService', function($rootScope, $scope, $stateParams, $previousState, subscriptionEntryService, subscriptionTagService) {

    $scope.entry = {};
    $scope.availableTags = [];

    if($stateParams.uuid) {
        subscriptionEntryService.findOne($stateParams.uuid)
        .then(function(data) {
            $scope.entry = data.entry;
            $scope.availableTags = data.availableTags;
        });
    }

    $scope.save = function() {
        subscriptionEntryService.save($scope.entry)
        .then(function(data) {
            $scope.entry = data.entry;
            $scope.availableTags = data.availableTags;
            $rootScope.$broadcast('success', "saved");
        });
    };

    $scope.back = function() {
        $previousState.go()
    };

}]);

