const url = '/myreader/api/2/exclusions';

export class ExclusionService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    save(uuid, exclusion) {
        return this.$http.post(`${url}/${uuid}/pattern`, {pattern: exclusion}).then(response => response.data);
    }
}
