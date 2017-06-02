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

    describe('isEmptyString()', function () {

        it('should return true when string is empty', function () {
           expect(utils.isEmptyString('')).toEqual(true);
        });

        it('should return true when value is null', function () {
            expect(utils.isEmptyString(null)).toEqual(true);
        });

        it('should return false when value is not an empty string', function () {
            expect(utils.isEmptyString('string')).toEqual(false);
        });

        it('should throw an error when value is not of type string', function () {
            expect(function () {
                return utils.isEmptyString({});
            }).toThrowError('value is not a string');
        });
    })
});
