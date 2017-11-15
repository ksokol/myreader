import {PROCESSING} from "../../constants";

export class ProcessingService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    rebuildSearchIndex() {
        return this.$http.put(PROCESSING, {process: 'indexSyncJob'});
    }
}
