import React from 'react'
import {SubscriptionNavigationItem} from '.'
import {mount} from 'enzyme'
import {ENTRIES_URL} from '../../../constants'

/* eslint-disable react/prop-types */
jest.mock('../../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))
/* eslint-enable */

class SubscriptionNavigationItemSubscriptionsWrapper {

  constructor(wrapper) {
    this.wrapper = wrapper
  }

  get exists() {
    return this.wrapper.exists()
  }

  get items() {
    return this.wrapper.find('NavigationItem')
  }

  itemAt(index) {
    return this.items.at(index)
  }

  itemPropsAt(index) {
    return this.itemAt(index).props()
  }

  itemKeyAt(index) {
    return this.itemAt(index).key()
  }

  itemClickAt(index) {
    this.itemPropsAt(index).onClick()
  }
}

class SubscriptionNavigationItemWrapper {

  constructor(props) {
    this.wrapper = mount(<SubscriptionNavigationItem {...props} />)
  }

  get item() {
    return this.wrapper.first().find('NavigationItem').first()
  }

  get subscriptions() {
    return new SubscriptionNavigationItemSubscriptionsWrapper(this.wrapper.find('ul'))
  }

  get itemProps() {
    return this.item.props()
  }

  get itemKey() {
    return this.item.key()
  }

  itemClick() {
    this.itemProps.onClick()
  }
}

describe('SubscriptionNavigationItem', () => {

  let props, subscriptions1, subscriptions2

  const createWrapper = () => new SubscriptionNavigationItemWrapper(props)

  beforeEach(() => {
    subscriptions1 = {title: 'subscription 1', uuid: 'uuid1', unseen: 1, feedTag: {name: 'tag'}}
    subscriptions2 = {title: 'subscription 2', uuid: 'uuid2', unseen: 0, feedTag: {name: 'tag'}}

    props = {
      item: {
        title: 'item title',
        unseen: 2,
        tag: 'tag',
        uuid: 'uuid',
        subscriptions: [subscriptions1, subscriptions2]
      },
      searchParams: {},
      onClick: jest.fn()
    }
  })

  it('should pass expected props to navigation item', () => {
    expect(createWrapper().itemProps).toEqual(expect.objectContaining({
      title: 'item title',
      badgeCount: 2,
      to: {
        pathname: ENTRIES_URL,
        search: '?feedTagEqual=tag&feedUuidEqual=uuid'
      }
    }))
  })

  it('should set key for navigation item', () => {
    expect(createWrapper().itemKey).toEqual(props.item.uuid)
  })

  it('should trigger prop function "onClick" when navigation item clicked', () => {
    createWrapper().itemClick()

    expect(props.onClick).toHaveBeenCalled()
  })

  it('should flag navigation item as selected when prop "query.feedUuidEqual" and "query.feedTagEqual" is not equal to item uuid and tag', () => {
    expect(createWrapper().itemProps).toEqual(expect.objectContaining({selected: false}))
  })

  it('should not flag navigation item as selected when prop "query.feedTagEqual" is not equal to item tag', () => {
    props.location = {
      search: `?feedUuidEqual=${props.item.uuid}`
    }

    expect(createWrapper().itemProps).toEqual(expect.objectContaining({selected: false}))
  })

  it('should not flag navigation item as selected when prop "query.feedUuidEqual" is not equal to item uuid', () => {
    props.location = {
      search: `?feedTagEqual=${props.item.tag}`
    }

    expect(createWrapper().itemProps).toEqual(expect.objectContaining({selected: false}))
  })

  it('should flag navigation item as selected when prop "query.feedUuidEqual" and "query.feedTagEqual" is equal to item uuid and tag', () => {
    props.searchParams = {
      feedTagEqual: props.item.tag,
      feedUuidEqual: props.item.uuid
    }

    expect(createWrapper().itemProps).toEqual(expect.objectContaining({selected: true}))
  })

  describe('', () => {

    beforeEach(() => {
      props.searchParams = {
        feedTagEqual: props.item.tag
      }
    })

    it('should not render navigation subscriptions when prop "query.feedTagEqual" is not equal to item tag', () => {
      props.searchParams = {}

      expect(createWrapper().subscriptions.exists).toEqual(false)
    })

    it('should not render navigation subscriptions when prop "item.subscriptions" is undefined', () => {
      props.item.subscriptions = null

      expect(createWrapper().subscriptions.exists).toEqual(false)
    })

    it('should render navigation subscriptions when prop "query.feedTagEqual" is equal to item tag', () => {
      expect(createWrapper().subscriptions.exists).toEqual(true)
    })

    it('should pass expected prop "to" with feedUuidEqual set', () => {
      props.item.tag = null

      expect(createWrapper().itemProps).toEqual(expect.objectContaining({
        title: 'item title',
        to : {
          pathname: ENTRIES_URL,
          search: '?feedUuidEqual=uuid'
        }
      }))
    })

    it('should pass expected prop "to" with feedTagEqual set', () => {
      props.item.uuid = ''

      expect(createWrapper().itemProps).toEqual(expect.objectContaining({
        title: 'item title',
        to : {
          pathname: ENTRIES_URL,
          search: '?feedTagEqual=tag'
        }
      }))
    })

    it('should pass expected prop "to" without search value set', () => {
      props.item.uuid = ''
      props.item.tag = null

      expect(createWrapper().itemProps).toEqual(expect.objectContaining({
        title: 'item title',
        to : {
          pathname: ENTRIES_URL
        }
      }))
    })

    it('should pass expected props to navigation subscription items', () => {
      const subscriptions = createWrapper().subscriptions

      expect(subscriptions.itemPropsAt(0)).toEqual(expect.objectContaining({
        title: 'subscription 1',
        badgeCount: 1,
        to : {
          pathname: ENTRIES_URL,
          search: '?feedTagEqual=tag&feedUuidEqual=uuid1'
        }
      }))
      expect(subscriptions.itemPropsAt(1)).toEqual(expect.objectContaining({
        title: 'subscription 2',
        badgeCount: 0,
        to: {
          pathname: ENTRIES_URL,
          search: '?feedTagEqual=tag&feedUuidEqual=uuid2'
        }
      }))
    })

    it('should set keys for navigation subscription items', () => {
      const subscriptions = createWrapper().subscriptions

      expect(subscriptions.itemKeyAt(0)).toEqual('uuid1')
      expect(subscriptions.itemKeyAt(1)).toEqual('uuid2')
    })

    it('should not flag any navigation subscription item as selected when prop "query.feedUuidEqual" is not equal to a subscription uuid', () => {
      const subscriptions = createWrapper().subscriptions

      expect(subscriptions.itemPropsAt(0)).toEqual(expect.objectContaining({selected: false}))
      expect(subscriptions.itemPropsAt(1)).toEqual(expect.objectContaining({selected: false}))
    })

    it('should flag first navigation subscription item as selected when prop "query.feedUuidEqual" is equal to first subscription uuid', () => {
      props.searchParams.feedUuidEqual = props.item.subscriptions[0].uuid
      const subscriptions = createWrapper().subscriptions

      expect(subscriptions.itemPropsAt(0)).toEqual(expect.objectContaining({selected: true}))
      expect(subscriptions.itemPropsAt(1)).toEqual(expect.objectContaining({selected: false}))
    })

    it('should flag second navigation subscription item as selected when prop "query.feedUuidEqual" is equal to second subscription uuid', () => {
      props.searchParams.feedUuidEqual = props.item.subscriptions[1].uuid
      const subscriptions = createWrapper().subscriptions

      expect(subscriptions.itemPropsAt(0)).toEqual(expect.objectContaining({selected: false}))
      expect(subscriptions.itemPropsAt(1)).toEqual(expect.objectContaining({selected: true}))
    })

    it('should trigger prop function "onClick" when first subscription navigation item clicked', () => {
      createWrapper().subscriptions.itemClickAt(0)

      expect(props.onClick).toHaveBeenCalled()
    })

    it('should trigger prop function "onClick" when second subscription navigation item clicked', () => {
      createWrapper().subscriptions.itemClickAt(1)

      expect(props.onClick).toHaveBeenCalled()
    })
  })
})
