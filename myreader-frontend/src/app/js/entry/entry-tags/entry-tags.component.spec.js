import {reactComponent} from '../../shared/test-utils'

describe('src/app/js/entry/entry-tags/entry-tags.component.spec.js', () => {

  let myOnChange, scope, element, chips

  beforeEach(() => {
    chips = reactComponent('Chips')
    angular.mock.module('myreader', chips)
  })

  beforeEach(inject(($rootScope, $compile) => {
    myOnChange = jest.fn()

    scope = $rootScope.$new(true)
    scope.item = {tag: 'tag1 tag2'}
    scope.show = true
    scope.myOnChange = myOnChange
    element = $compile(`<my-entry-tags my-item="item"
                                          my-show="show"
                                          my-on-change="myOnChange(tag)">
                           </my-entry-tags>`)(scope)
    scope.$digest()
  }))

  it('should show tags component when myShow is true', () => {
    expect(element.children().length).toBeGreaterThan(0)
  })

  it('should not show render tags component when myShow is false', () => {
    scope.show = false
    scope.$digest()

    expect(element.children().length).toEqual(0)
  })

  it('should return key for given value in prop "values" when prop "keyFn" function called', () => {
    expect(chips.bindings.keyFn(chips.bindings.values[0])).toEqual('tag1')
  })

  it('should render tags', () => {
    expect(chips.bindings.values).toEqual(['tag1', 'tag2'])
  })

  it('should trigger onChange event when tag has been removed', () => {
    chips.bindings.onRemove('tag1')

    expect(myOnChange).toHaveBeenCalledWith('tag2')
  })

  it('should trigger onChange event when first tag has been added', () => {
    scope.item = {tag: null}
    scope.$digest()

    chips.bindings.onAdd('tag1')

    expect(myOnChange).toHaveBeenCalledWith('tag1')
  })

  it('should trigger onChange event when tag has been added', () => {
    chips.bindings.onAdd('tag3')

    expect(myOnChange).toHaveBeenCalledWith('tag1, tag2, tag3')
  })

  it('should prevent duplicate tags', () => {
    chips.bindings.onAdd('tag2')

    expect(myOnChange).not.toHaveBeenCalled()
  })

  it('should trigger onChange with null value when tag has been removed', () => {
    scope.item = {tag: 'tag1'}
    scope.$digest()
    chips.bindings.onRemove('tag1')

    expect(myOnChange).toHaveBeenCalledWith(null)
  })
})
