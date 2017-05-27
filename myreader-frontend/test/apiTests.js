describe('test/apiTests.js', function() {

    beforeEach(module('common.api'));

    describe("should", function() {
        var service,
            http;

        beforeEach(module(function($provide) {
            $provide.service('mockConverter', function() {
                return {
                    convertFrom: function(data) {
                        return data;
                    },
                    convertTo: function(data) {
                        return data;
                    },
                    convertError: function(data) {
                        return data;
                    }
                }
            })
        }));

        beforeEach(inject(function (api, $httpBackend) {
            service = api;
            http = $httpBackend;
        }));

        it('GET resource', function() {
            http.expectGET('testResource').respond({test: 1});

            var promise = service.get('mock', 'testResource');

            promise.then(function(data) {
                expect(data.test).toBe(1);
            });

            http.flush();
        });

        it('PATCH resource', function() {
            var data = {data: 2};
            http.expectPATCH('testResource', data).respond(200, {test: 3});

            var promise = service.patch('mock', 'testResource', data);

            promise.then(function(data) {
                expect(data.test).toBe(3);
            });

            http.flush();
        });

        it('POST resource', function() {
            var data = {data: 2};
            http.expectPOST('testResource', data).respond(200, {test: 3});

            var promise = service.post('mock', 'testResource', data);

            promise.then(function(data) {
                expect(data.test).toBe(3);
            });

            http.flush();
        });

        it('POST resource and return error', function() {
            var data = {data: 2};
            http.expectPOST('testResource', data).respond(401, {test: 3});

            var promise = service.post('mock', 'testResource', data);

            promise.then(function() {
                expect('success callback').not.toBeCalled();
            }).catch(function(data) {
                expect(data.test).toBe(3);
            });

            http.flush();
        });

        it('PUT resource', function() {
            var data = {data: 2};
            http.expectPUT('testResource', data).respond(200, {test: 3});

            var promise = service.put('mock', 'testResource', data);

            promise.then(function(data) {
                expect(data.test).toBe(3);
            });

            http.flush();
        });

        it('PUT resource and return error', function() {
            var data = {data: 2};
            http.expectPUT('testResource', data).respond(401, {test: 3});

            var promise = service.put('mock', 'testResource', data);

            promise.then(function() {
                expect('success callback').not.toBeCalled();
            }).catch(function(data) {
                expect(data.data.test).toBe(3);
            });

            http.flush();
        });

        it('DELETE resource', function() {
            http.expectDELETE('testResource').respond(201);

            var promise = service.delete('mock', 'testResource');

            promise.then(function(data) {
                expect(data).toBe(undefined);
            });

            http.flush();
        });

    });
});
