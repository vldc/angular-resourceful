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
