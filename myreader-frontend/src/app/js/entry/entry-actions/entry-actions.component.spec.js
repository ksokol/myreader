describe('src/app/js/entry/entry-actions/entry-actions.component.spec.js', () => {

    let page, scope

    const Button = el => {
        return {
            iconType: () => {
                const classNames = []
                const values = el[0].querySelector('react-component').querySelector('span').classList.values()
                for(const className of values) {
                    classNames.push(className)
                }
                return classNames
            },
            click: () => el.triggerHandler('click')
        }
    }

    const PageObject = el => {
        return {
            expandIcon: () => {
                const buttons = el.find('my-icon-button')
                return new Button(angular.element(buttons[0]))
            },
            checkButton: () => {
                const buttons = el.find('my-icon-button')
                return new Button(angular.element(buttons[1]))
            }
        }
    }

    beforeEach(angular.mock.module('myreader'))

    beforeEach(inject(function ($rootScope, $compile) {
        const myOnMore = jest.fn()
        const myOnCheck = jest.fn()
        scope = $rootScope.$new(true)
        scope.myOnMore = myOnMore
        scope.myOnCheck = myOnCheck
        scope.item = {seen: true}

        const element = $compile(`<my-entry-actions my-item="item"
                                                    my-on-more="myOnMore(showMore)"
                                                    my-on-check="myOnCheck(item)">
                                  </my-entry-actions>`)(scope)
        scope.$digest()
        page = new PageObject(element)
    }))

    it('should show "expand more" and "unseen item" actions', () => {
        scope.item.seen = false
        scope.$digest()

        expect(page.expandIcon().iconType()).toContain('my-icon__expand-more')
        expect(page.checkButton().iconType()).toContain('my-icon__check')
    })

    it('should toggle "expand more" action', () => {
        page.expandIcon().click()
        expect(page.expandIcon().iconType()).toContain('my-icon__expand-less')

        page.expandIcon().click()
        expect(page.expandIcon().iconType()).toContain('my-icon__expand-more')
    })

    it('should show "seen item" action when seen flag is set to true', () => {
        expect(page.checkButton().iconType()).toContain('my-icon__check-circle')
    })

    it('should propagate "onMore" event when "expand more" action triggered', () => {
        page.expandIcon().click()
        scope.$digest()
        expect(scope.myOnMore).toHaveBeenCalledWith(true)

        page.expandIcon().click()
        scope.$digest()
        expect(scope.myOnMore).toHaveBeenCalledWith(false)
    })

    it('should propagate "onCheck" event with seen flag set to false when "check" action triggered', () => {
        page.checkButton().click()
        scope.$digest()
        expect(scope.myOnCheck).toHaveBeenCalledWith({seen: false})
    })

    it('should propagate "onCheck" event with seen flag set to true when "check" action triggered', () => {
        scope.item.seen = false
        scope.$digest()
        page.checkButton().click()
        scope.$digest()
        expect(scope.myOnCheck).toHaveBeenCalledWith({seen: true})
    })
})
