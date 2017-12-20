import template from './entry.component.html'
import './entry.component.css'
import {changeEntry} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onChanges(changes) {
        this.item = changes.myItem.currentValue
    }

    updateItem(item) {
        this.$ngRedux.dispatch(changeEntry(item))
    }

    toggleMore(showMore) {
        this.showMore = showMore
    }

    onCheck(item) {
        this.updateItem({
            uuid: this.item.uuid,
            seen: item.seen,
            tag: this.item.tag
        })
    }

    onTagUpdate(tag) {
        this.updateItem({
            uuid: this.item.uuid,
            seen: this.item.seen,
            tag
        })
    }
}

export const EntryComponent = {
    template, controller,
    bindings: {
        myItem: '<'
    }
}
