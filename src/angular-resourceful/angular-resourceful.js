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
