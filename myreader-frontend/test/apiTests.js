describe('test/apiTests.js', function() {

    var tag1, tag2, tag3, untagged1, untagged2, raw;

    beforeEach(module('common.api'));

    beforeEach(function () {
        tag1 = {
            "uuid": "35",
            "title": "tag1",
            "tag": "news",
            "unseen": 106,
            "links": []
        };

        tag2 = {
            "uuid": "36",
            "title": "tag2",
            "tag": "misc",
            "unseen": 102,
            "links": []
        };

        tag3 = {
            "uuid": "1309597895632",
            "title": "tag3",
            "tag": "misc",
            "unseen": 32,
            "links": []
        };

        untagged1 = {
            "uuid": "52",
            "title": "untagged",
            "tag": null,
            "unseen": 94,
            "links": []
        };

        untagged2 = {
            "uuid": "53",
            "title": "untagged",
            "tag": "",
            "unseen": 0,
            "links": []
        };

        raw = {
           "content": [tag1, tag2, tag3, untagged1, untagged2]
        };
    });

    describe("subscriptionEntriesConverter", function() {
        var converter,
            link = {
                rel: 'next',
                href: 'nextHref'
            };

        beforeEach(inject(function (subscriptionEntriesConverter) {
            converter = subscriptionEntriesConverter;
        }));

        it('should return empty object', function () {
            var converted = converter.convertFrom({content: [], links: []});

            expect(converted.entries).toEqual([]);
            expect(converted.links).toEqual([]);
        });

        it('should return empty object', function () {
            var converted = converter.convertFrom({content: undefined, links: undefined});

            expect(converted.entries).toEqual([]);
            expect(converted.links).toEqual([]);
        });

        it('should return links', function () {
            var converted = converter.convertFrom({content: undefined, links: [link]});

            expect(converted.links).toEqual([link]);
            expect(converted.entries).toEqual([]);
        });

        it('should return entries', function () {
            var converted = converter.convertFrom({content: [1], links: undefined});

            expect(converted.links).toEqual([]);
            expect(converted.entries).toEqual([1]);
        });

        it('should return undefined for rel "next"', function () {
            var converted = converter.convertFrom({content: undefined, links: [{ rel: "unknown" }]});

            expect(converted.next()).toEqual(undefined);
        });

        it('should return link for rel "next"', function () {
            var converted = converter.convertFrom({content: undefined, links: [link]});

            expect(converted.next()).toEqual('nextHref');
        });

        it('should return empty array', function () {
            var converted = converter.convertTo([]);

            expect(converted).toEqualData({content: []});
        });

        it('should return empty array', function () {
            var converted = converter.convertTo([{uuid: "1", seen: true, ignore: "me"}, {uuid: "2", tag: "tag", ignoreMeTwo: true}, {uuid: "3", seen: "true", tag : ""}, {seen: true}]);

            expect(converted).toEqualData({ content : [ { uuid : "1", seen : true }, { uuid : "2", tag : 'tag' }, { uuid : '3', tag : '' } ] });
        });


    });

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
