import template from './backdrop.component.html'
import './backdrop.component.css'
import {backdropIsVisible, hideBackdrop} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.isVisible = false
        this.isClosing = false
        this.isMounted = false

        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis.bind(this), this.mapDispatchToThis)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return this.onStateChange(backdropIsVisible(state))
    }

    mapDispatchToThis(dispatch) {
        return {
            onClick: () => dispatch(hideBackdrop())
        }
    }

    onStateChange(isVisible) {
        if (this.isVisible === isVisible) {
            return {}
        }
        clearTimeout(this.timeout)
        return this.isVisible ?
            (this.scheduleUnmount(), {isVisible, isClosing: true, isMounted: true}) :
            {isVisible: true, isClosing: false, isMounted: true}
    }

    scheduleUnmount() {
        this.timeout = setTimeout(() => {
            this.isVisible = false
            this.isClosing = false
            this.isMounted = false
        }, 300)
    }
}

export const BackdropComponent = {
    template, controller
}
