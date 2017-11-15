const url = '/myreader/api/2/processing';

export class ProcessingService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    rebuildSearchIndex() {
        return this.$http.put(url, {process: 'indexSyncJob'});
    }
}
