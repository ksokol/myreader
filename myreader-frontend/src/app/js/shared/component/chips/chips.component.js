class controller {

    $onInit() {
        this.chips = []
    }

    addChip(chip) {
        if (chip.equals(this.mySelected)) {
            chip.select()
        }
    }
}

export const ChipsComponent = {
    controller,
    template: `<ng-transclude></ng-transclude>`,
    transclude: true,
    bindings: {
        mySelected: '<',
        myOnSelect: '&'
    }
}
