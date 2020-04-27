import 'mock-local-storage'
import 'intersection-observer'
import {toContainObject} from './app/js/shared/custom-matcher'
import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()})

afterEach(() => {
  localStorage.clear()
})

expect.extend({toContainObject})
