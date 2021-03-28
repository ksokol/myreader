import '@testing-library/jest-dom/extend-expect'
import {act} from '@testing-library/react'
import '../__mocks__/global/fetch'
import {
  toMatchGetRequest,
  toMatchPatchRequest,
  toMatchPostRequest,
  toMatchDeleteRequest,
  toMatchPutRequest,
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
  toMatchPatchRequest,
  toMatchGetRequest,
  toMatchPostRequest,
  toMatchDeleteRequest,
  toMatchPutRequest,
})

Element.prototype.scrollIntoView = jest.fn()

window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}))
