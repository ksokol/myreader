import {exchange} from './exchange'

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
        reject: error => fetchSpy.and.returnValue(Promise.reject(error)),
        error: error => fetchSpy.and.returnValue(new Promise(() => {throw error}))
    }
}

describe('src/app/js/store/middleware/fetch/exchange.spec.js', () => {

    let fetchMock

    beforeEach(() => fetchMock = createFetchMock())

    const execute = (method, params) => exchange({...params, method})

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

    it('should add x-requested-with header', done => {
        fetchMock.respond({status: 200})

        execute('POST', {body: {id: 1}}).then(() => {
            expect(fetchMock.header('x-requested-with')).toEqual('XMLHttpRequest')
            done()
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
            expect(response).toContainObject({ok: true, status: 200, data: {id: 1}})
            done()
        })
    })

    it('should return text body when http request succeeded', done => {
        fetchMock.respond({status: 200, headers: {'content-type': 'text/plain'}, body: 'expected body'})

        execute('POST').then(response => {
            expect(response).toContainObject({ok: true, status: 200, data: 'expected body'})
            done()
        })
    })

    it('should return json body when http request is unauthorized', done => {
        fetchMock.respond({status: 401, headers: {'content-type': 'application/json'}, body: '{"id": 1}'})

        execute('POST').then(response => {
            expect(response).toContainObject({ok: false, status: 401, data: {id: 1}})
            done()
        })
    })

    it('should return text body when http request is unauthorized', done => {
        fetchMock.respond({status: 401, headers: {'content-type': 'text/plain'}, body: 'expected body'})

        execute('POST').then(response => {
            expect(response).toContainObject({ok: false, status: 401, data: 'expected body'})
            done()
        })
    })

    it('should return json body when http request failed', done => {
        fetchMock.respond({status: 400, headers: {'content-type': 'application/json'}, body: '{"id": 1}'})

        execute('POST').then(response => {
            expect(response).toContainObject({ok: false, status: 400, data: {id: 1}})
            done()
        })
    })

    it('should return text body when http request failed', done => {
        fetchMock.respond({status: 400, headers: {'content-type': 'text/plain'}, body: 'expected body'})

        execute('POST').then(response => {
            expect(response).toContainObject({ok: false, status: 400, data: 'expected body'})
            done()
        })
    })

    it('should return all headers when response is of type text/plain', done => {
        fetchMock.respond({status: 401, headers: {'content-type': 'text/plain', a: 'b'}, body: '{"id": 1}'})

        execute('POST').then(response => {
            expect(response).toContainObject({headers: {'content-type': 'text/plain', a: 'b'}})
            done()
        })
    })

    it('should return all headers when response is of type application/json', done => {
        fetchMock.respond({status: 401, headers: {'content-type': 'application/json', a: 'b'}, body: '{"id": 1}'})

        execute('POST').then(response => {
            expect(response).toContainObject({headers: {'content-type': 'application/json', a: 'b'}})
            done()
        })
    })

    it('should return empty headers when http request failed for unknown reason', done => {
        fetchMock.error('expected error')

        execute('POST').then(response => {
            expect(response).toContainObject({headers: {}})
            done()
        })
    })

    it('should return text error message when http request failed for unknown reason', done => {
        fetchMock.error('expected error')

        execute('POST').then(response => {
            expect(response).toContainObject({ok: false, status: -1, data: 'expected error'})
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
})
