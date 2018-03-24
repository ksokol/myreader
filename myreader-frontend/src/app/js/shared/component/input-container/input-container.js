import './input-container.css'

export const InputContainer = {
    template: `<ng-transclude ng-class="{'my-input-container--error': $ctrl.error}"></ng-transclude>`,
    transclude: true
}