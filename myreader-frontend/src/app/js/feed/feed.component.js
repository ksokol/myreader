import template from './feed.component.html'
import './feed.component.css'
import {changeFeed, deleteFeed, feedSelector} from '../store'
import {Input, withValidations} from '../components'

/**
 * @deprecated
 */
export const FeedTitleInput = withValidations(Input)

/**
 * @deprecated
 */
export const FeedUrlInput = withValidations(Input)

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux
  }

  $onInit() {
    this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis.bind(this))(this)
  }

  $onDestroy() {
    this.unsubscribe()
  }

  mapStateToThis(state) {
    return {
      feed: feedSelector(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      onSave: () => {
        this.validations = undefined
        return dispatch(changeFeed(this.feed))
      },
      onDelete: () => dispatch(deleteFeed(this.feed.uuid))
    }
  }

  onError(error) {
    if (error.status === 400) {
      this.validations = error.data.fieldErrors
    }
  }

  get titleProps() {
    return {
      label: 'Title',
      name: 'title',
      value: this.feed.title || '',
      validations: this.validations,
      onChange: value => this.feed.title = value
    }
  }

  get urlProps() {
    return {
      type: 'url',
      label: 'Url',
      name: 'url',
      value: this.feed.url || '',
      validations: this.validations,
      onChange: value => this.feed.url = value
    }
  }

  get iconProps() {
    return {
      type: 'link'
    }
  }
}

export const FeedComponent = {
  template, controller
}
