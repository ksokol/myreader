import {getSubscriptions} from 'store'

describe('src/app/js/store/subscription/selectors.spec.js', () => {

    let state

    beforeEach(() => {
        state = {
            subscription: {
                subscriptions: [{uuid: '1'}, {uuid: '2'}]
            }
        }
    })

    it('should return subscriptions', () =>
        expect(getSubscriptions(state)).toEqual({subscriptions: [{uuid: '1'}, {uuid: '2'}]}))


    it('should return copy of subscriptions', () => {
        const subscriptions = getSubscriptions(state).subscriptions
        subscriptions[0].key = 'value'

        expect(state.subscription).toEqual({subscriptions: [{uuid: '1'}, {uuid: '2'}]})
    })
})
