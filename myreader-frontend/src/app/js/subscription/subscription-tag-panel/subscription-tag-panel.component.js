import template from './subscription-tag-panel.component.html'

/**
 * @deprecated
 */
export const SubscriptionTagPanelComponent = {
    template,
    bindings: {
        mySelectedItem: '<',
        myValues: '<',
        myDisabled: '<',
        myOnSelect: '&',
        myOnClear: '&'
    }
}
