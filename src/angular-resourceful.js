angular.module('resourceful', ['ngResource'])

    .value('$resourcefulDataKey', {
        def: 'wrap',
        val: false,
        once: true
    })

    .factory('$resourcefulDefaultActions', [
        '$resourcefulDataKey',
        function ($resourcefulDataKey) {

            return function () {
                var dataKey = $resourcefulDataKey.val || $resourcefulDataKey.def;
                $resourcefulDataKey.once && ($resourcefulDataKey.val = $resourcefulDataKey.once = false);

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
                };
            };
        }
    ])

    .factory('$resourceful', [
        '$resource',
        '$log',
        '$resourcefulDefaultActions',
        '$resourcefulDataKey',
        function ($resource, $log, $resourcefulDefaultActions, $resourcefulDataKey) {
            var $resourceful = function (url, paramDefaults, actions) {
                actions = actions || {};

                var finalActions = angular.extend($resourcefulDefaultActions(), actions);

                return $resource(url, paramDefaults, finalActions);
            };

            angular.extend($resourceful, {

                setOnce: function () {
                    $resourcefulDataKey.once = true;
                    return this;
                },

                dataKey: function (keyName) {
                    if (angular.isString(keyName) && keyName.length) {
                        $resourcefulDataKey.val = keyName;
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