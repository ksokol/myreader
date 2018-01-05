import {navigationBuilder} from './navigation-builder'

describe('src/app/js/navigation/subscriptions-item/navigation-builder.spec.js', () => {

    const subscriptionsWithTag = [
        {title: '1', uuid: '1', tag: 't1', unseen: 2},
        {title: '2', uuid: '2', tag: 't1', unseen: 3},
        {title: '3', uuid: '3', tag: 't2', unseen: 1},
        {title: '4', uuid: '4', tag: 't3', unseen: 5},
        {title: '5', uuid: '5', tag: 't3', unseen: 0},
        {title: '6', uuid: '6', tag: null, unseen: 3},
        {title: '7', uuid: '7', unseen: 4},
    ]

    beforeEach(() => jasmine.clock().mockDate(new Date(1)))

    it('should return empty array for subscriptionsWithoutTag property', () =>
        expect(navigationBuilder([]).subscriptionsWithoutTag).toEqual([]))

    it('should return subscriptions without a tag assigned in property subscriptionsWithoutTag', () =>
        expect(navigationBuilder(subscriptionsWithTag).subscriptionsWithoutTag)
            .toEqual([{title: '6', uuid: '6', tag: null, unseen: 3}, {title: '7', uuid: '7', unseen: 4}]))

    it('should return bucket "t1" with all subscriptions whose tag is "t1"', () =>
        expect(navigationBuilder(subscriptionsWithTag).subscriptionsGroupedByTag.t1).toEqual({
            title: 't1',
            tag: 't1',
            uuid: null,
            unseen: 5,
            subscriptions: [{title: '1', uuid: '1', tag: 't1', unseen: 2}, {title: '2', uuid: '2', tag: 't1', unseen: 3}]
        }))

    it('should return bucket "t2" with all subscriptions whose tag is "t2"', () =>
        expect(navigationBuilder(subscriptionsWithTag).subscriptionsGroupedByTag.t2).toEqual({
            title: 't2',
            tag: 't2',
            uuid: null,
            unseen: 1,
            subscriptions: [{title: '3', uuid: '3', tag: 't2', unseen: 1}]
        }))

    it('should return bucket "t3" with all subscriptions whose tag is "t3"', () =>
        expect(navigationBuilder(subscriptionsWithTag).subscriptionsGroupedByTag.t3).toEqual({
            title: 't3',
            tag: 't3',
            uuid: null,
            unseen: 5,
            subscriptions: [{title: '4', uuid: '4', tag: 't3', unseen: 5}, {title: '5', uuid: '5', tag: 't3', unseen: 0}]
        }))

    it('should return generic "all" bucket with different key on every creation', () => {
        jasmine.clock().mockDate(new Date(2))
        expect(navigationBuilder([]).subscriptionsGroupedByTag).toEqual({'__all__2': {title: 'all', tag: null, uuid: null, unseen: 0}})

        jasmine.clock().mockDate(new Date(3))
        expect(navigationBuilder([]).subscriptionsGroupedByTag).toEqual({'__all__3': {title: 'all', tag: null, uuid: null, unseen: 0}})
    })

    it('should return generic "all" bucket with unseen count', () => {
        const expectedCount = subscriptionsWithTag.reduce((sum, subscription) => sum + subscription.unseen, 0)

        expect(navigationBuilder(subscriptionsWithTag).subscriptionsGroupedByTag['__all__1'].unseen).toEqual(expectedCount)
    })
})
