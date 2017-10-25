describe('src/app/js/subscription/subscription-exclusion-panel/subscription-exclusion/exclusion.service.spec.js', function () {

    var httpBackend, service;

    beforeEach(require('angular').mock.module('myreader'));

    beforeEach(inject(function ($httpBackend, exclusionService) {
        httpBackend = $httpBackend;
        service = exclusionService;
    }));

    it('should return expected body', function (done) {

        var response1 = '{ ' +
            '  "links": [{' +
            '    "rel": "first",' +
            '    "href": "/api/2/exclusions/1/pattern?page=0&size=1"' +
            '  }, {' +
            '    "rel": "self",' +
            '    "href": "/api/2/exclusions/1/pattern"' +
            '  }, {' +
            '    "rel": "next",' +
            '    "href": "/api/2/exclusions/1/pattern?page=1&size=1"' +
            '  }, { ' +
            '    "rel": "last",' +
            '    "href": "/api/2/exclusions/1/pattern?page=1&size=1"' +
            '  }],' +
            '  "content": [{' +
            '    "uuid": "167",' +
            '    "hitCount": 0,' +
            '    "pattern": "adasd",' +
            '    "links": []' +
            '  }], ' +
            '  "page": {' +
            '    "size": 1,' +
            '    "totalElements": 2,' +
            '    "totalPages": 2,' +
            '    "number": 0' +
            '  }' +
            '}';

        var response2 = '{' +
            '  "links": [{' +
            '    "rel": "first",' +
            '    "href": "/api/2/exclusions/1/pattern?page=0&size=1"' +
            '  }, {' +
            '    "rel": "prev",' +
            '    "href": "/api/2/exclusions/1/pattern?page=0&size=1"' +
            '  }, {' +
            '    "rel": "self",' +
            '    "href": "/api/2/exclusions/1/pattern"' +
            '  }, {' +
            '    "rel": "last",' +
            '    "href": "/api/2/exclusions/1/pattern?page=1&size=1"' +
            '  }],' +
            '  "content": [{' +
            '     "uuid": "229",' +
            '     "hitCount": 0,' +
            '      "pattern": "b",' +
            '      "links": []' +
            '  }],' +
            '  "page": {' +
            '      "size": 1,' +
            '      "totalElements": 2,' +
            '      "totalPages": 2,' +
            '      "number": 1' +
            '  }' +
            '}';

        httpBackend.expectGET('/myreader/api/2/exclusions/1/pattern').respond(response1);
        httpBackend.expectGET('/myreader/api/2/exclusions/1/pattern?page=1&size=1').respond(response2);

        service.find('1')
            .then(function (data) {
                expect(data)
                    .toEqual([{
                        "uuid": "167",
                        "hitCount": 0,
                        "pattern": "adasd",
                        "links": []}
                    , {
                        "uuid": "229",
                        "hitCount": 0,
                        "pattern": "b",
                        "links": []
                    }]);
                done();
            });

        httpBackend.flush();
    });

    it('should post expected body', function (done) {
        httpBackend
            .expectPOST('/myreader/api/2/exclusions/exclusionUuid/pattern', {pattern: 'secondParam'})
            .respond('expected');

        service.save('exclusionUuid', 'secondParam')
            .then(function (data) {
                expect(data).toEqual('expected');
                done();
            });

        httpBackend.flush();
    });

    it('should delete', function (done) {
        httpBackend
            .expectDELETE('/myreader/api/2/exclusions/subscriptionUuid/pattern/exclusionUuid')
            .respond();

        service.delete('subscriptionUuid', 'exclusionUuid')
            .then(done);

        httpBackend.flush();
    });
});
