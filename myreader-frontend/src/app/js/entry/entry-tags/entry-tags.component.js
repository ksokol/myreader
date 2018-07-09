import React from 'react'

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

  get props() {
    return {
      keyFn: props => props,
      values: this.tags,
      placeholder: 'Enter a tag...',
      onAdd: value => this.onTagAdd(value),
      onRemove: value => this.onTagRemove(value),
      renderItem: props => props
    }
  }
}

export const EntryTagsComponent = {
  controller,
  template: '<react-component ng-if="$ctrl.myShow" name="Chips" props="$ctrl.props"></react-component>',
  bindings: {
    myItem: '<',
    myShow: '<',
    myOnChange: '&'
  }
}
