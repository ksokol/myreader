import template from './subscription-exclusion-panel.component.html';
import './subscription-exclusion-panel.component.css';

class controller {

    open() {
        this.firstOpen = true;
        this.showExclusions = true;
    }

    close() {
        this.showExclusions = false;
    }
}

export const SubscriptionExclusionPanelComponent = {
    template, controller,
    bindings: {
        myId: '<',
        myDisabled: '<',
        myOnError: '&'
    }
};
