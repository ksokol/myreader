import css from './icon.component.css';

class controller {

    constructor() {
        this.iconColor = 'my-icon__icon--grey';
    }
    $onInit() {
        this.iconClass = 'my-icon__icon--' + this.myType;

        if (this.myColor) {
            this.iconColor = 'my-icon__icon--' + this.myColor;
        }
    }
}

export const IconComponent = {
    template: '<md-icon class="my-icon" ng-class="[$ctrl.iconClass, $ctrl.iconColor]"></md-icon>',
    controller, css,
    bindings: {
        myType: '@',
        myColor: '@'
    }
};
