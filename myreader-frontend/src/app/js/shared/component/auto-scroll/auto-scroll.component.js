class controller {

    constructor($element) {
        'ngInject'
        this.$element = $element
        this.currentIndex = -1
    }

    $onChanges(obj) {
        if (obj.myScrollOn) {
            const [attrKey, attrValue] = Object.entries(obj.myScrollOn.currentValue)[0]
            if (attrKey && attrValue) {
                this.scrollTo(attrKey, attrValue)
            }
        }
    }

    scrollTo(attrKey, attrValue) {
        const children = this.$element.children()

        for (let index = 0; index < children.length; index++) {
            const child = children[index]

            if (angular.element(child).attr(attrKey) !== attrValue) {
                continue
            }

            this.currentIndex < index || this.currentIndex === index ?
                child.scrollIntoView({block: 'start', behavior: 'smooth'}) :
                child.scrollIntoView()

            this.currentIndex = index
            break
        }
    }
}

export const AutoScrollComponent = {
    controller,
    bindings: {
        myScrollOn: '<'
    }
}
