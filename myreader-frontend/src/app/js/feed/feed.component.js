import template from './feed.component.html'
import './feed.component.css'
import {changeFeed, deleteFeed, feedFetchFailuresSelector, feedSelector, fetchFeedFetchFailures} from '../store'
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

    this.onSave = this.onSave.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  $onInit() {
    this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis.bind(this))(this)
  }

  $onDestroy() {
    this.unsubscribe()
  }

  mapStateToThis(state) {
    return {
      feed: feedSelector(state),
      ...feedFetchFailuresSelector(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      onMore: link => dispatch(fetchFeedFetchFailures(link))
    }
  }

  onSave() {
    this.validations = undefined
    this.pendingAction = true
    this.$ngRedux.dispatch(changeFeed(this.feed))
      .then(() => this.pendingAction = false)
      .catch(error => {
        if (error.status === 400) {
          this.validations = error.data.fieldErrors
        }
        this.pendingAction = false
      })
  }

  onDelete() {
    this.pendingAction = true
    this.$ngRedux.dispatch(deleteFeed(this.feed.uuid))
      .catch(error => {
        if (error.status === 400) {
          this.validations = error.data.fieldErrors
        }
        this.pendingAction = false
      })
  }

  get titleProps() {
    return {
      label: 'Title',
      name: 'title',
      value: this.feed.title || '',
      validations: this.validations,
      onChange: event => this.feed.title = event.target.value
    }
  }

  get urlProps() {
    return {
      type: 'url',
      label: 'Url',
      name: 'url',
      value: this.feed.url || '',
      validations: this.validations,
      onChange: event => this.feed.url = event.target.value
    }
  }

  get iconProps() {
    return {
      type: 'link'
    }
  }

  get feedFetchErrorsProp() {
    return {
      failures: this.failures,
      links: this.links,
      loading: this.fetchFailuresLoading,
      onMore: this.onMore
    }
  }

  get saveButtonProps() {
    return {
      children: 'Save',
      primary: true,
      disabled: this.pendingAction,
      onClick: this.onSave
    }
  }

  get deleteButtonProps() {
    return {
      children: 'Delete',
      caution: true,
      disabled: this.pendingAction,
      onClick: this.onDelete
    }
  }
}

export const FeedComponent = {
  template, controller
}
