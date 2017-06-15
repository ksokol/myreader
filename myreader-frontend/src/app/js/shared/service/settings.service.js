(function () {
    'use strict';

    var utils = require('../../shared/utils');

    var Settings = function (json) {

        var source;

        try {
            source = JSON.parse(json) || {};
        } catch (e) {
            source = {};
        }

        return {
            getPageSize: function () {
                if (source.pageSize > 0 && source.pageSize <= 30) {
                    return source.pageSize;
                }
                return 10;
            },
            setPageSize: function (pageSize) {
                source.pageSize = (pageSize > 0 && pageSize <= 30) ? pageSize : 10;
            },
            isShowEntryDetails: function () {
                return utils.isBoolean(source.showEntryDetails) ? source.showEntryDetails : true;
            },
            setShowEntryDetails: function (showEntryDetails) {
                source.showEntryDetails = utils.isBoolean(showEntryDetails) ? showEntryDetails : true;
            },
            isShowUnseenEntries: function () {
                return utils.isBoolean(source.showUnseenEntries) ? source.showUnseenEntries : true;
            },
            setShowUnseenEntries: function (showUnseenEntries) {
                source.showUnseenEntries = utils.isBoolean(showUnseenEntries) ? showUnseenEntries : true;
            },
            toJson: function () {
                return JSON.stringify(source);
            }
        }
    };

    require('angular').module('myreader').service('settingsService', function() {

        var storageKey = 'myreader-settings';
        var settings = new Settings(localStorage.getItem(storageKey));

        var persistSettings = function () {
            localStorage.setItem(storageKey, settings.toJson());
        };

        return {
            getPageSize: settings.getPageSize,
            isShowUnseenEntries: settings.isShowUnseenEntries,
            isShowEntryDetails: settings.isShowEntryDetails,

            setPageSize: function(pageSize) {
                settings.setPageSize(pageSize);
                persistSettings();
            },
            setShowEntryDetails: function(showEntryDetails) {
                settings.setShowEntryDetails(showEntryDetails);
                persistSettings();
            },
            setShowUnseenEntries: function(showUnseenEntries) {
                settings.setShowUnseenEntries(showUnseenEntries);
                persistSettings();
            }
        }
    });
})();
