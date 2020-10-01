import '@testing-library/jest-dom/extend-expect'
import {act} from '@testing-library/react'
import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '../__mocks__/global/fetch'
import {
  toContainObject,
  toMatchGetRequest,
  toMatchPatchRequest,
  toMatchPostRequest
} from './app/js/shared/custom-matcher'

configure({adapter: new Adapter()})

afterEach(() => {
  localStorage.clear()
  act(() => jest.runOnlyPendingTimers())
})

expect.extend({toContainObject, toMatchPatchRequest, toMatchGetRequest, toMatchPostRequest})

Element.prototype.scrollIntoView = jest.fn()

window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}))
