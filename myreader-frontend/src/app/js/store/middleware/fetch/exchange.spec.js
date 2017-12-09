import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {exchange, supportedMethods} from './exchange'
import {initialState} from '../../common/index'

const createFetchMock = () => {
    const fetchSpy = spyOn(window, 'fetch')
    const firstCall = () => fetchSpy.calls.first().args[0]

    return {
        url: () => firstCall().url.replace(window.location.origin, ''),
        method: () => firstCall().method,
        header: name => firstCall().headers.get(name),
        body: () => firstCall(),
        request: () => firstCall(),
        respond: ({status = 200, statusText = '', body = '', headers = {}}) => {
            const response = new Response(
                new Blob([body], {type: headers['content-type']}),
                {status, statusText, headers: new Headers(headers)}
            )
            fetchSpy.and.returnValue(Promise.resolve(response))
        },
        reject: error => fetchSpy.and.returnValue(Promise.reject(error))
    }
}

describe('src/app/js/store/middleware/fetch/exchange.spec.js', () => {

    let store, fetchMock

    beforeEach(() => {
        fetchMock = createFetchMock()
        const mockStore = configureMockStore([thunk])
        store = mockStore({common: initialState()})
    })

    const execute = (method, params) => exchange({...params, method}).call(this, store.dispatch)

    it('should dispatch FETCH_START action when http request is about to start', done => {
        fetchMock.respond({status: 200})

        execute('GET').then(() => {
            expect(store.getActions()[0]).toEqualActionType('FETCH_START')
            done()
        })
    })

    it('should dispatch FETCH_END action when http request finished', done => {
        fetchMock.respond({status: 200})

        execute('GET').then(() => {
            expect(store.getActions()[1]).toEqualActionType('FETCH_END')
            done()
        })
    })

    it('should dispatch notification action with error text when http request rejected', done => {
        fetchMock.respond({status: 500, statusText: 'expected statusText'})

        execute('GET').catch(() => {
            expect(store.getActions()[0]).toEqualActionType('FETCH_START')
            expect(store.getActions()[1]).toContainActionData({notification: {text: 'expected statusText'}})
            expect(store.getActions()[2]).toEqualActionType('FETCH_END')
            done()
        })
    })

    it('should dispatch notification action with error text when http request failed', done => {
        fetchMock.reject('expected error')

        execute('GET').catch(() => {
            expect(store.getActions()[0]).toEqualActionType('FETCH_START')
            expect(store.getActions()[1]).toContainActionData({notification: {text: 'expected error'}})
            expect(store.getActions()[2]).toEqualActionType('FETCH_END')
            done()
        })
    })

    it('should dispatch SECURITY_UPDATE action when http request is unauthorized', done => {
        fetchMock.respond({status: 401})

        execute('GET').catch(() => {
            expect(store.getActions()[0]).toEqualActionType('FETCH_START')
            expect(store.getActions()[1]).toEqualActionType('FETCH_END')
            expect(store.getActions()[2]).toEqualActionType('SECURITY_UPDATE')
            done()
        })
    })

    it('should GET resource', done => {
        fetchMock.respond({status: 200})

        execute('GET', {url: 'test'}).then(() => {
            expect(fetchMock.url()).toEqual('/test')
            expect(fetchMock.method()).toEqual('GET')
            done()
        })
    })

    it('should POST to resource', done => {
        fetchMock.respond({status: 200})

        execute('POST', {url: 'test'}).then(() => {
            expect(fetchMock.url()).toEqual('/test')
            expect(fetchMock.method()).toEqual('POST')
            done()
        })
    })

    it('should use default content-type "application/json"', done => {
        fetchMock.respond({status: 200})

        execute('POST', {body: {id: 1}}).then(() => {
            expect(fetchMock.header('content-type')).toEqual('application/json')
            fetchMock.body().json().then(done)
        })
    })

    it('should use given content-type', done => {
        fetchMock.respond({status: 200})

        execute('POST', {body: '{id: 1}', headers: {'Content-type': 'text/plain'}}).then(() => {
            expect(fetchMock.header('content-type')).toEqual('text/plain')
            fetchMock.body().text().then(done)
        })
    })

    it('should include credentials', done => {
        fetchMock.respond({status: 200})

        execute('GET').then(() => {
            expect(fetchMock.request().credentials).toEqual('same-origin')
            done()
        })
    })

    it('should return json body when http request succeeded', done => {
        fetchMock.respond({status: 200, headers: {'content-type': 'application/json'}, body: '{"id": 1}'})

        execute('GET').then(response => {
            expect(response).toEqual({id: 1})
            done()
        })
    })

    it('should return text body when http request succeeded', done => {
        fetchMock.respond({status: 200, headers: {'content-type': 'text/plain'}, body: 'expected body'})

        execute('POST').then(response => {
            expect(response).toEqual('expected body')
            done()
        })
    })

    it('should return json body when http request is unauthorized', done => {
        fetchMock.respond({status: 400, headers: {'content-type': 'application/json'}, body: '{"id": 1}'})

        execute('POST').catch(response => {
            expect(response).toEqual({id: 1})
            done()
        })
    })

    it('should return text body when http request is unauthorized', done => {
        fetchMock.respond({status: 400, headers: {'content-type': 'text/plain'}, body: 'expected body'})

        execute('POST').catch(response => {
            expect(response).toEqual('expected body')
            done()
        })
    })

    it('should return json body when http request is rejected', done => {
        fetchMock.respond({status: 401, headers: {'content-type': 'application/json'}, body: '{"id": 1}'})

        execute('POST').catch(response => {
            expect(response).toEqual({id: 1})
            done()
        })
    })

    it('should return text body when http request is rejected', done => {
        fetchMock.respond({status: 401, headers: {'content-type': 'text/plain'}, body: 'expected body'})

        execute('POST').catch(response => {
            expect(response).toEqual('expected body')
            done()
        })
    })

    it('should ignore body when http method is GET', done => {
        fetchMock.respond({status: 200, body: '{"id": 1}'})

        execute('GET').then(done)
    })

    it('should ignore body when http method is HEAD', done => {
        fetchMock.respond({status: 200, body: '{"id": 1}'})

        execute('HEAD').then(done)
    })

    it('should return supported http methods', () =>
        expect(supportedMethods()).toEqual(['POST', 'PUT', 'DELETE', 'PATCH', 'GET', 'HEAD']))
})
