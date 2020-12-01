module.exports = function(grunt) {

    "use strict";

    var watching = grunt.option('watching');
    var tasks, time = new Date(), day = time.getDate(), month = time.getMonth()+1, year = time.getFullYear(), hour = time.getHours(), mins = time.getMinutes(), sec = time.getSeconds();
    var timestamp = (day < 10 ? "0"+day:day) + "/" + (month < 10 ? "0"+month:month) + "/" + (year) + " " + (hour<10?"0"+hour:hour) + ":" + (mins<10?"0"+mins:mins) + ":" + (sec<10?"0"+sec:sec);

    var source_files = [
        'src/index.js'
    ];

    require('load-grunt-tasks')(grunt);

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
            global: {
                options: {
                    banner: "<%= copyright %>\n",
                    stripBanners: true,
                    separator: "\n\n",
                    process: function(src, filePath){
                        return '// Source: ' + filePath + '\n\n' + src;
                    }
                },
                src: source_files,
                dest: 'build/datetime.js'
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
            global: {
                src: 'build/datetime.js',
                dest: 'build/datetime.min.js'
            }
        },

        replace: {
            build: {
                options: {
                    patterns: [
                        {
                            match: 'VERSION',
                            replacement: "<%= pkg.version %>"
                        },
                        {
                            match: 'STATUS',
                            replacement: "<%= pkg.status %>"
                        },
                        {
                            match: 'TIME',
                            replacement: timestamp
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['build/*.js'], dest: 'build/'
                    }
                ]
            }
        },

        watch: {
            scripts: {
                files: ['src/*.js', 'Gruntfile.js'],
                tasks: ['clean', 'eslint',  'concat', 'uglify', 'replace'],
                options: {
                    spawn: false,
                    reload: true
                }
            }
        }
    });

    tasks = ['clean', 'eslint', 'concat', 'uglify', 'replace'];

    if (watching) {
        tasks.push('watch');
    }

    grunt.registerTask('default', tasks);
};