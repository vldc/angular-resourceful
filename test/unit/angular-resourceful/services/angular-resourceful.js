'use strict';

describe('resourceful module', function () {
    var any = {
        fn: jasmine.any(Function),
        obj: jasmine.any(Object),
        str: jasmine.any(String)
    };

    beforeEach(module('resourceful'));
    beforeEach(module(function ($provide) {
        $provide.factory('$resource', function () {
            return jasmine.createSpy('resource');
        });
    }));

    //- http://stackoverflow.com/a/16487071
    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expect) {
                return angular.equals(expect, this.actual);
            }
        });
    });


    describe('$resourcefulDataKey value', function () {
        var _$resourcefulDataKey;

        beforeEach(inject(function ($resourcefulDataKey) {
            _$resourcefulDataKey = $resourcefulDataKey;
        }));

        it('should be defined', function () {
            expect(_$resourcefulDataKey).toBeDefined();
        });

        it('should be an object', function () {
            expect(_$resourcefulDataKey).toEqual(any.obj);
        });
    });

    describe('$resourcefulDefaultActions', function () {
        var _$resourcefulDefaultActions;

        beforeEach(inject(function ($resourcefulDefaultActions) {
            _$resourcefulDefaultActions = $resourcefulDefaultActions;
        }));

        it('should be defined', function () {
            expect(_$resourcefulDefaultActions).toBeDefined();
        });

        it('should be an object', function () {
            expect(_$resourcefulDefaultActions).toEqual(any.obj);
        });
    })

    describe('$resourceful', function () {
        var _$resourceful;
        var _setOnce;
        var _dataKey;
        var _run;
        var testValues = ['hello', '', true, false, 0, 1, 'ąśźćół', 1234509, -3.778345, Infinity, -Infinity, null];

        beforeEach(inject(function ($resourceful) {
            _$resourceful = $resourceful;
            _setOnce = $resourceful.setOnce;
            _dataKey = $resourceful.dataKey;
            _run = $resourceful.run;
        }));

        afterEach(inject(function ($resource) {
            $resource.reset();
        }));

        it('should be defined', function () {
            expect(_$resourceful).toBeDefined();
        });

        it('should be a function', function () {
            expect(_$resourceful).toEqual(any.fn);
        });

        describe('when calling $resource', function () {
            testValues.forEach(function (testValue) {
                it('should pass the same first parameter (' + testValue + ')', inject(function ($resource) {
                    _$resourceful(testValue);
                    expect($resource).toHaveBeenCalledWith(testValue, undefined, any.obj);
                }));

                it('should pass the same second parameter (' + testValue + ')', inject(function ($resource) {
                    _$resourceful('', testValue);
                    expect($resource).toHaveBeenCalledWith('', testValue, any.obj);
                }));
            });

            it('should pass the object as a third parameter', inject(function ($resource) {
                _$resourceful();
                expect($resource).toHaveBeenCalledWith(undefined, undefined, any.obj);
            }));

            it('should pass additional methods set in a third parameter', inject(function ($resource) {
                var additionalMethods = {
                    anAdditionalMethod: {
                        method: 'GET',
                        isArray: false
                    }
                };

                _$resourceful('', {}, additionalMethods);
                expect($resource.mostRecentCall.args[2].anAdditionalMethod).toEqual(additionalMethods.anAdditionalMethod);
            }));

            it('should set set .temp and .once properties to false when .once is set', inject(function ($resourcefulDataKey) {
                $resourcefulDataKey.once = true;
                $resourcefulDataKey.temp = 'test';
                _$resourceful();

                expect($resourcefulDataKey.once).toBe(false);
                expect($resourcefulDataKey.temp).toBe(false);
            }));

            it('should overwrite a method which was set before', inject(function ($resource, $resourcefulDefaultActions) {
                $resourcefulDefaultActions.testMethod = {
                    method: 'GET'
                };

                _$resourceful('', {}, {
                    testMethod: {
                        method: 'PUT'
                    }
                });

                expect($resource.mostRecentCall.args[2].testMethod).not.toEqual($resourcefulDefaultActions.testMethod);
                expect($resource.mostRecentCall.args[2].testMethod).toEqual({method: 'PUT'});
            }));
        });

        describe('setOnce', function () {
            it('should be defined', function () {
                expect(_setOnce).toBeDefined();
            });

            it('should be a function', function () {
                expect(_setOnce).toEqual(any.fn);
            });

            it('should set $resourcefulDataKey.once property to true', inject(function ($resourcefulDataKey) {
                $resourcefulDataKey.once = null;
                _$resourceful.setOnce();
                expect($resourcefulDataKey.once).toBe(true);
            }));

            it('should return $resourceful', function () {
                expect(_$resourceful.setOnce()).toEqual(_$resourceful);
            });
        });


        describe('dataKey', function () {
            var wrong = [true, false, null, undefined, [], {}, ['something'], {foo: 'bar'}, 123545, Infinity, -Infinity, -3.5, ''];
            var right = ['a string', 'ąśźćśół', '123', 'true', 'false', 'null', '0', 'Infinity', '[]', '{[]}'];

            it('should be defined', function () {
                expect(_dataKey).toBeDefined();
            });

            it('should be a function', function () {
                expect(_dataKey).toEqual(any.fn);
            });

            right.forEach(function (rightVal) {
                it('should set $resourcefulDataKey value with argument: ' + rightVal, inject(function ($resourcefulDataKey) {
                    _$resourceful.dataKey(rightVal);
                    expect($resourcefulDataKey.temp).toEqual(rightVal);
                }));
            })

            wrong.forEach(function (wrongVal) {
                it('should call $log.warn with argument: ' + wrongVal, inject(function ($log) {
                    spyOn($log, 'warn');
                    _$resourceful.dataKey(wrongVal);
                    expect($log.warn).toHaveBeenCalled();
                }));
            })

        });


        describe('run', function () {
            it('should be defined', function () {
                expect(_run).toBeDefined();
            });

            it('should be a function', function () {
                expect(_run).toEqual(any.fn);
            });

            it('should return the same result as $resourceful', function () {
                expect(_$resourceful.run()).toEqualData(_$resourceful());
            });
        });

    });

});
