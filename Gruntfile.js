/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    // Project settings
    devtools: {
      // configurable paths
      app: 'app',
      dist: 'dist'
    },
    
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    
    // Task configuration.
    watch: {
      html: {
        files: ['<%= devtools.app %>/panel/{,*/}*.html'],
        tasks: ['copy:html']
      },
      css: {
        files: ['<%= devtools.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      js: {
        files: [ 'Gruntfile.js', '<%= devtools.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all', 'copy:js']
      }
    },
 
    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
        options: {
            includePaths: [
                'bower_components'
            ]
        },
        dist: {
            files: [{
                expand: true,
                cwd: '<%= devtools.app %>/styles',
                src: ['*.scss'],
                dest: '.tmp/styles',
                ext: '.css'
            }]
        },
        server: {
            files: [{
                expand: true,
                cwd: '<%= devtools.app %>/styles',
                src: ['*.scss'],
                dest: '.tmp/styles',
                ext: '.css'
            }]
        }
    },

    // Add CSS vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '<%= devtools.dist %>/styles/'
        }]
      }
    },
    
    // The produce minified CSS in the dist folder
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= devtools.dist %>/styles/',
          src: ['*.css', '!*.min.css'],
          dest: '<%= devtools.dist %>/styles/'
        }]
      }
    },
    
    // Detect errors & potential problems in JS files
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc',
      },
      all: [ 'Gruntfile.js', '<%= devtools.app %>/scripts/{,*/}*.js' ]
    },

    // Copies remaining files
    copy: {
      html: {
        expand: true,
        cwd: '<%= devtools.app %>/panel',
        dest: '<%= devtools.dist %>/panel',
        src: '{,*/}*.html'
      },
      js: {
        expand: true,
        cwd: '<%= devtools.app %>/scripts',
        dest: '<%= devtools.dist %>/scripts',
        src: '{,*/}*.js'
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [ '.tmp', '<%= devtools.dist %>/{,*/}*.*' ]
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: ['sass:server'],
      dist: ['sass:dist']
    }
  });

  grunt.registerTask('serve', [
    'clean',
    'concurrent:server',
    'autoprefixer',
    'copy',
    'watch'
  ]);

  grunt.registerTask('test', [
    'newer:jshint'
  ]);

  // Default task.
  grunt.registerTask('default', [
    'newer:jshint',
    'clean',
    'concurrent:dist',
    'autoprefixer',
    'cssmin',
    'copy'
  ]);
};
