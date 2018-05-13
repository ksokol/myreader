describe('src/app/js/entry/entry-tags/entry-tags.component.spec.js', () => {

    let myOnChange, scope, element

    beforeEach(angular.mock.module('myreader'))

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

    it('should show tags component when myShow is true', () =>
        expect(element.children().length).toBeGreaterThan(0))

    it('should not show render tags component when myShow is false', () => {
        scope.show = false
        scope.$digest()

        expect(element.children().length).toEqual(0)
    })

    it('should render tags', () => {
        const chips = element.find('my-chip')

        expect(chips[0].querySelector('strong').textContent).toEqual('tag1')
        expect(chips[1].querySelector('strong').textContent).toEqual('tag2')
    })

    it('should trigger onChange event when tag has been removed', () => {
        element.find('my-chip').find('button')[0].click()
        expect(myOnChange).toHaveBeenCalledWith('tag2')
    })

    it('should trigger onChange event when first tag has been added', () => {
        scope.item = {tag: null}
        scope.$digest()

        element.find('input').val('tag1').triggerHandler('input')
        element.find('input').triggerHandler({type: 'keyup', keyCode: 13})

        expect(myOnChange).toHaveBeenCalledWith('tag1')
    })

    it('should trigger onChange event when tag has been added', () => {
        element.find('input').val('tag3').triggerHandler('input')
        element.find('input').triggerHandler({type: 'keyup', keyCode: 13})

        expect(myOnChange).toHaveBeenCalledWith('tag1, tag2, tag3')
    })

    it('should prevent duplicate tags', () => {
        element.find('input').val('tag2').triggerHandler('input')
        element.find('input').triggerHandler({type: 'keyup', keyCode: 13})

        expect(myOnChange).not.toHaveBeenCalled()
    })

    it('should trigger onChange with null value when tag has been removed', () => {
        scope.item = {tag: 'tag1'}
        scope.$digest()

        element.find('my-chip').find('button')[0].click()
        expect(myOnChange).toHaveBeenCalledWith(null)
    })
})
