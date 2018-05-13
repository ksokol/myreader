describe('src/app/js/shared/component/search-input/search-input.component.spec.js', () => {

    beforeEach(angular.mock.module('myreader'))

    let scope, timeout, myOnChange, page

    const PageObject = el => {
        return {
            searchInput: () => el.find('input'),
            enterSearchInput: (value, tick) => {
                el.find('input').val(value).triggerHandler('input')
                timeout.flush(tick || 250)
            }
        }
    }

    beforeEach(inject(($rootScope, $compile, $timeout) => {
        myOnChange = jest.fn()
        timeout = $timeout
        scope = $rootScope.$new(true)
        scope.value = 'a value'
        scope.myOnChange = myOnChange

        const element = $compile('<my-search-input my-value="value" my-on-change="myOnChange(value)"></my-search-input>')(scope)
        scope.$digest()
        page = new PageObject(element)
    }))

    it('should set initial value', () => {
        expect(page.searchInput().val()).toEqual('a value')
    })

    it('should set no initial value', inject($compile => {
        scope.value = null
        const element = $compile('<my-search-input my-value="value"></my-search-input>')(scope)
        scope.$digest()
        page = new PageObject(element)

        expect(page.searchInput().val()).toEqual('')
    }))

    it('should emit myOnChange event after a predefined amount of time when value is not empty', inject($timeout => {
        page.enterSearchInput('changed value', 249)

        expect(myOnChange).not.toHaveBeenCalled()

        $timeout.flush(1)
        expect(myOnChange).toHaveBeenCalledWith('changed value')
    }))
})
