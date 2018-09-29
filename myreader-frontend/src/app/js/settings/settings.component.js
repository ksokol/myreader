import {getSettings, updateSettings} from '../store'

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux
    this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this)
  }

  $onDestroy() {
    this.unsubscribe()
  }

  mapStateToThis(state) {
    return {
      settings: getSettings(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      onChange: settings => dispatch(updateSettings(settings))
    }
  }

  get settingsProps() {
    return {
      settings: this.settings,
      onChange: this.onChange
    }
  }
}

/**
 * @deprecated
 */
export const SettingsComponent = {
  template: '<react-component name="Settings" props="$ctrl.settingsProps"></react-component>',
  controller
}
