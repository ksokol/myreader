import template from './subscription-exclusion-panel.component.html';

class controller {

    open() {
        this.firstOpen = true;
        this.showExclusions = true;
    }

    close() {
        this.showExclusions = false;
    }
}

/**
 * @deprecated
 */
export const SubscriptionExclusionPanelComponent = {
    template, controller,
    bindings: {
        myId: '<',
        myDisabled: '<',
        myOnError: '&'
    }
};
