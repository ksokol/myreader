import {
    filteredByUnseenSubscriptionsSelector,
    getSubscriptions,
    subscriptionByUuidSelector,
    subscriptionExclusionPatternsSelector,
    subscriptionTagsSelector,
    subscriptionTagsLoaded
} from 'store'
import settingsInitialState from '../settings'

describe('src/app/js/store/subscription/selectors.spec.js', () => {

    let state

    const subscriptions = () => {
        return {
            subscriptions: [{uuid: '1', unseen: 1}, {uuid: '2', unseen: 0}],
        }
    }

    beforeEach(() => {
        state = {
            subscription: {...subscriptions(), exclusions: {}},
            settings: settingsInitialState()
        }
    })

    it('should return subscriptions', () =>
        expect(getSubscriptions(state)).toEqual(subscriptions()))

    it('selector getSubscriptions should return copy of subscriptions', () => {
        const actualSubscriptions = getSubscriptions(state).subscriptions
        actualSubscriptions[0].key = 'value'

        expect(state.subscription).toContainObject(subscriptions())
    })

    it('should return subscriptions with unseen greater than zero when showUnseenEntries is set to true', () => {
        expect(filteredByUnseenSubscriptionsSelector(state)).toEqual({subscriptions: [{uuid: '1', unseen: 1}]})
    })

    it('should return all subscriptions when showUnseenEntries is set to false', () => {
        state.settings.showUnseenEntries = false
        expect(filteredByUnseenSubscriptionsSelector(state)).toEqual(subscriptions())
    })

    it('selector filteredByUnseenSubscriptionsSelector should return copy of subscriptions', () => {
        const actualSubscriptions = filteredByUnseenSubscriptionsSelector(state).subscriptions
        actualSubscriptions[0].key = 'value'

        expect(state.subscription).toContainObject(subscriptions())
    })

    it('should return empty array when exclusions for uuid not present', () => {
        expect(subscriptionExclusionPatternsSelector('1')(state)).toEqual([])
    })

    it('should return exclusions for given uuid', () => {
        state.subscription.exclusions = {'1': [{a: 'b'}, {c: 'd'}], '2': [{e: 'f', g: 'h'}]}

        expect(subscriptionExclusionPatternsSelector('2')(state)).toEqual([{e: 'f', g: 'h'}])
    })

    it('should return copy of exclusions', () => {
        state.subscription.exclusions = {'1': [{a: 'b'}]}
        const selection = subscriptionExclusionPatternsSelector('1')(state)
        state.subscription.exclusions['1'][0].a = 'x'

        expect(selection).toEqual([{a: 'b'}])
    })

    it('should return subscription for given uuid', () => {
        state.subscription.subscriptions = [{uuid: '1', a: 'b'}, {uuid: '2', c: 'd'}]

        expect(subscriptionByUuidSelector('2')(state)).toEqual({subscription: {uuid: '2', c: 'd'}})
    })

    it('should return copy of subscription', () => {
        state.subscription.subscriptions = [{uuid: '1', a: 'b'}, {uuid: '2', c: 'd'}]
        const selection = subscriptionByUuidSelector('1')(state)
        state.subscription.subscriptions[0].a = 'x'

        expect(selection).toEqual({subscription: {uuid: '1', a: 'b'}})
    })

    it('should return subscription tags', () => {
        state.subscription.tags = {loaded: true, items: ['a', 'b']}

        expect(subscriptionTagsSelector(state)).toEqual({tags: ['a', 'b']})
    })

    it('should return copy of subscription tags', () => {
        state.subscription.tags = {loaded: true, items: ['a', 'b']}
        const selection = subscriptionTagsSelector(state)
        state.subscription.tags.items[0] = 'x'

        expect(selection).toEqual({tags: ['a', 'b']})
    })

    it('should return subscription tags loaded flag', () => {
        state.subscription.tags = {loaded: false}
        expect(subscriptionTagsLoaded(state)).toEqual({loaded: false})
    })
})
