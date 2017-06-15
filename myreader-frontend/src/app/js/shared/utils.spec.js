describe('src/app/js/shared/utils.spec.js', function () {

    var utils = require('./utils');

    describe('isPromise() should return', function () {

        describe('false when parameter', function () {

            it('is undefined or null', function () {
                expect(utils.isPromise()).toEqual(false);
                expect(utils.isPromise(null)).toEqual(false);
            });

            it('is a primitive type', function () {
                expect(utils.isPromise(42)).toEqual(false);
            });

            it('is an empty object', function () {
                expect(utils.isPromise({})).toEqual(false);
            });

            it('has invalid properties then, catch and finally', function () {
                var fn = function () {
                };
                var obj = {
                    then: 'then',
                    catch: 'catch',
                    finally: 'finally'
                };
                expect(utils.isPromise(obj)).toEqual(false);

                obj.then = fn;
                expect(utils.isPromise(obj)).toEqual(false);

                obj.catch = fn;
                expect(utils.isPromise(obj)).toEqual(false);
            });
        });

        describe('true when parameter', function () {
            it('has valid properties then, catch and finally', function () {
                var fn = function () {
                };

                var obj = {
                    then: fn,
                    catch: fn,
                    finally: fn
                };
                expect(utils.isPromise(obj)).toEqual(true);
            });
        });
    });

    describe('isBoolean() should return', function () {

        it('false when parameter is of type string', function () {
           expect(utils.isBoolean('true')).toBe(false);
        });

        it('true when parameter is of type boolean', function () {
            expect(utils.isBoolean(true)).toBe(true);
        });

        it('true when parameter is of type boolean and value is false', function () {
            expect(utils.isBoolean(false)).toBe(true);
        });
    });
});
