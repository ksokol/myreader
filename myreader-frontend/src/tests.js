import '@testing-library/jest-dom/extend-expect'
import '../__mocks__/global/fetch'
import {
  toMatchRequest,
} from './app/js/shared/custom-matcher'

beforeAll(() => {
  window.HTMLDialogElement.prototype.showModal = function() {
    this.setAttribute('open', '')
  }
  window.HTMLDialogElement.prototype.close = function() {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
})

afterEach(() => {
  localStorage.clear()
  jest.restoreAllMocks()
})

expect.extend({
  toMatchRequest,
})

Element.prototype.scrollIntoView = jest.fn()
Element.prototype.scrollTo = jest.fn()

window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}))

window.matchMedia = () => ({
  addEventListener: () => null,
  removeEventListener: () => null,
})
