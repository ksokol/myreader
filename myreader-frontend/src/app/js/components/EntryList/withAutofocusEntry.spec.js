import React from 'react'
import {mount} from 'enzyme'
import {withAutofocusEntry} from './withAutofocusEntry'

jest.mock('../../contexts', () => ({
  withAppContext: Component => Component
}))
/* eslint-enable */

const Component = () => <p>wrapped component</p>

describe('withAutofocusEntry', () => {

  let props

  const createWrapper = () => {
    const WrappedComponent = withAutofocusEntry(Component)
    return mount(<WrappedComponent {...props} />)
  }

  beforeEach(() => {
    props = {
      hotkeysStamp: 0,
      hotkey: null,
      entries: [
        {uuid: '1', seen: true},
        {uuid: '2', seen: false}
      ],
      onChangeEntry: jest.fn()
    }
  })

  it('should render wrapped component', () => {
    expect(createWrapper().find('p').text()).toEqual('wrapped component')
  })

  it('should focus first entry', () => {
    const wrapper = createWrapper()
    wrapper.setProps({hotkeysStamp: 1, hotkey: 'ArrowRight'}).update()

    expect(wrapper.find('Component').prop('entryInFocus').uuid).toEqual('1')
  })

  it('should pass expected props to wrapped component', () => {
    expect(createWrapper().find('Component').props()).toEqual(expect.objectContaining({
      entries: [
        {uuid: '1', seen: true},
        {uuid: '2', seen: false}
      ],
      entryInFocus: {}
    }))
  })

  it('should focus previous entry', () => {
    const wrapper = createWrapper()
    wrapper.setProps({hotkeysStamp: 1, hotkey: 'ArrowRight'}).update()
    wrapper.setProps({hotkeysStamp: 2, hotkey: 'ArrowRight'}).update()
    wrapper.setProps({hotkeysStamp: 3, hotkey: 'ArrowLeft'}).update()

    expect(wrapper.find('Component').prop('entryInFocus').uuid).toEqual('1')
  })

  it('should focus entry when context prop "hotkey" contains "ArrowRight" and entry seen flag is set to true', () => {
    props.entries[1].seen = true
    const wrapper = createWrapper()
    wrapper.setProps({hotkeysStamp: 1, hotkey: 'ArrowRight'}).update()

    expect(wrapper.find('Component').prop('entryInFocus')).toEqual(expect.objectContaining({uuid: '1'}))
  })

  it('should trigger prop function "onChangeEntry" when seen flag ist set to false for first focusable entry', () => {
    props.entries[0].seen = false
    const wrapper = createWrapper()
    wrapper.setProps({hotkeysStamp: 1, hotkey: 'ArrowRight'}).update()

    expect(props.onChangeEntry).toHaveBeenCalledWith({uuid: '1', seen: true})
  })

  it('should dispatch action PATCH_ENTRY when esc key pressed', () => {
    const wrapper = createWrapper()
    wrapper.setProps({hotkeysStamp: 1, hotkey: 'ArrowRight'}).update()
    wrapper.setProps({hotkeysStamp: 2, hotkey: 'Escape'}).update()

    expect(props.onChangeEntry).toHaveBeenCalledWith({uuid: '1', seen: false})
  })

  it('should trigger prop function "onChangeEntry" with next focusable entry', () => {
    const wrapper = createWrapper()
    wrapper.setProps({hotkeysStamp: 1, hotkey: 'ArrowRight'}).update()
    wrapper.setProps({hotkeysStamp: 2, hotkey: 'ArrowRight'}).update()

    expect(props.onChangeEntry).toHaveBeenCalledWith( {uuid: '2', seen: true})
  })

  it('should focus second entry', () => {
    const wrapper = createWrapper()
    wrapper.setProps({hotkeysStamp: 1, hotkey: 'ArrowRight'}).update()
    wrapper.setProps({hotkeysStamp: 2, hotkey: 'ArrowRight'}).update()

    expect(wrapper.find('Component').prop('entryInFocus')).toEqual(expect.objectContaining({uuid: '2'}))
  })

  it('should still focus second entry when last entry reached', () => {
    const wrapper = createWrapper()
    wrapper.setProps({hotkeysStamp: 1, hotkey: 'ArrowRight'}).update()
    wrapper.setProps({hotkeysStamp: 2, hotkey: 'ArrowRight'}).update()
    wrapper.setProps({hotkeysStamp: 3, hotkey: 'ArrowRight'}).update()

    expect(wrapper.find('Component').prop('entryInFocus')).toEqual(expect.objectContaining({uuid: '2'}))
  })

  it('should not trigger prop function "onChangeEntry" when seen flag ist set to true for first focusable entry', () => {
    const wrapper = createWrapper()
    wrapper.setProps({hotkeysStamp: 1, hotkey: 'ArrowRight'}).update()

    expect(props.onChangeEntry).not.toHaveBeenCalledWith()
  })

  it('should not focus any entry when entries are not available', () => {
    props.entries = []
    const wrapper = createWrapper()
    wrapper.setProps({hotkeysStamp: 1, hotkey: 'ArrowRight'}).update()

    expect(wrapper.find('Component').prop('entryInFocus')).toEqual(expect.objectContaining({}))
  })
})
