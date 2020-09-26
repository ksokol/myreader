import '@testing-library/jest-dom/extend-expect'
import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '../__mocks__/global/fetch'
import {toContainObject, toMatchPatchRequest, toMatchGetRequest} from './app/js/shared/custom-matcher'

configure({adapter: new Adapter()})

afterEach(() => {
  localStorage.clear()
})

expect.extend({toContainObject, toMatchPatchRequest, toMatchGetRequest})

Element.prototype.scrollIntoView = jest.fn()

window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}))
