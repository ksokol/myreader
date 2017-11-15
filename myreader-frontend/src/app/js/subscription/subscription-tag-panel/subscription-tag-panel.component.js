import template from './subscription-tag-panel.component.html';

class controller {

    constructor(subscriptionTagService) {
        'ngInject';
        this.subscriptionTagService = subscriptionTagService;
    }

    loadTags() {
        return this.subscriptionTagService.findAll();
    }
}

export const SubscriptionTagPanelComponent = {
    template, controller,
    bindings: {
        mySelectedItem: '<',
        myDisabled: '<',
        myOnSelect: '&',
        myOnClear: '&'
    }
};
