import {mockNgRedux, filterMock} from '../../shared/test-utils'

describe('src/app/js/maintenance/about/about.component.spec.js', () => {

    const Table = table => {
        return {
            rowValue: index => {
                const tr = angular.element(table).find('tr')[index]
                return angular.element(tr).find('td')[1].innerText
            }
        }
    }

    let scope, element, table, ngReduxMock

    beforeEach(angular.mock.module('myreader', mockNgRedux(), filterMock('timeago')))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new(true)
        ngReduxMock = $ngRedux

        element = $compile('<my-about></my-about>')(scope)
        scope.$digest()
    }))

    it('should hide content when no application info is present', () =>
        expect(element.children().length).toEqual(0))

    it('should show application build information', () => {
        ngReduxMock.setState({
            admin: {
                applicationInfo: {
                    branch: 'a',
                    commitId: 'b',
                    version: 'c',
                    buildTime: 'd'
                }
            }
        })

        scope.$digest()

        expect(element.find('p').length).toEqual(0)

        table = new Table(element.find('table'))
        expect(table.rowValue(0)).toEqual('a')
        expect(table.rowValue(1)).toEqual('b')
        expect(table.rowValue(2)).toEqual('c')
        expect(table.rowValue(3)).toEqual('timeago("d")')
    })
})
