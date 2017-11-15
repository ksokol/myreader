const url = '/myreader/api/2/exclusions';

function extractNextHref(links) {
    return links.filter(link => link.rel === 'next')[0];
}

export class ExclusionService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    findBy(next) {
        return this.$http.get('/myreader' + next.href);
    }

    collect(response) {
        const next = extractNextHref(response.data.links);

        if(!next) {
            return response.data.content;
        }

        return this.findBy(next)
            .then(response => this.collect(response))
            .then(inner => response.data.content.concat(inner));
    }

    find(uuid) {
        return this.findBy({href: `/api/2/exclusions/${uuid}/pattern`}).then(response => this.collect(response));
    }

    save(uuid, exclusion) {
        return this.$http.post(`${url}/${uuid}/pattern`, {pattern: exclusion}).then(response => response.data);
    }

    delete(subscriptionUuid, uuid) {
        return this.$http.delete(`${url}/${subscriptionUuid}/pattern/${uuid}`);
    }
}
