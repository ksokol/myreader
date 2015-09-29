var myMock = {
    providerWithObj: function (providerName, getFnObj) {
        var obj = {};

        obj[providerName] = function () {
            return {
                $get: function () {
                    return getFnObj;
                }
            };
        };

        return obj;
    },

    provider: function (providerNames) {
        if (angular.isString(providerNames)) {
            providerNames = [providerNames];
        }

        var obj = {};

        for (var i = 0; i < providerNames.length; i++) {
            var providerName = providerNames[i];
            obj[providerName] = myMock.providerWithObj(providerName, {})[providerName];
        }

        return obj;
    }
};

var myMatchers = function() {
    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });

        //TODO remove when fail() in jasmine is available
        this.addMatchers({
            toBeCalled: function() {
                return true;
            }
        });
    });
};
