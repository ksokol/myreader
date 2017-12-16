import {toSubscriptions} from './subscription'

describe('src/app/js/store/subscription/subscription.spec.js', () => {

    describe('toSubscriptions', () => {

        it('should convert raw data', () => {
            const raw = {
                content: [
                    {
                        uuid: 1,
                        key: 'value'
                    }, {
                        uuid: 2,
                        key: 'value'
                    }
                ]
            }

            expect(toSubscriptions(raw))
                .toEqual({
                    subscriptions: [
                        {
                            uuid: 1,
                            key: 'value'
                        }, {
                            uuid: 2,
                            key: 'value'
                        }
                    ]
                })
        })

        it('should return valid object when content is empty', () =>
            expect(toSubscriptions({content: []})).toEqual({subscriptions: []}))

        it('should return valid object when input is undefined', () =>
            expect(toSubscriptions(undefined)).toEqual({subscriptions: []}))
    })
})
