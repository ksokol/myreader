import 'mock-local-storage'
import 'intersection-observer'
import {toContainActionData, toContainObject, toEqualActionType} from './app/js/shared/custom-matcher'
import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import RelativeTimeFormat from 'relative-time-format'
import en from 'relative-time-format/locale/en.json'

configure({adapter: new Adapter()})

RelativeTimeFormat.addLocale(en)
global['Intl'].RelativeTimeFormat = RelativeTimeFormat

afterEach(() => {
  localStorage.clear()
})

expect.extend({toEqualActionType, toContainObject, toContainActionData})
