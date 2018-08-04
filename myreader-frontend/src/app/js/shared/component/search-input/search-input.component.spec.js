import ReactTestUtils from 'react-dom/test-utils'

describe('src/app/js/shared/component/search-input/search-input.component.spec.js', () => {

  beforeEach(angular.mock.module('myreader'))

  let scope, myOnChange, page

  const PageObject = el => {
    return {
      searchInput: () => el.find('input'),
      enterSearchInput: value => {
        const input = el[0].querySelectorAll('input')[0]
        input.value = value
        ReactTestUtils.Simulate.change(input)
      }
    }
  }

  beforeEach(inject(($rootScope, $compile) => {
    jest.useRealTimers()

    myOnChange = jest.fn()
    scope = $rootScope.$new(true)
    scope.value = 'a value'
    scope.myOnChange = myOnChange

    const element = $compile('<my-search-input my-value="value" my-on-change="myOnChange(value)"></my-search-input>')(scope)
    scope.$digest()
    page = PageObject(element)
  }))

  it('should set initial value', () => {
    expect(page.searchInput().val()).toEqual('a value')
  })

  it('should set no initial value', inject($compile => {
    scope.value = null
    const element = $compile('<my-search-input my-value="value"></my-search-input>')(scope)
    scope.$digest()
    page = PageObject(element)

    expect(page.searchInput().val()).toEqual('')
  }))

  it('should emit myOnChange event after a predefined amount of time', done => {
    page.enterSearchInput('changed value')
    expect(myOnChange).not.toHaveBeenCalled()

    // TODO Workaround for https://github.com/facebook/jest/issues/5165
    setTimeout(() => {
      expect(myOnChange).toHaveBeenCalledWith('changed value')
      done()
    }, 300)
  })
})
