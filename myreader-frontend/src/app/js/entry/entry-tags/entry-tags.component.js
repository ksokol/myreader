import template from './entry.tags.component.html';

class controller {

    $onInit() {
      this.tags = this.myItem.tag ? this.myItem.tag.split(/[ ,]+/) : [];
    }

    onTagChange() {
        this.myOnChange({tag: this.tags.join(", ")});
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
