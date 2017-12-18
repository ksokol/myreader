import {getSettings} from 'store'

describe('src/app/js/store/settings/selectors.spec.js', () => {

    it('should return settings state from selector', () => {
        const expectedState = {key1: 'prop1', key2: 'prop2'}

        expect(getSettings(({settings: expectedState}))).toEqual(expectedState)
    })
})
