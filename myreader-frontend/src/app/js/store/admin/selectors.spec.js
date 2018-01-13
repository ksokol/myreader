import {applicationInfoSelector} from 'store'

describe('src/app/js/store/admin/selectors.spec.js', () => {

    let state

    beforeEach(() => {
        state = {
            admin: {
                applicationInfo: 'expected application info'
            },
        }
    })

    it('should return application info', () =>
        expect(applicationInfoSelector(state)).toEqual('expected application info'))
})
