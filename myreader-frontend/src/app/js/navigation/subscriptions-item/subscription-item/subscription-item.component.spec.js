class SubscriptionItem {

  constructor(el) {
    this.el = el
  }

  get text() {
    return this.el.querySelector('span:first-of-type').textContent
  }

  get badge() {
    return this.el.querySelector('.my-subscription-item__badge').textContent
  }

  get selected() {
    return this.el.classList.contains('my-navigation__item--selected')
  }

  click() {
    this.el.click()
  }
}

class SubscriptionItemPage {

  constructor(el) {
    this.el = el[0]
  }

  get parent() {
    return new SubscriptionItem(this.el.querySelector('li:first-of-type'))
  }

  get subList() {
    return this.el.querySelector('ul')
  }

  get subItems() {
    const items = []
    this.subList.querySelectorAll('li').forEach(it => items.push(new SubscriptionItem(it)))
    return items
  }
}

describe('src/app/js/navigation/subscriptions-item/subscription-item/subscription-item.component.spec.js', () => {

  let myQuery

  beforeEach(angular.mock.module('myreader'))

  beforeEach(() => myQuery = {feedTagEqual: 'tag', feedUuidEqual: 'uuid'})

  describe('$onInit', () => {

    let component

    it('should set default values', inject(_$componentController_ => {
      component = _$componentController_('myNavigationSubscriptionItem')
      component.$onInit()

      expect(component.item).toEqual({})
    }))

    it('should use bindings', inject(_$componentController_ => {
      const bindings = {myItem: 'expected myItem'}
      component = _$componentController_('myNavigationSubscriptionItem', null, bindings)
      component.$onInit()

      expect(component.item).toEqual('expected myItem')
    }))
  })

  describe('controller', () => {

    let component

    beforeEach(inject((_$componentController_, $ngRedux) => {
      component = _$componentController_('myNavigationSubscriptionItem', null, {myQuery})
      component.$onInit()
    }))

    it('should not mark item as selected when uuid does not match', () => {
      const item = {tag: 'tag', uuid: 'other uuid'}
      expect(component.isSelected(item)).toEqual(false)
    })

    it('should not mark item as selected when tag does not match', () => {
      const item = {tag: 'other tag', uuid: 'uuid'}
      expect(component.isSelected(item)).toEqual(false)
    })

    it('should mark item as selected when tag and uuid match', () => {
      const item = {tag: 'tag', uuid: 'uuid'}
      expect(component.isSelected(item)).toEqual(true)
    })

    it('should mark submenu as open when tag matches', inject(_$componentController_ => {
      component = _$componentController_('myNavigationSubscriptionItem', null, {myItem: {tag: 'tag'}, myQuery})
      component.$onInit()

      expect(component.isOpen()).toEqual(true)
    }))

    it('should not mark submenu as open when tag does not match', inject(_$componentController_ => {
      component = _$componentController_('myNavigationSubscriptionItem', null, {myItem: {tag: 'other tag'}, myQuery})
      component.$onInit()

      expect(component.isOpen()).toEqual(false)
    }))

    it('should construct comparison value for ng-repeat track by', () => {
      expect(component.trackBy({uuid: '1', unseen: 2})).toEqual('{"uuid":"1","unseen":2}')
    })
  })

  describe('with html', () => {

    let page, scope

    const item = {
      title: 'item title',
      unseen: 2,
      tag: 'tag',
      uuid: 'uuid',
      subscriptions: [
        {title: 'subscription 1', tag: 'tag1', uuid: 'uuid1', unseen: 1},
        {title: 'subscription 2', tag: 'tag2', uuid: 'uuid2', unseen: 0}
      ]
    }

    beforeEach(inject(($rootScope, $compile) => {
      scope = $rootScope.$new(true)
      scope.item = {...item}
      scope.query = myQuery
      scope.onSelect = jest.fn()

      const element = $compile('<my-navigation-subscription-item my-item="item" my-query="query" my-on-select="onSelect(query)"></my-navigation-subscription-item>')(scope)
      scope.$digest()
      page = new SubscriptionItemPage(element)
    }))

    describe('parent item', () => {

      it('should not mark as selected', () => {
        scope.query = {feedTagEqual: null, feedUuidEqual: null}
        scope.$digest()

        expect(page.parent.selected).toEqual(false)
      })

      it('should mark as selected', () => {
        expect(page.parent.selected).toEqual(true)
      })

      it('should render title and unseen count', () => {
        expect(page.parent.text).toEqual('item title')
        expect(page.parent.badge).toEqual('2')
      })
    })

    describe('sub items', () => {

      it('should not render items when not selected', () => {
        scope.query = {feedTagEqual: null, feedUuidEqual: null}
        scope.$digest()

        expect(page.subList).toBeNull()
      })

      it('should not render items when no subscriptions available', () => {
        scope.item = {...item, subscriptions: []}
        scope.query = {}
        scope.$digest()

        expect(page.subList).toBeNull()
      })

      it('should render every item', () => {
        expect(page.subItems.length).toEqual(2)
      })

      it('should not mark as selected', () => {
        scope.item.subscriptions = [
          {title: 'subscription 1', tag: 'tag', uuid: 'uuid1', unseen: 1},
          {title: 'subscription 2', tag: 'tag', uuid: 'uuid2', unseen: 0}
        ]
        scope.$digest()

        const items = page.subItems

        expect(items[0].selected).toEqual(false)
        expect(items[1].selected).toEqual(false)
      })

      it('should not render items when item is selected but subscriptions property is undefined', () => {
        scope.item = {...item, subscriptions: []}
        scope.query = {}
        scope.$digest()

        expect(page.subList).toBeNull()
      })

      it('should mark as selected', () => {
        scope.item.subscriptions = [
          {title: 'subscription 1', tag: 'tag', uuid: 'uuid1', unseen: 1},
          {title: 'subscription 2', tag: 'tag', uuid: 'uuid2', unseen: 0}
        ]
        scope.query = {feedTagEqual: 'tag', feedUuidEqual: 'uuid1'}
        scope.$digest()

        const items = page.subItems

        expect(items[0].selected).toEqual(true)
        expect(items[1].selected).toEqual(false)
      })

      it('should render item title with unseen count', () => {
        const item = page.subItems[0]

        expect(item.text).toEqual('subscription 1')
        expect(item.badge).toEqual('1')
      })


      it('should trigger onSelect with parent feedTag and feedUuid when parent item clicked', () => {
        page.parent.click()
        scope.$digest()

        expect(scope.onSelect).toHaveBeenCalledWith({feedTagEqual: 'tag', feedUuidEqual: 'uuid', q: null})
      })

      it('should trigger onSelect with first child feedTag and feedUuid when first child clicked', () => {
        page.subItems[0].click()
        scope.$digest()

        expect(scope.onSelect).toHaveBeenCalledWith({feedTagEqual: 'tag1', feedUuidEqual: 'uuid1', q: null})
      })

      it('should trigger onSelect with second child feedTag and feedUuid when second child clicked', () => {
        page.subItems[1].click()
        scope.$digest()

        expect(scope.onSelect).toHaveBeenCalledWith({feedTagEqual: 'tag2', feedUuidEqual: 'uuid2', q: null})
      })
    })
  })
})
