import template from './chips.component.html'
import './chips.component.css'

class controller {

    $onInit() {
        this.chips = []
    }

    $onChanges() {
        (this.chips || []).forEach(it => it.disabled = this.isDisabled)
    }

    addChip(chip) {
        if (chip.myKey === this.mySelected) {
            chip.selected = true
        }
        chip.disabled = this.isDisabled
        chip.selectable = !!this.myOnSelect
        this.chips.push(chip)
    }

    removeChip(chip) {
        this.chips = this.chips.filter(it => it.myKey !== chip.myKey)
        this.myOnRemove({key: chip.myKey})
    }

    changeChipsInput(value) {
        this.myOnAdd({value})
    }

    get isDisabled() {
        return !this.myOnRemove || this.myDisabled
    }

}

/**
 * @deprecated
 */
export const ChipsComponent = {
    template, controller,
    transclude: true,
    bindings: {
        myPlaceholder: '<',
        myDisabled: '<',
        mySelected: '<',
        myOnSelect: '&?',
        myOnAdd: '&?',
        myOnRemove: '&?'
    }
}
