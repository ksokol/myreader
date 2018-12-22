import {
  fetchEnd,
  fetchStart,
  hideBackdrop,
  mediaBreakpointChanged,
  removeNotification,
  showErrorNotification,
  showSuccessNotification,
  toggleSidenav
} from '../../store'
import {createMockStore} from '../../shared/test-utils'

describe('common actions', () => {

  let store

  beforeEach(() => {
    store = createMockStore()
  })

  it('action creator removeNotification', () => {
    store.dispatch(removeNotification({id: 1}))
    expect(store.getActions()[0]).toContainObject({type: 'REMOVE_NOTIFICATION', id: 1})
  })

  it('action creator showSuccessNotification', () => {
    store.dispatch(showSuccessNotification('expected text'))
    expect(store.getActions()[0])
      .toContainObject({type: 'SHOW_NOTIFICATION', notification: {id: 0, text: 'expected text', type: 'success'}})
  })

  it('action creator showSuccessNotification should trigger action creator removeNotification action after 3 seconds', () => {
    store.dispatch(showSuccessNotification('expected text'))
    jest.advanceTimersByTime(3000)

    expect(store.getActions()[1]).toContainObject({type: 'REMOVE_NOTIFICATION', id: 0})
  })

  it('action creator showErrorNotification', () => {
    store.dispatch(showErrorNotification('expected text'))

    expect(store.getActions()[0])
      .toContainObject({type: 'SHOW_NOTIFICATION', notification: {id: 0, text: 'expected text', type: 'error'}})
  })

  it('action creator showErrorNotification should trigger action creator removeNotification action after 3 seconds', () => {
    store.dispatch(showErrorNotification('expected text'))
    jest.advanceTimersByTime(3000)

    expect(store.getActions()[1]).toEqual({type: 'REMOVE_NOTIFICATION', id: 0})
  })

  it('action creator fetchStart', () => {
    store.dispatch(fetchStart())

    expect(store.getActionTypes()).toEqual(['FETCH_START'])
  })

  it('action creator fetchEnd', () => {
    store.dispatch(fetchEnd())

    expect(store.getActionTypes()).toEqual(['FETCH_END'])
  })

  it('action creator fetchEnd with error message', () => {
    store.dispatch(fetchEnd('expected error message'))

    expect(store.getActions()[0])
      .toContainObject({type: 'SHOW_NOTIFICATION', notification: {text: 'expected error message', type: 'error'}})
    expect(store.getActions()[1]).toEqualActionType('FETCH_END')
  })

  it('action creator mediaBreakpointChanged', () => {
    store.dispatch(mediaBreakpointChanged('expected breakpoint name'))

    expect(store.getActions()[0]).toEqual({
      type: 'MEDIA_BREAKPOINT_CHANGED',
      mediaBreakpoint: 'expected breakpoint name'
    })
  })

  it('action creator toggleSidenav', () => {
    store.dispatch(toggleSidenav())

    expect(store.getActionTypes()).toEqual(['TOGGLE_SIDENAV'])
  })

  it('action creator hideBackdrop', () => {
    store.dispatch(hideBackdrop())

    expect(store.getActionTypes()).toEqual(['HIDE_BACKDROP'])
  })
})
