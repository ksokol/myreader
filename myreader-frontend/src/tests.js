import '@testing-library/jest-dom/extend-expect'
import {act} from '@testing-library/react'
import '../__mocks__/global/fetch'
import {
  toMatchRequest,
} from './app/js/shared/custom-matcher'

beforeAll(() => {
  window.HTMLDialogElement = undefined
})

afterEach(() => {
  localStorage.clear()
  act(() => jest.runOnlyPendingTimers())
  jest.restoreAllMocks()
})

expect.extend({
  toMatchRequest,
})

Element.prototype.scrollIntoView = jest.fn()

window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}))
