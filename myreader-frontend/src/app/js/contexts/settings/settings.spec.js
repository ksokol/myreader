import {
  isShowEntryDetails,
  isShowUnseenEntries,
  setShowEntryDetails,
  setShowUnseenEntries,
  settings
} from './settings'

describe('settings', () => {

  it('should return false for showEntryDetails setting', () => {
    setShowEntryDetails(false)
    expect(isShowEntryDetails()).toBe(false)
  })

  it('should return default value true for showEntryDetails setting', () => {
    expect(isShowEntryDetails()).toBe(true)
  })

  it('should return default true for showUnseenEntries setting', () => {
    expect(isShowUnseenEntries()).toBe(true)
  })

  it('should return false for showUnseenEntries setting', () => {
    setShowUnseenEntries(false)
    expect(isShowUnseenEntries()).toBe(false)
  })

  it('should return default value true for showUnseenEntries setting when given value is undefined', () => {
    setShowUnseenEntries()
    expect(isShowUnseenEntries()).toBe(true)
  })

  it('should return default value true for showEntryDetails setting when given value is undefined', () => {
    setShowEntryDetails()
    expect(isShowEntryDetails()).toBe(true)
  })

  describe('settings with malformed json', () => {

    beforeEach(() => localStorage.setItem('myreader-settings', '{'))

    it('should initialize with default values', () => {
      expect(settings()).toEqual({
        showUnseenEntries: true,
        showEntryDetails: true
      })
    })
  })

  describe('settings with valid json', () => {

    beforeEach(() => localStorage.setItem('myreader-settings', '{"showUnseenEntries":false,"showEntryDetails":false}'))

    it('should initialize from persistent values', () => {
      expect(settings()).toEqual({
        showUnseenEntries: false,
        showEntryDetails: false
      })
    })
  })
})
