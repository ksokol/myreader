import '@testing-library/jest-dom/extend-expect'
import {act} from '@testing-library/react'
import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '../__mocks__/global/fetch'
import {
  toMatchGetRequest,
  toMatchPatchRequest,
  toMatchPostRequest,
  toMatchDeleteRequest,
  toMatchPutRequest,
} from './app/js/shared/custom-matcher'

configure({adapter: new Adapter()})

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
