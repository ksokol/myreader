import template from './feed-fetch-error-panel.component.html';
import css from './feed-fetch-error-panel.component.css';

class controller {

    open() {
        this.firstOpen = true;
        this.showErrors = true;
    }

    close() {
        this.showErrors = false;
    }
}

export const FeedFetchErrorPanelComponent = {
    template, css, controller,
    bindings: {
        myId: '<',
        myOnError: '&'
    }
};
