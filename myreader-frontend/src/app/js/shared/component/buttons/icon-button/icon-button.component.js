import template from './icon-button.component.html'
import './icon-button.component.css'

/**
 * @deprecated
 */
class controller {

  get props() {
    return {
      type: this.myType,
      color: this.myColor
    }
  }
}

/**
 * @deprecated
 */
export const IconButtonComponent = {
  template, controller,
  bindings: {
    myType: '@',
    myColor: '@'
  }
}
