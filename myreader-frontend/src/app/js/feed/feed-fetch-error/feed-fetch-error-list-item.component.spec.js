import {filterMock} from 'shared/test-utils'

describe('src/app/js/feed/feed-fetch-error/feed-fetch-error-list-item.component.spec.js', () => {

    let element

    beforeEach(angular.mock.module('myreader', filterMock('timeago')))

    beforeEach(inject(($rootScope, $compile) => {
        let scope = $rootScope.$new(true)

        scope.item = {
            "uuid": "1",
            "message": "error1",
            "retainDays": 7,
            "createdAt": "2017-04-28T18:01:03Z",
            "links": []
        }

        element = $compile('<my-feed-fetch-error-list-item my-item="item"></my-feed-fetch-error-list-item>')(scope)
        scope.$digest()
    }))

    it('should render message', () =>
        expect(element.find('p')[0].innerText).toEqual('error1'))

    it('should render createdAt', () =>
        expect(element.find('p')[1].innerText).toEqual('timeago("2017-04-28T18:01:03Z")'))
})
