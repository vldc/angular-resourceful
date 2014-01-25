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
