import React from 'react'
import {SubscriptionNavigationItem} from '.'
import {NavigationItem} from '..'
import {shallow} from 'enzyme'

class SubscriptionNavigationItemSubscriptionsWrapper {

  constructor(wrapper) {
    this.wrapper = wrapper
  }

  get exists() {
    return this.wrapper.exists()
  }

  get items() {
    return this.wrapper.find(NavigationItem)
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
    this.wrapper = shallow(<SubscriptionNavigationItem {...props} />)
  }

  get item() {
    return this.wrapper.first().find(NavigationItem)
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

  let props

  const createWrapper = () => new SubscriptionNavigationItemWrapper(props)

  beforeEach(() => {
    props = {
      item: {
        title: 'item title',
        unseen: 2,
        tag: 'tag',
        uuid: 'uuid',
        subscriptions: [
          {title: 'subscription 1', tag: 'tag', uuid: 'uuid1', unseen: 1},
          {title: 'subscription 2', tag: 'tag', uuid: 'uuid2', unseen: 0}
        ]
      },
      query: {},
      onClick: jest.fn()
    }
  })

  it('should pass expected props to navigation item', () => {
    expect(createWrapper().itemProps).toContainObject({
      title: 'item title',
      badgeCount: 2
    })
  })

  it('should set key for navigation item', () => {
    expect(createWrapper().itemKey).toEqual(props.item.uuid)
  })

  it('should trigger prop function "onClick" when navigation item clicked', () => {
    createWrapper().itemClick()

    expect(props.onClick).toHaveBeenCalledWith({feedTagEqual: 'tag', feedUuidEqual: 'uuid'})
  })

  it('should flag navigation item as selected when prop "query.feedUuidEqual" and "query.feedTagEqual" is not equal to item uuid and tag', () => {
    expect(createWrapper().itemProps).toContainObject({selected: false})
  })

  it('should not flag navigation item as selected when prop "query.feedTagEqual" is not equal to item tag', () => {
    props.query.feedUuidEqual = props.item.uuid

    expect(createWrapper().itemProps).toContainObject({selected: false})
  })

  it('should not flag navigation item as selected when prop "query.feedUuidEqual" is not equal to item uuid', () => {
    props.query.feedTagEqual = props.item.tag

    expect(createWrapper().itemProps).toContainObject({selected: false})
  })

  it('should flag navigation item as selected when prop "query.feedUuidEqual" and "query.feedTagEqual" is equal to item uuid and tag', () => {
    props.query.feedUuidEqual = props.item.uuid
    props.query.feedTagEqual = props.item.tag

    expect(createWrapper().itemProps).toContainObject({selected: true})
  })

  describe('', () => {

    beforeEach(() => props.query.feedTagEqual = props.item.tag)

    it('should not render navigation subscriptions when prop "query.feedTagEqual" is not equal to item tag', () => {
      props.query.feedTagEqual = undefined

      expect(createWrapper().subscriptions.exists).toEqual(false)
    })

    it('should not render navigation subscriptions when prop "item.subscriptions" is undefined', () => {
      props.item.subscriptions = undefined

      expect(createWrapper().subscriptions.exists).toEqual(false)
    })

    it('should render navigation subscriptions when prop "query.feedTagEqual" is equal to item tag', () => {
      expect(createWrapper().subscriptions.exists).toEqual(true)
    })

    it('should pass expected props to navigation subscription items', () => {
      const subscriptions = createWrapper().subscriptions

      expect(subscriptions.itemPropsAt(0)).toContainObject({
        title: 'subscription 1',
        badgeCount: 1
      })
      expect(subscriptions.itemPropsAt(1)).toContainObject({
        title: 'subscription 2',
        badgeCount: 0
      })
    })

    it('should set keys for navigation subscription items', () => {
      const subscriptions = createWrapper().subscriptions

      expect(subscriptions.itemKeyAt(0)).toEqual('uuid1')
      expect(subscriptions.itemKeyAt(1)).toEqual('uuid2')
    })

    it('should not flag any navigation subscription item as selected when prop "query.feedUuidEqual" is not equal to a subscription uuid', () => {
      const subscriptions = createWrapper().subscriptions

      expect(subscriptions.itemPropsAt(0)).toContainObject({selected: false})
      expect(subscriptions.itemPropsAt(1)).toContainObject({selected: false})
    })

    it('should flag first navigation subscription item as selected when prop "query.feedUuidEqual" is equal to first subscription uuid', () => {
      props.query.feedUuidEqual = props.item.subscriptions[0].uuid

      const subscriptions = createWrapper().subscriptions

      expect(subscriptions.itemPropsAt(0)).toContainObject({selected: true})
      expect(subscriptions.itemPropsAt(1)).toContainObject({selected: false})
    })

    it('should flag second navigation subscription item as selected when prop "query.feedUuidEqual" is equal to second subscription uuid', () => {
      props.query.feedUuidEqual = props.item.subscriptions[1].uuid

      const subscriptions = createWrapper().subscriptions

      expect(subscriptions.itemPropsAt(0)).toContainObject({selected: false})
      expect(subscriptions.itemPropsAt(1)).toContainObject({selected: true})
    })

    it('should trigger prop function "onClick" when first subscription navigation item clicked', () => {
      createWrapper().subscriptions.itemClickAt(0)

      expect(props.onClick).toHaveBeenCalledWith({feedTagEqual: 'tag', feedUuidEqual: 'uuid1'})
    })

    it('should trigger prop function "onClick" when second subscription navigation item clicked', () => {
      createWrapper().subscriptions.itemClickAt(1)

      expect(props.onClick).toHaveBeenCalledWith({feedTagEqual: 'tag', feedUuidEqual: 'uuid2'})
    })
  })
})
