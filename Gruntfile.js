'use strict';
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: ['dist']
        },
        copy: {
            // I dunno...feels good to back up concat but not yet minified files :)
            preUglifyBackup: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'dist/',
                    dest: 'dist/backup/',
                    src: [
                        '*',
                        'css/**',
                        'js/**',
                    ],
                    filter: 'isFile'
                }]
            }
        },
        concat: {
            options: {
                //string to put between concatenated files
                //can be necessary when processing minified js code
                separator: ';'
            },
            vendor: {
                src: [  'js/vendor/jquery.1.10.2.js',
                        'js/vendor/scrollto.js',
                        'js/vendor/underscore.1.5.1.js',
                        'js/vendor/backbone.1.0.0.js',
                        'js/vendor/jszip.js',
                        'js/vendor/jszip-load.js',
                        'js/vendor/jszip-inflate.js',
                        'js/vendor/jszip-deflate.js'],
                dest: 'dist/js/vendor/all.js'
            },
            app: {
                src: [  'js/buttons.js',
                        'js/app/setup.js',
                        'ja/app/zip.js',
                        'js/app/model.js',
                        'js/app/view-options-menu.js',
                        'js/app/view-showcase.js',
                        'js/app/app.js',
                        'js/main.js'],
                dest: 'dist/js/app/all.js'
            },
            css: {
                src: [  'css/font-awesome.min.css',
                        'css/main.css',
                        'css/buttons.css'],
                dest: 'dist/css/all.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            app: {
                src: 'dist/js/app/all.js',
                dest: 'dist/js/app/all.min.js'
            },
            vendor: {
                src: 'dist/js/vendor/all.js',
                dest: 'dist/js/vendor/all.min.js'
            }
            // TODO: css minfication throwing errors ... work out later
            // ,css: {
            //     src: 'dist/css/all.css',
            //     dest: 'dist/css/all.min.css'
            // }
        },
        useminPrepare: {
            html: ['index.dev.html'],
            options: {
                dest: ['dest']
            }
        },
        usemin: {
            html: ['**/*.html'],
            css: ['**/*.css']
        }
    });
    grunt.loadNpmTasks('grunt-usemin');
    [
        // 'grunt-contrib-jshint',
        // 'grunt-contrib-watch',
        'grunt-contrib-clean',
        'grunt-contrib-copy',
        'grunt-contrib-concat',
        'grunt-contrib-uglify',
        'grunt-contrib-cssmin',
        'grunt-usemin'
    ].forEach(function(task) { grunt.loadNpmTasks(task); });
    // grunt.registerTask('prod', ['useminPrepare', 'usemin']);

    grunt.registerTask('prod', [
        'clean:dist',
        // 'compass:dist',
        // 'useminPrepare',
        // 'imagemin',
        // 'htmlmin',
        'concat',
        // 'cssmin',
        // 'copy:preUglifyBackup',//move a copy of concat but NOT minified to dist/backup
        'uglify',
        // 'copy',
        // 'usemin'
    ]);



};
