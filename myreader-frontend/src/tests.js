import 'angular'
import 'angular-mocks'
import 'mock-local-storage'
import 'whatwg-fetch'
import 'intersection-observer'
import './app/js/vendor'
import './app/js/main'
import {toContainActionData, toContainObject, toEqualActionType} from './app/js/shared/custom-matcher'

global.fetch = require('jest-fetch-mock')

window.matchMedia = () => ({matches: false, addListener: () => {}})

afterEach(() => {
    localStorage.clear()
    fetch.resetMocks()
    fetch.mockResponse('')
})

expect.extend({toEqualActionType, toContainObject, toContainActionData})
