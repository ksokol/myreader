describe('src/app/js/bookmark/bookmark-tags/bookmark-tags.component.spec.js', () => {

    let rootScope, scope, element

    beforeEach(() => angular.mock.module('myreader'))

    beforeEach(inject(($rootScope, $compile) => {
        rootScope = $rootScope
        scope = $rootScope.$new()

        scope.entryTags = ['tag1', 'tag2', 'tag3']
        scope.selected = 'tag2'

        element = $compile(`<my-bookmark-tags my-tags="entryTags"
                                              my-selected="selected"
                                              my-on-select="onSelect(tag)">
                            </my-bookmark-tags>`)(scope)
        scope.$digest()
    }))

    it('should render given entry tags', () => {
        expect(element.find('md-chip-template')[0].innerText.trim()).toEqual('tag1')
        expect(element.find('md-chip-template')[1].innerText.trim()).toEqual('tag2')
        expect(element.find('md-chip-template')[2].innerText.trim()).toEqual('tag3')
    })

    it('should highlight entry tag equal to mySelected', () => {
        expect(element.find('md-chip-template').children()[0].classList).not.toContain('bookmark-tags__tag--selected')
        expect(element.find('md-chip-template').children()[1].classList).toContain('bookmark-tags__tag--selected')
        expect(element.find('md-chip-template').children()[2].classList).not.toContain('bookmark-tags__tag--selected')
    })

    it('should emit focused entry tag', done => {
        scope.onSelect = tag => {
            expect(tag).toEqual('tag1')
            done()
        }

        angular.element(angular.element(element.find('md-chip')[0]).children()[0]).triggerHandler('focus')
        scope.$digest()
    })
})
