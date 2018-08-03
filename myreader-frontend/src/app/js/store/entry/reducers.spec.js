import initialState from '.'
import {entryReducers} from '../../store'

describe('src/app/js/store/entry/reducers.spec.js', () => {

  let state

  beforeEach(() => state = initialState())

  it('initial state', () => {
    expect(entryReducers(state, {type: 'UNKNOWN_ACTION'})).toEqual(state)
  })

  describe('action ENTRY_PAGE_LOADING', () => {

    it('should set loading flag to true', () => {
      state.loading = false
      const expectedState = {loading: true}

      expect(entryReducers(state, {type: 'ENTRY_PAGE_LOADING'})).toContainObject(expectedState)
    })

    it('should set loading flag to false', () => {
      state.loading = true
      const expectedState = {loading: false}

      expect(entryReducers(state, {type: 'ENTRY_PAGE_LOADED'})).toContainObject(expectedState)
    })
  })

  describe('action ENTRY_PAGE_RECEIVED', () => {

    let action

    beforeEach(() => {
      action = {
        type: 'ENTRY_PAGE_RECEIVED',
        links: {self: {path: 'expected path'}},
        entries: [{uuid: '1'}]
      }
    })

    it('should set entries and links', () => {
      const expectedState = {links: {self: {path: 'expected path'}}, entries: [{uuid: '1'}]}

      expect(entryReducers(state, action)).toContainObject(expectedState)
    })

    it('should update entries and links', () => {
      action.links = {self: {path: 'expected path', query: {next: 3, a: 'b'}}}
      action.entries = [{uuid: '2'}]

      const currentState = {links: {self: {path: 'expected path', query: {next: 2, a: 'b'}}}, entries: [{uuid: '1'}]}
      const expectedState = {
        links: {self: {path: 'expected path', query: {next: 3, a: 'b'}}},
        entries: [{uuid: '1'}, {uuid: '2'}]
      }

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })

    it('should set entries and links when links differ', () => {
      action.links = {self: {path: 'expected path', query: {next: 2, a: 'b'}}}
      action.entries = [{uuid: '3'}]

      const currentState = {links: {self: {path: 'expected path', query: {next: 2}}}, entries: [{uuid: '1'}]}
      const expectedState = {links: {self: {path: 'expected path', query: {next: 2, a: 'b'}}}, entries: [{uuid: '3'}]}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })

    it('should not add entries to store when entries already available in store', () => {
      action.links = {self: {query: {next: '3'}}}
      action.entries = [{uuid: '1'}, {uuid: '2'}]

      const currentState = {links: {self: {query: {next: '3'}}}, entries: [{uuid: '1'}, {uuid: '2'}]}
      const nextState = entryReducers(currentState, action)

      expect(entryReducers(nextState, action).entries).toEqual([{uuid: '1'}, {uuid: '2'}])
    })

    it('should reset entryInFocus property when links differ', () => {
      action.links = {self: {path: 'expected path', query: {next: 2, a: 'b'}}}
      action.entries = []

      const currentState = {links: {self: {path: 'expected path', query: {next: 2}}}, entries: [], entryInFocus: '1'}

      expect(entryReducers(currentState, action).entryInFocus).toEqual(null)
    })

    it('should not reset entryInFocus property when links are equal', () => {
      action.links = {self: {query: {next: '3'}}}
      action.entries = []

      const currentState = {links: {self: {query: {next: '3'}}}, entries: [], entryInFocus: '1'}
      const nextState = entryReducers(currentState, action)

      expect(entryReducers(nextState, action).entryInFocus).toEqual('1')
    })

    it('should not add entry to store when entry already available in store', () => {
      action.links = {self: {query: {next: '3'}}}
      action.entries = [{uuid: '1'}, {uuid: '2'}]

      const currentState = {links: {self: {query: {next: '3'}}}, entries: [{uuid: '1'}, {uuid: '2'}]}
      const nextState = entryReducers(currentState, action)

      action.links = {self: {query: {next: '3'}}}
      action.entries = [{uuid: '2'}]

      expect(entryReducers(nextState, action).entries).toEqual([{uuid: '1'}, {uuid: '2'}])
    })

    it('should add entry to store when entry is not in store', () => {
      action.links = {self: {query: {next: '3'}}}
      action.entries = [{uuid: '1'}]

      const currentState = {links: {self: {query: {next: '3'}}}, entries: [{uuid: '1'}]}
      const nextState = entryReducers(currentState, action)

      action.links = {self: {query: {next: '3'}}}
      action.entries = [{uuid: '2'}]

      expect(entryReducers(nextState, action).entries).toEqual([{uuid: '1'}, {uuid: '2'}])
    })

    it('should update entry in store', () => {
      action.links = {self: {query: {next: '3'}}}
      action.entries = [{uuid: '1', seen: false}]

      const currentState = {links: {self: {query: {next: '3'}}}, entries: [{uuid: '1', seen: false}]}
      const nextState = entryReducers(currentState, action)

      action.links = {self: {query: {next: '3'}}}
      action.entries = [{uuid: '1', seen: true}, {uuid: '2', seen: false}]

      expect(entryReducers(nextState, action).entries).toEqual([{uuid: '1', seen: true}, {uuid: '2', seen: false}])
    })
  })

  describe('action SECURITY_UPDATE', () => {

    let action

    beforeEach(() => {
      action = {
        type: 'SECURITY_UPDATE',
        authorized: false
      }
    })

    it('should reset state when not authorized', () => {
      const currentState = {other: 'expected'}

      expect(entryReducers(currentState, action)).toContainObject(initialState())
    })

    it('should do nothing when authorized', () => {
      action.authorized = true

      const currentState = {other: 'expected'}
      const expectedState = {other: 'expected'}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })
  })

  describe('action ENTRY_CHANGED', () => {

    let action

    beforeEach(() => {
      action = {
        type: 'ENTRY_CHANGED',
        newValue: {uuid: '2', seen: true}
      }
    })

    it('should do nothing when changed entry is not in store', () => {
      const currentState = {entries: [{uuid: '1', seen: false}], tags: []}

      expect(entryReducers(currentState, action)).toContainObject(currentState)
    })

    it('should set seen flag to false for given entry', () => {
      action.newValue = {uuid: '2', seen: true}

      const currentState = {entries: [{uuid: '1', seen: false}, {uuid: '2', seen: false}], tags: []}
      const expectedState = {entries: [{uuid: '1', seen: false}, {uuid: '2', seen: true}], tags: []}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })

    it('should extract and store tags from entry', () => {
      action.newValue = {uuid: '2', tag: 'tag1, tag2'}

      const currentState = {entries: [], tags: []}
      const expectedState = {tags: ['tag1', 'tag2']}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })

    it('should update existing tags', () => {
      action.newValue = {uuid: '2', tag: 'tag1, tag2'}

      const currentState = {entries: [], tags: ['tag2']}
      const expectedState = {tags: ['tag1', 'tag2']}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })
  })

  describe('action ENTRY_CLEAR', () => {

    it('should clear entries and links', () => {
      const action = {type: 'ENTRY_CLEAR'}

      const currentState = {links: {path: 'expected path'}, entries: [1]}
      const expectedState = {links: {}, entries: []}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })
  })

  describe('action ENTRY_FOCUS_NEXT', () => {

    let action

    beforeEach(() => {
      action = {
        type: 'ENTRY_FOCUS_NEXT',
        currentInFocus: null
      }
    })

    it('should mark first entry as focused', () => {
      const currentState = {entries: [{uuid: 1}], entryInFocus: null}
      const expectedState = {entryInFocus: 1}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })

    it('should mark second entry as focused', () => {
      action.currentInFocus = 1

      const currentState = {entries: [{uuid: 2}], entryInFocus: 1}
      const expectedState = {entryInFocus: 2}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })

    it('should do nothing when last entry focused', () => {
      action.currentInFocus = 1

      const currentState = {entries: [{uuid: 1}], entryInFocus: 1}
      const expectedState = {entryInFocus: 1}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })
  })

  describe('action ENTRY_FOCUS_PREVIOUS', () => {

    let action

    beforeEach(() => {
      action = {
        type: 'ENTRY_FOCUS_PREVIOUS',
        currentInFocus: null
      }
    })

    it('should do nothing when no entry focused', () => {
      const currentState = {entries: [{uuid: 1}], entryInFocus: null}
      const expectedState = {entryInFocus: null}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })

    it('should mark first entry as focused', () => {
      action.currentInFocus = 2

      const currentState = {entries: [{uuid: 1}, {uuid: 2}], entryInFocus: 2}
      const expectedState = {entryInFocus: 1}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })

    it('should mark no entry as focused', () => {
      action.currentInFocus = 1

      const currentState = {entries: [{uuid: 1}], entryInFocus: 1}
      const expectedState = {entryInFocus: null}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })
  })

  describe('action ENTRY_TAGS_RECEIVED', () => {

    it('should set tags', () => {
      const action = {
        type: 'ENTRY_TAGS_RECEIVED',
        tags: ['tag1', 'tag2']
      }

      const currentState = {tags: []}
      const expectedState = {tags: ['tag1', 'tag2']}

      expect(entryReducers(currentState, action)).toContainObject(expectedState)
    })
  })
})
