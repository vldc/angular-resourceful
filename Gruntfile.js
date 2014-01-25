'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        library: grunt.file.readJSON('bower.json'),
        concat: {
            options: {
                separator: ''
            },
            library: {
                src: [
                    'src/<%= library.name %>/<%= library.name %>.prefix',
                    'src/<%= library.name %>/<%= library.name %>.js',
                    'src/<%= library.name %>/directives/**/*.js',
                    'src/<%= library.name %>/filters/**/*.js',
                    'src/<%= library.name %>/services/**/*.js',
                    'src/<%= library.name %>/<%= library.name %>.suffix'
                ],
                dest: 'dist/<%= library.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            jid: {
                files: {
                    'dist/<%= library.name %>.min.js': ['<%= concat.library.dest %>']
                }
            }
        },
        jshint: {
            beforeConcat: {
                src: ['gruntfile.js', '<%= library.name %>/**/*.js']
            },
            afterConcat: {
                src: [
                    '<%= concat.library.dest %>'
                ]
            },
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                    angular: true,
                    window: true
                },
                camelcase: true,
                curly: true,
                expr: true,
                eqeqeq: false,
                globalstrict: true,
                immed: true,
                indent: 4,
                latedef: true,
                maxdepth: 2,
                maxstatements: 12,
                maxcomplexity: 5,
                noarg: true,
                noempty: true,
                nonew: true,
                quotmark: true,
                strict: true,
                trailing: true,
                undef: true,
                unused: true,
                white: true
            }
        },

        watch: {
            options: {
                livereload: true
            },
            files: [
                'Gruntfile.js',
                'src/**/*'
            ],
            tasks: ['default']
        },

        karma: {
            'unit': {
                configFile: 'karma-unit.conf.js',
                singleRun: true,
                autoWatch: false
            },
            'unitTravis': {
                configFile: 'karma-unit.conf.js',
                singleRun: true,
                autoWatch: false,
                browsers: ['PhantomJS', 'Firefox']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', [
        'karma:unit'
    ]);

    grunt.registerTask('travis-test', [
        'jshint:afterConcat',
        'karma:unitTravis'
    ]);

    grunt.registerTask('default', ['jshint:beforeConcat', 'concat', 'jshint:afterConcat', 'uglify', 'test']);
    grunt.registerTask('livereload', ['default', 'watch']);

};