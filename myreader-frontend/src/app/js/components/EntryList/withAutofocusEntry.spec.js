import React from 'react'
import {mount} from 'enzyme'
import {withAutofocusEntry} from './withAutofocusEntry'
import {useHotkeys} from '../../contexts/hotkeys'

jest.mock('../../contexts/hotkeys', () => ({
  useHotkeys: jest.fn().mockReturnValue({
    hotkeysStamp: 0,
    hotkey: undefined
  })
}))
/* eslint-enable */

const Component = () => <p>wrapped component</p>

describe('withAutofocusEntry', () => {

  let props, wrapper
  let hotkeysStamp = 0

  const createWrapper = () => {
    const WrappedComponent = withAutofocusEntry(Component)
    return mount(<WrappedComponent {...props} />)
  }

  const hotkey = key => {
    hotkeysStamp += 1
    useHotkeys.mockReturnValue({hotkeysStamp, hotkey: key})
    wrapper.mount()
    wrapper.update()
  }

  beforeEach(() => {
    useHotkeys.mockReturnValue({
      hotkeysStamp: 0,
      hotkey: null
    })
    props = {
      entries: [
        {uuid: '1', seen: true},
        {uuid: '2', seen: false}
      ],
      onChangeEntry: jest.fn()
    }

    wrapper = createWrapper()
  })

  it('should render wrapped component', () => {
    expect(wrapper.find('p').text()).toEqual('wrapped component')
  })

  it('should pass expected props to wrapped component', () => {
    expect(wrapper.find('Component').props()).toEqual(expect.objectContaining({
      entries: [
        {uuid: '1', seen: true},
        {uuid: '2', seen: false}
      ],
      entryInFocus: {}
    }))
  })

  it('should focus first entry when arrow right key pressed', () => {
    hotkey('ArrowRight')

    expect(wrapper.find('Component').prop('entryInFocus').uuid).toEqual('1')
  })

  it('should focus first entry when arrow right key pressed ignoring seen flag', () => {
    wrapper.setProps({
      entries: [
        {uuid: '1', seen: true},
        {uuid: '2', seen: false},
      ]
    })
    wrapper.mount()

    hotkey('ArrowRight')

    expect(wrapper.find('Component').prop('entryInFocus').uuid).toEqual('1')
  })

  it('should focus previous entry', () => {
    hotkey('ArrowRight')
    hotkey('ArrowRight')
    hotkey('ArrowLeft')

    expect(wrapper.find('Component').prop('entryInFocus').uuid).toEqual('1')
  })

  it('should trigger prop function "onChangeEntry" when seen flag ist set to false for first focusable entry', () => {
    wrapper.setProps({
      entries: [
        {uuid: '1', seen: false},
        {uuid: '2', seen: false},
      ]
    })
    wrapper.mount()

    hotkey('ArrowRight')

    expect(props.onChangeEntry).toHaveBeenCalledWith({uuid: '1', seen: true})
  })

  it('should trigger prop function "onChangeEntry" when escape key pressed', () => {
    hotkey('ArrowRight')
    hotkey('Escape')

    expect(props.onChangeEntry).toHaveBeenCalledWith({uuid: '1', seen: false})
  })

  it('should trigger prop function "onChangeEntry" with next focusable entry', () => {
    hotkey('ArrowRight')
    hotkey('ArrowRight')

    expect(props.onChangeEntry).toHaveBeenCalledWith( {uuid: '2', seen: true})
  })

  it('should focus second entry', () => {
    hotkey('ArrowRight')
    hotkey('ArrowRight')

    expect(wrapper.find('Component').prop('entryInFocus').uuid).toEqual('2')
  })

  it('should still focus second entry when last entry reached', () => {
    hotkey('ArrowRight')
    hotkey('ArrowRight')
    hotkey('ArrowRight')

    expect(wrapper.find('Component').prop('entryInFocus').uuid).toEqual('2')
  })

  it('should not trigger prop function "onChangeEntry" when seen flag ist set to true for first focusable entry', () => {
    hotkey('ArrowRight')

    expect(props.onChangeEntry).not.toHaveBeenCalledWith()
  })

  it('should not focus any entry when entries are not available', () => {
    hotkey('ArrowRight')
    wrapper.setProps({
      entries: []
    })
    wrapper.mount()

    expect(wrapper.find('Component').prop('entryInFocus')).toEqual({})
  })

  it('should toggle seen flag when escape key pressed', () => {
    hotkey('ArrowRight')
    hotkey('Escape')
    wrapper.setProps({
      entries: [
        {uuid: '1', seen: false},
        {uuid: '2', seen: false},
      ]
    })
    wrapper.mount()
    hotkey('Escape')

    expect(props.onChangeEntry).toHaveBeenNthCalledWith(1, {uuid: '1', seen: false})
    expect(props.onChangeEntry).toHaveBeenNthCalledWith(2, {uuid: '1', seen: true})
  })

  it('should not toggle seen flag for first entry again when removing focus', () => {
    wrapper.setProps({
      entries: [
        {uuid: '1', seen: false},
        {uuid: '2', seen: false},
      ]
    })
    hotkey('ArrowRight')
    wrapper.setProps({
      entries: [
        {uuid: '1', seen: true},
        {uuid: '2', seen: false},
      ]
    })
    hotkey('ArrowLeft')

    expect(props.onChangeEntry).toBeCalledTimes(1)
    expect(props.onChangeEntry).toHaveBeenNthCalledWith(1, {uuid: '1', seen: true})
  })

  it('should not toggle seen flag for first entry again when focusing second entry', () => {
    wrapper.setProps({
      entries: [
        {uuid: '1', seen: false},
        {uuid: '2', seen: false},
      ]
    })
    hotkey('ArrowRight')
    wrapper.setProps({
      entries: [
        {uuid: '1', seen: true},
        {uuid: '2', seen: false},
      ]
    })
    hotkey('Escape')
    wrapper.setProps({
      entries: [
        {uuid: '1', seen: false},
        {uuid: '2', seen: false},
      ]
    })
    hotkey('ArrowRight')

    expect(props.onChangeEntry).toHaveBeenNthCalledWith(1, {uuid: '1', seen: true})
    expect(props.onChangeEntry).toHaveBeenNthCalledWith(2, {uuid: '1', seen: false})
    expect(props.onChangeEntry).toHaveBeenNthCalledWith(3, {uuid: '2', seen: true})
  })
})
