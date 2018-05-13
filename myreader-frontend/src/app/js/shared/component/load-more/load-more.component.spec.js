describe('src/app/js/shared/component/load-more/load-more.component.spec.js', () => {

    let scope, element, myOnMore

    beforeEach(angular.mock.module('myreader'))

    beforeEach(inject(($rootScope, $compile) => {
        myOnMore = jest.fn()
        scope = $rootScope.$new(true)
        scope.next = '/anUrl'
        scope.myOnMore = myOnMore

        element = $compile('<my-load-more my-next="next" my-on-more="myOnMore(more)"></my-load-more>')(scope)[0]
        scope.$digest()
    }))

    it('should not render element when myNext is undefined', () => {
        delete scope.next
        scope.$digest()
        expect(element.querySelector('button')).toBeNull()
    })

    it('should render element when myNext is defined', () => {
        scope.$digest()
        expect(element.querySelector('button')).not.toBeNull()
        expect(element.querySelectorAll('button')[0].disabled).toBe(false)
    })

    it('should propagate event when button clicked', () => {
        element.querySelectorAll('button')[0].click()
        scope.$digest()
        expect(myOnMore).toHaveBeenCalledWith('/anUrl')
    })

    it('should disable button when button clicked', () => {
        element.querySelectorAll('button')[0].click()
        scope.$digest()
        expect(element.querySelectorAll('button')[0].disabled).toBe(true)
    })

    it('should enable button when myNext updated', () => {
        element.querySelectorAll('button')[0].click()
        scope.$digest()
        scope.next = '/nextUrl'
        scope.$digest()

        expect(element.querySelectorAll('button')[0].disabled).toBe(false)
    })
})
