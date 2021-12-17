import {toast} from '.'
import {act} from 'react-dom/test-utils'

const errorClass = 'my-toast__item--error'
const expectedText = 'expected text'

const notifications = () => document.querySelectorAll('.my-toast__item')

describe('Toast', () => {

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() =>  {
    act(() => jest.runAllTimers())
    act(() => jest.runOnlyPendingTimers())
  })

  it('should not render any toast message when mounted', () => {
    expect(document.querySelector('.my-toast')).toEqual(null)
  })

  it('should render toast message when message is present', () => {
    act(() => toast(expectedText))

    expect(notifications()[0].innerHTML).toEqual(expectedText)
  })

  it('should render message object as string when message is an object', () => {
    act(() => toast({a: 'b'}))

    expect(notifications()[0].innerHTML).toEqual('{"a":"b"}')
  })

  it('should render three notifications in reverse order', () => {
    act(() => toast('text1'))
    act(() => toast('text2'))
    act(() => toast('text3', {error: true}))
    act(() => toast('text4'))

    expect(notifications()).toHaveLength(3)
    expect(notifications()[0].innerHTML).toEqual('text4')
    expect(notifications()[0].classList.contains(errorClass)).toEqual(false)
    expect(notifications()[1].innerHTML).toEqual('text3')
    expect(notifications()[1].classList.contains(errorClass)).toEqual(true)
    expect(notifications()[2].innerHTML).toEqual('text2')
    expect(notifications()[2].classList.contains(errorClass)).toEqual(false)
  })

  it('should remove toast message when clicked', () => {
    act(() => toast(expectedText))
    expect(notifications()).toHaveLength(1)

    act(() => notifications()[0].click())
    expect(notifications()).toHaveLength(0)
  })

  it('should remove toast message after a predefined amount of time', () => {
    act(() => toast('text1'))
    jest.advanceTimersByTime(500)
    act(() => toast('text2'))
    jest.advanceTimersByTime(500)
    act(() => toast('text3'))
    jest.advanceTimersByTime(500)

    expect(notifications()).toHaveLength(3)

    jest.advanceTimersByTime(1499)
    expect(notifications()).toHaveLength(3)
    expect(notifications()[0].innerHTML).toEqual('text3')
    expect(notifications()[1].innerHTML).toEqual('text2')
    expect(notifications()[2].innerHTML).toEqual('text1')

    act(() => jest.advanceTimersByTime(1))
    expect(notifications()).toHaveLength(2)
    expect(notifications()[0].innerHTML).toEqual('text3')
    expect(notifications()[1].innerHTML).toEqual('text2')

    act(() => jest.advanceTimersByTime(499))
    expect(notifications()).toHaveLength(2)

    act(() => jest.advanceTimersByTime(1))
    expect(notifications()).toHaveLength(1)
    expect(notifications()[0].innerHTML).toEqual('text3')

    act(() => jest.advanceTimersByTime(499))
    expect(notifications()).toHaveLength(1)

    act(() => jest.advanceTimersByTime(1))
    expect(notifications()).toHaveLength(0)
  })
})
