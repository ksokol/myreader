import '@testing-library/jest-dom/extend-expect'
import '../__mocks__/global/fetch'
import { TextEncoder, TextDecoder } from 'util'
import crypto from 'crypto'

Object.assign(global, { TextDecoder, TextEncoder });

Object.defineProperty(global.self, "crypto", {
  value: {
    subtle: crypto.webcrypto.subtle,
  },
});

afterEach(() => {
  localStorage.clear()
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

window.HTMLDialogElement.prototype.showModal = function() {
  this.setAttribute('open', '')
}

window.HTMLDialogElement.prototype.close = function() {
  this.removeAttribute('open')
  this.dispatchEvent(new Event('close'))
}

jest.retryTimes(3)
