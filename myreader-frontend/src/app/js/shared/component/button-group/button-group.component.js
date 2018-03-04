class controller {

    constructor() {
        this.buttons = [];
    }

    disableButtons() {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].disable();
        }
    }

    enableButtons() {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].enable();
        }
    }

    addButton(button) {
        this.buttons.push(button);
    }
}

export const ButtonGroupComponent = {
    template: '<ng-transclude></ng-transclude>',
    transclude: true,
    controller
};
