import template from './entry.tags.component.html'

class controller {

    $onChanges(changes) {
        if (changes.myItem) {
            this.tags = this.myItem.tag ? this.myItem.tag.split(/[ ,]+/) : []
        }
    }

    onTagAdd(value) {
        if (this.tags.find(it => it === value)) {
            return
        }
        const tags = [...this.tags, value]
        this.myOnChange({tag: tags.join(", ")})
    }

    onTagRemove(key) {
        const tags = this.tags.filter(it => it !== key).join(", ")
        this.myOnChange({tag: tags.length > 0 ? tags : null})
    }
}

export const EntryTagsComponent = {
    template, controller,
    bindings: {
        myItem: '<',
        myShow: '<',
        myOnChange: '&'
    }
}
