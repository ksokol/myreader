import {getEntries, getEntry} from '../../store'

describe('entry selectors', () => {

  let state

  beforeEach(() => {
    state = {
      entry: {
        entries: [{uuid: '1'}, {uuid: '2'}],
        links: {
          self: {path: 'path1', query: {a: 'b'}},
          next: {path: 'path2'}
        },
        loading: true,
        entryInFocus: '1',
        tags: ['tag1', 'tag2']
      }
    }
  })

  it('should return entries and links', () =>
    expect(getEntries(state))
      .toContainObject({
        entries: [{uuid: '1'}, {uuid: '2'}],
        links: {
          self: {path: 'path1', query: {a: 'b'}},
          next: {path: 'path2'}
        }
      })
  )

  it('should return copy of entries', () => {
    const select = getEntries(state)
    select.entries[0].key = 'value'

    expect(getEntries(state).entries[0]).toEqual({uuid: '1'})
  })

  it('should return copy of links', () => {
    const select = getEntries(state).links.self
    select.path = 'other'
    select.query.a = 'c'

    expect(getEntries(state).links.self).toEqual({path: 'path1', query: {a: 'b'}})
  })

  it('should return loading flag', () => {
    expect(getEntries(state).loading).toEqual(true)
  })

  it('should return entry for uuid 1', () => {
    expect(getEntry('1', state)).toEqual({uuid: '1'})
  })

  it('should return undefined when entry for uuid 3 is not available', () => {
    expect(getEntry('3', state)).toEqual(undefined)
  })

  it('should return copy of entry', () => {
    const actual = getEntry('1', state)
    actual.key = 'value'
    expect(state.entry.entries[0]).toEqual({uuid: '1'})
  })
})
