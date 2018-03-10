import template from './chip.component.html'
import './chip.component.css'

class controller {

    $onInit() {
        this.myChips.addChip(this)
    }

    onSelect() {
        if (!this.selected) {
            this.myChips.myOnSelect({key: this.myKey})
        }
    }

    onRemove() {
        this.myChips.removeChip(this)
    }
}

export const ChipComponent = {
    template, controller,
    transclude: true,
    require: {
        myChips: '^myChips'
    },
    bindings: {
        myKey: '<'
    }
}
