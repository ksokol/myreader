import template from './about.component.html'
import {applicationInfoSelector} from '../../store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            applicationInfo: applicationInfoSelector(state)
        }
    }
}

export const AboutComponent = {
    template, controller
}
