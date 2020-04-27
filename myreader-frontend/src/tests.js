import 'mock-local-storage'
import 'intersection-observer'
import {toContainActionData, toContainObject, toEqualActionType} from './app/js/shared/custom-matcher'
import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()})

afterEach(() => {
  localStorage.clear()
})

expect.extend({toEqualActionType, toContainObject, toContainActionData})
