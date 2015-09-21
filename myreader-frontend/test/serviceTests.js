describe('service', function() {
    var service;

    beforeEach(module('common.services'));

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('permissionService', function() {
        beforeEach(inject(function (permissionService) {
            service = permissionService;
        }));

        it('should return false without roles set', function () {
            expect(service.isAdmin()).toBe(false);
        });

        it('should return false for roles set to void', function () {
            service.setAuthorities();
            expect(service.isAdmin()).toBe(false);
        });

        it('should return false for roles set to role1 and role2', function () {
            service.setAuthorities('role1', 'role2');
            expect(service.isAdmin()).toBe(false);
        });

        it('should return true for roles set to ROLE_ADMIN', function () {
            service.setAuthorities('ROLE_ADMIN');
            expect(service.isAdmin()).toBe(true);
        });
    });
});
