'use strict';

describe('angular-resourceful', function() {

    var module;
    var dependencies;
    dependencies = [];

    var hasModule = function (module) {
        return dependencies.indexOf(module) >= 0;
    };

    beforeEach(function() {

        // Get module
        module = angular.module('resourceful');
        dependencies = module.requires;
    });

    it('should load ngResource module', function() {
        expect(hasModule('ngResource')).toBeTruthy();
    });


});
