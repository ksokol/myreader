import template from './about.component.html';

class controller {

    constructor(aboutService) {
        'ngInject';
        this.aboutService = aboutService;
        this.loading = true;
    }

    $onInit() {
        this.aboutService.getProperties()
            .then(properties => this.properties = properties)
            .catch(() => this.propertiesMissing = true)
            .finally(() => this.loading = false);
    }
}

export const AboutComponent = {
    template, controller
};
