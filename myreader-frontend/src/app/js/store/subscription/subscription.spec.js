import {toExclusionPatterns, toSubscriptions} from './subscription'

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

    describe('toExclusionPatterns', () => {

        it('should return empty array when raw data is undefined', () =>
            expect(toExclusionPatterns()).toEqual([]))

        it('should convert raw data', () => {
            const raw = {content: [{pattern: 'a'}, {pattern: 'b'}, {pattern: 'c'}]}

            expect(toExclusionPatterns(raw)).toEqual([{pattern: 'a'}, {pattern: 'b'}, {pattern: 'c'}])
        })

        it('should sort by pattern value', () => {
            const raw = {content: [{pattern: 'c'}, {pattern: 'b'}, {pattern: 'aa'}]}

            expect(toExclusionPatterns(raw)).toEqual([{pattern: 'aa'}, {pattern: 'b'}, {pattern: 'c'}])
        })

        it('should return copy of patterns', () => {
            const raw = {content: [{pattern: 'c'}, {pattern: 'b'}, {pattern: 'a'}]}
            const converted = toExclusionPatterns(raw)
            raw.content[1].pattern = 'x'

            expect(converted).toEqual([{pattern: 'a'}, {pattern: 'b'}, {pattern: 'c'}])
        })
    })
})
