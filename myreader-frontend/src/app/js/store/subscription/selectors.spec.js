import {getSubscriptions, filteredByUnseenSubscriptionsSelector} from 'store'
import settingsInitialState from '../settings'

describe('src/app/js/store/subscription/selectors.spec.js', () => {

    let state

    const subscriptions = () => {
        return {
            subscriptions: [{uuid: '1', unseen: 1}, {uuid: '2', unseen: 0}]
        }
    }

    beforeEach(() => {
        state = {
            subscription: {...subscriptions()},
            settings: settingsInitialState()
        }
    })

    it('should return subscriptions', () =>
        expect(getSubscriptions(state)).toEqual(subscriptions()))

    it('selector getSubscriptions should return copy of subscriptions', () => {
        const actualSubscriptions = getSubscriptions(state).subscriptions
        actualSubscriptions[0].key = 'value'

        expect(state.subscription).toEqual(subscriptions())
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

        expect(state.subscription).toEqual(subscriptions())
    })
})
