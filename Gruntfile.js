module.exports = function(grunt) {

    "use strict";

    var watching = grunt.option('watching');
    var develop = grunt.option('develop');
    var tasks, time = new Date(), day = time.getDate(), month = time.getMonth()+1, year = time.getFullYear(), hour = time.getHours(), mins = time.getMinutes(), sec = time.getSeconds();
    var timestamp = (day < 10 ? "0"+day:day) + "/" + (month < 10 ? "0"+month:month) + "/" + (year) + " " + (hour<10?"0"+hour:hour) + ":" + (mins<10?"0"+mins:mins) + ":" + (sec<10?"0"+sec:sec);

    var source_files = [
        'src/index.js',
        'src/i18n/*js',
        'src/plugins/*js'
    ];

    require('load-grunt-tasks')(grunt);

    tasks = ['clean', 'eslint', 'copy', 'concat', 'uglify'];

    if (!develop) {
        tasks.push('removelogging');
        tasks.push('remove_comments');
    }

    if (watching) {
        tasks.push('watch');
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copyright: '/*!\n' +
            ' * Datetime v<%= pkg.version %>, (<%= pkg.repository.url %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> by <%= pkg.author.name %> (<%= pkg.author.url %>)\n' +
            ' * <%= pkg.description %>\n' +
            ' * Build at ' +(timestamp)+ '\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' !*/\n\n',

        clean: {
            lib: ['lib']
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
                dest: 'lib/datetime.js'
            },
            all: {
                src: source_files,
                dest: 'lib/datetime.all.js'
            }
        },

        removelogging: {
            dist: {
                src: "lib/**/*.js",

                options: {
                    methods: ["log"]
                }
            }
        },

        uglify: {
            options: {
                comments: false,
                sourceMap: false,
                preserveComments: true,
                compress: true,
                mangle: {
                    reserved: ['Datetime', 'datetime', 'DATETIME_LOCALES']
                }
            },
            main: {
                src: 'lib/datetime.js',
                dest: 'lib/datetime.min.js'
            },
            all: {
                src: 'lib/datetime.all.js',
                dest: 'lib/datetime.all.min.js'
            },
            plugins: {
                files: [{
                    expand: true,
                    cwd: 'lib/plugins',
                    src: '**/*.js',
                    dest: 'lib/plugins',
                    rename: function (dst, src) {
                        return dst + '/' + src.replace('.js', '.min.js');
                    }
                }]
            },
            i18n: {
                files: [{
                    expand: true,
                    cwd: 'lib/i18n',
                    src: '**/*.js',
                    dest: 'lib/i18n',
                    rename: function (dst, src) {
                        return dst + '/' + src.replace('.js', '.min.js');
                    }
                }]
            }
        },

        copy: {
            i18n: {
                expand: true,
                cwd: 'src/i18n',
                src: '**/*',
                dest: 'lib/i18n'
            },
            plugins: {
                expand: true,
                cwd: 'src/plugins',
                src: '**/*',
                dest: 'lib/plugins'
            }
        },

        remove_comments: {
            options: {
                keepSpecialComments: true,
                linein: false
            },
            lib: {
                src: 'lib/**/*.js'
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*.js', 'Gruntfile.js'],
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