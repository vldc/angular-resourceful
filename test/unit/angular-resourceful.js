'use strict';

describe('resourceful module', function () {
    var any = {
        fn: jasmine.any(Function),
        obj: jasmine.any(Object),
        str: jasmine.any(String)
    };

    var itShouldBe = {
        defined: function (item) {
            return it('should be defined', function () {
                expect(item).toBeDefined();
            });
        },
        aFunction: function (item) {
            return it('should be a function', function () {
                expect(item).toEqual(any.fn);
            })
        }
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
            toEqualData: function(expect) {
                return angular.equals(expect, this.actual);
            }
        });
    });


    describe('$RESOURCEFUL_DATA_KEY constant', function () {
        var _$RESOURCEFUL_DATA_KEY;

        beforeEach(inject(function ($RESOURCEFUL_DATA_KEY) {
            _$RESOURCEFUL_DATA_KEY = $RESOURCEFUL_DATA_KEY;
        }));

        itShouldBe.defined.bind(this, _$RESOURCEFUL_DATA_KEY);

        it('should be a string', function () {
            expect(_$RESOURCEFUL_DATA_KEY).toEqual(any.str);
        })
    });


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

        itShouldBe.defined.bind(this, _$resourceful);
        itShouldBe.aFunction.bind(this, _$resourceful);

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
        });

        describe('setOnce', function () {
            itShouldBe.defined.bind(this, _setOnce);
            itShouldBe.aFunction.bind(this, _setOnce);

            it('should set _once property to true', function () {
                _$resourceful.setOnce();
                expect(_$resourceful._once).toBe(true);
            });

            it('should return $resourceful', function () {
                expect(_$resourceful.setOnce()).toEqual(_$resourceful);
            })
        });


        describe('dataKey', function () {
            var wrong = [true, false, null, undefined, [], {}, ['something'], {foo: 'bar'}, 123545, Infinity, -Infinity, -3.5, ''];
            var right = ['a string', 'ąśźćśół', '123', 'true', 'false', 'null', '0', 'Infinity', '[]', '{[]}'];
            itShouldBe.defined.bind(this, _dataKey);
            itShouldBe.aFunction.bind(this, _dataKey);

            right.forEach(function (rightVal) {
                it('should set _dataKey property with argument: ' + rightVal, function () {
                    _$resourceful.dataKey(rightVal);
                    expect(_$resourceful._dataKey).toEqual(rightVal);
                });
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
            itShouldBe.defined.bind(this, _run);
            itShouldBe.aFunction.bind(this, _run);

            it('should return the same result as $resourceful', function () {
                expect(_$resourceful.run()).toEqualData(_$resourceful());
            })
        });

    });

});
