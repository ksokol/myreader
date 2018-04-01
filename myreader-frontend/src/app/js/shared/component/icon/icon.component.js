import './icon.component.css'

class controller {

    constructor($element) {
        'ngInject'
        this.element = $element[0]
    }

    $onInit() {
        this.element.classList.add(
            `my-icon__icon--${this.myType}`,
            `my-icon__icon--${this.myColor ? this.myColor : 'grey'}`
        )
    }
}

export const IconComponent = {
    controller,
    bindings: {
        myType: '@',
        myColor: '@'
    }
}
