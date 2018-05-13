import {getSettings, settingsShowUnseenEntriesSelector, settingsShowEntryDetailsSelector} from '../../store'

describe('src/app/js/store/settings/selectors.spec.js', () => {

    it('should return settings state from selector', () => {
        const expectedState = {key1: 'prop1', key2: 'prop2'}

        expect(getSettings({settings: expectedState})).toEqual(expectedState)
    })

    it('should return settings value for showUnseenEntries property', () => {
        const expectedState = {showUnseenEntries: 'expected showUnseenEntries value'}

        expect(settingsShowUnseenEntriesSelector({settings: expectedState})).toEqual('expected showUnseenEntries value')
    })

    it('should return settings value for showEntryDetails property', () => {
        const expectedState = {showEntryDetails: 'expected showEntryDetails value'}

        expect(settingsShowEntryDetailsSelector({settings: expectedState})).toEqual('expected showEntryDetails value')
    })
})
