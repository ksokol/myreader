import 'mock-local-storage'
import 'whatwg-fetch'
import 'intersection-observer'
import {toContainActionData, toContainObject, toEqualActionType} from './app/js/shared/custom-matcher'
import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import RelativeTimeFormat from 'relative-time-format'
import en from 'relative-time-format/locale/en.json'

configure({adapter: new Adapter()})

global.fetch = require('jest-fetch-mock')

RelativeTimeFormat.addLocale(en)
global['Intl'].RelativeTimeFormat = RelativeTimeFormat

window.matchMedia = () => ({
  matches: false, addListener: () => {}
})

window.customElements = {
  define: () => {}
}

afterEach(() => {
  localStorage.clear()
  fetch.resetMocks()
  fetch.mockResponse('')
})

expect.extend({toEqualActionType, toContainObject, toContainActionData})
