var angular = require('angular');
var models = require('./models');

angular.module('common.api', [])

.service('conversionService', ['$injector', function ($injector) {
    return {
        convertFrom: function (resourceType, data) {
            return $injector.get(resourceType + "Converter").convertFrom(data);
        },
        convertTo: function (resourceType, data) {
            return $injector.get(resourceType + "Converter").convertTo(data);
        },
        convertError: function (resourceType, data, statusCode) {
            return $injector.get(resourceType + "Converter").convertError(data, statusCode);
        }
    }
}])

.service('api', ['$http', '$q', 'conversionService', function ($http, $q, conversionService) {
    return {
        get: function (resourceType, url) {
            var deferred = $q.defer();
            $http.get(url)
            .success(function (data) {
                deferred.resolve(conversionService.convertFrom(resourceType, data));
            })
            .error(function(error, statusCode) {
                deferred.reject(conversionService.convertError(resourceType, error, statusCode));
            });
            return deferred.promise;
        },
        patch: function(resourceType, url, data) {
            var converted = conversionService.convertTo(resourceType, data);
            var deferred = $q.defer();
            $http.patch(url, converted)
            .success(function (data) {
                deferred.resolve(conversionService.convertFrom(resourceType, data));
            })
            .error(function(error, statusCode) {
                deferred.reject(conversionService.convertError(resourceType, error, statusCode));
            });
            return deferred.promise;
        },
        post: function(resourceType, url, data) {
            var converted = conversionService.convertTo(resourceType, data);
            var deferred = $q.defer();
            $http.post(url, converted)
            .success(function (data) {
                deferred.resolve(conversionService.convertFrom(resourceType, data));
            })
            .error(function(error, statusCode) {
                deferred.reject(conversionService.convertError(resourceType, error, statusCode));
            });
            return deferred.promise;
        },
        put: function(resourceType, url, data) {
            var converted = conversionService.convertTo(resourceType, data);
            var deferred = $q.defer();
            $http.put(url, converted)
            .success(function (data) {
                deferred.resolve(conversionService.convertFrom(resourceType, data));
            })
            .catch(function(error) {
                deferred.reject(conversionService.convertError(resourceType, error));
            });
            return deferred.promise;
        },
        delete: function(resourceType, url) {
            var deferred = $q.defer();
            $http.delete(url)
            .success(function () {
                deferred.resolve();
            })
            .error(function(error, statusCode) {
                deferred.reject(conversionService.convertError(resourceType, error, statusCode));
            });
            return deferred.promise;
        }
    }
}]);

module.exports = 'api';
