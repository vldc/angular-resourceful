(function () {

    'use strict';

    // Modules
    angular.module('resourceful',
        [
            'ngResource'
        ])
        .value('$resourcefulDataKey', {
            def: 'wrap',
            temp: false,
            val: '',
            once: true
        });
    angular.module('resourceful')
        .service('$resourcefulDefaultActions', [
            '$resourcefulDataKey',
            function ($resourcefulDataKey) {
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
                            transformed[$resourcefulDataKey.val] = !!data ? angular.fromJson(data) : [];
                            return transformed;
                        }
                    },

                    update: {
                        method: 'PUT',
                        isArray: true,
                        transformRequest: function (data) {
                            return angular.toJson(data[$resourcefulDataKey.val]);
                        },
                        transformResponse: angular.noop
                    },

                    saveArray: {
                        method: 'POST',
                        isArray: true
                    }
                };
            }
        ]);
    angular.module('resourceful')

        .factory('$resourceful', [
            '$resource',
            '$log',
            '$resourcefulDefaultActions',
            '$resourcefulDataKey',
            function ($resource, $log, $resourcefulDefaultActions, $resourcefulDataKey) {
                var $resourceful = function (url, paramDefaults, actions) {
                    actions = actions || {};
                    var defaultActions = angular.copy($resourcefulDefaultActions);
                    var finalActions = angular.extend(defaultActions, actions);
                    $resourcefulDataKey.val = $resourcefulDataKey.temp || $resourcefulDataKey.def;
                    $resourcefulDataKey.once && ($resourcefulDataKey.temp = $resourcefulDataKey.once = false);

                    return $resource(url, paramDefaults, finalActions);
                };

                angular.extend($resourceful, {

                    setOnce: function () {
                        $resourcefulDataKey.once = true;
                        return this;
                    },

                    dataKey: function (keyName) {
                        if (angular.isString(keyName) && keyName.length) {
                            $resourcefulDataKey.temp = keyName;
                        } else {
                            $log.warn('angular-resource: wrong keyName provided for dataKey');
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

})();