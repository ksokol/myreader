const url = '/myreader/info';

export class About {

    constructor(raw) {
        this.branch = raw.git.branch;
        this.commitId = raw.git.commit.id;
        this.version = raw.build.version;
        this.buildTime = raw.build.time;
    }
}

export class AboutService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    getProperties() {
        return this.$http.get(url).then(response => new About(response.data));
    }
}
