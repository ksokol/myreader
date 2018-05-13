import {mockNgRedux, filterMock} from '../../shared/test-utils'

describe('src/app/js/maintenance/about/about.component.spec.js', () => {

    const Table = table => {
        return {
            rowValue: index => {
                const tr = table.querySelectorAll('tr')[index]
                return tr.querySelectorAll('td')[1].textContent
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

    it('should hide content when no application info is present', () => {
        expect(element[0].textContent.trim()).toEqual('')
    })

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

        table = new Table(element[0].querySelector('table'))
        expect(table.rowValue(0)).toEqual('a')
        expect(table.rowValue(1)).toEqual('b')
        expect(table.rowValue(2)).toEqual('c')
        expect(table.rowValue(3)).toEqual('timeago("d")')
    })
})
