angular.module('resourceful', ['ngResource'])

    .constant('$RESOURCEFUL_DATA_KEY', 'wrap')

    .factory('$resourceful', [
        '$resource',
        '$log',
        '$RESOURCEFUL_DATA_KEY',
        function ($resource, $log, $RESOURCEFUL_DATA_KEY) {
            var $resourceful = function (url, paramDefaults, actions) {
                actions = actions || {};
                var dataKey = $resourceful._dataKey || $RESOURCEFUL_DATA_KEY;
                var finalActions = angular.extend($resourceful.defaultActions(dataKey), actions);

                $resourceful._once && ($resourceful._dataKey = $resourceful._once = false);

                return $resource(url, paramDefaults, finalActions);
            };

            angular.extend($resourceful, {

                defaultActions: function (dataKey) {
                    return {
                        put: {
                            method: 'PUT'
                        },

                        putArray: {
                            method: 'PUT',
                            isArray: true
                        },

                        fetch: {
                            method: 'GET',
                            transformResponse: function (data) {
                                var transformed = {};

                                transformed[dataKey] = !!data ? angular.fromJson(data) : [];
                                return transformed;
                            }
                        },

                        update: {
                            method: 'PUT',
                            isArray: true,
                            transformRequest: function (data) {
                                return angular.toJson(data[dataKey]);
                            },
                            transformResponse: angular.noop
                        },

                        saveArray: {
                            method: 'POST',
                            isArray: true
                        }
                    }
                } ,

                setOnce: function () {
                    this._once = true;
                    return this;
                },

                dataKey: function (keyName) {
                    if (angular.isString(keyName) && keyName.length) {
                        this._dataKey = keyName;
                    } else {
                        $log.warn('angular-resource: wrong keyName provided for dataKey')
                    }
                    return this;
                },

                run: function () {
                    return this.apply(this, arguments);
                }
            });

            return $resourceful;
        }
    ]);