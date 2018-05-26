import {TimeAgo} from './time-ago'

describe('src/app/js/shared/time-ago/time-ago.spec.js', () => {

    beforeEach(() => {
        const _Date = Date
        const MockDate = (...args) => {
            switch (args.length) {
                case 0: {
                    return new Date('2018-04-27T18:01:03Z')
                }
                default: {
                    return new _Date(...args)
                }
            }
        }

        MockDate.prototype = _Date.prototype
        global['Date'] = MockDate;
    })

    it('should format date', () => {
        expect(TimeAgo({date: '2018-04-25T18:01:03Z'})).toEqual('2 days ago')
    })
})
