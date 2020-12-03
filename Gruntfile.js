module.exports = function(grunt) {

    "use strict";

    var watching = grunt.option('watching');
    var develop = grunt.option('develop');
    var tasks, time = new Date(), day = time.getDate(), month = time.getMonth()+1, year = time.getFullYear(), hour = time.getHours(), mins = time.getMinutes(), sec = time.getSeconds();
    var timestamp = (day < 10 ? "0"+day:day) + "/" + (month < 10 ? "0"+month:month) + "/" + (year) + " " + (hour<10?"0"+hour:hour) + ":" + (mins<10?"0"+mins:mins) + ":" + (sec<10?"0"+sec:sec);

    var source_files = [
        'src/index.js',
        'src/i18n/*js'
    ];

    require('load-grunt-tasks')(grunt);

    tasks = ['clean', 'eslint', 'concat', 'uglify', 'copy'];

    if (!develop) {
        tasks.push('removelogging');
    }

    if (watching) {
        tasks.push('watch');
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copyright: '/*\n' +
            ' * Datetime v<%= pkg.version %>, (<%= pkg.repository.url %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> by <%= pkg.author.name %>\n' +
            ' * <%= pkg.description %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n\n',

        clean: {
            build: ['build']
        },

        eslint: {
            target: ['src/**/*.js']
        },

        concat: {
            options: {
                banner: "<%= copyright %>\n",
                stripBanners: true,
                separator: "\n\n",
                process: function(src, filePath){
                    return '// Source: ' + filePath + '\n\n' + src;
                }
            },
            main: {
                src: ['src/index.js'],
                dest: 'build/datetime.js'
            },
            all: {
                src: source_files,
                dest: 'build/datetime.all.js'
            }
        },

        removelogging: {
            dist: {
                src: "build/**/*.js",

                options: {
                    methods: ["log"]
                }
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                preserveComments: true,
                compress: true
            },
            main: {
                src: 'build/datetime.js',
                dest: 'build/datetime.min.js'
            },
            all: {
                src: 'build/datetime.all.js',
                dest: 'build/datetime.all.min.js'
            }
        },

        copy: {
            fonts: {
                expand: true,
                cwd: 'src/i18n',
                src: '**/*',
                dest: 'build/i18n'
            }
        },

        watch: {
            scripts: {
                files: ['src/*.js', 'Gruntfile.js'],
                tasks: tasks,
                options: {
                    spawn: false,
                    reload: true
                }
            }
        }
    });

    grunt.registerTask('default', tasks);
};