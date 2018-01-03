import * as Mousetrap from 'mousetrap'

class controller {

    $onInit() {
        this.myHotkeys = this.myHotkeys || {}

        Object.entries(this.myHotkeys).forEach(([key, fn]) => {
            Mousetrap.bind(key, event => {
                event.preventDefault()
                fn.call(this.myBindTo)
            })
        })
    }

    $onDestroy() {
        Object.keys(this.myHotkeys).forEach(it => Mousetrap.unbind(it))
    }
}


export const HotkeysComponent = {
    controller,
    template: '<ng-transclude></ng-transclude>',
    transclude: true,
    bindings: {
        myBindTo: '<',
        myHotkeys: '<'
    }
}
