const keyCodeMap = {
    13: 'enter',
    27: 'esc',
    38: 'up',
    40: 'down'
}

class controller {

    $onInit() {
        this.myHotkeys = this.myHotkeys || {}
        this.keyDownBindFn = this.onKeyDown.bind(this)
        document.addEventListener('keydown', this.keyDownBindFn)
    }

    $onDestroy() {
        document.removeEventListener('keydown', this.keyDownBindFn)
    }

    onKeyDown(event) {
        Object.entries(this.myHotkeys).forEach(([key, fn]) => {
            if (keyCodeMap[event.keyCode] === key || event.key === key) {
                event.stopPropagation()
                event.preventDefault()
                // TODO patched setTimeout required for Angular's digest cycle
                setTimeout(() => fn.call(this.myBindTo))
            }
        })
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
