describe('src/app/js/shared/component/icon/icon.component.spec.js', () => {

    let scope, compile

    beforeEach(angular.mock.module('myreader'))

    beforeEach(inject(($rootScope, $compile) => {
        compile = $compile
        scope = $rootScope.$new(true)
    }))

    it('should render close icon', () => {
        const element = compile('<my-icon my-type="close"></my-icon>')(scope)
        scope.$digest()

        expect(element[0].classList).toContain('my-icon__icon--close')
    })

    it('should render icon with default color', () => {
        const element = compile('<my-icon my-type="close"></my-icon>')(scope)
        scope.$digest()

        expect(element[0].classList).toContain('my-icon__icon--grey')
    })

    it('should render icon with given color', () => {
        const element = compile('<my-icon my-color="white"></my-icon>')(scope)
        scope.$digest()

        expect(element[0].classList).toContain('my-icon__icon--white')
    })
})
