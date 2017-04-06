// Generated on 2014-11-11 using generator-angular-fullstack 2.0.13
'use strict';
var path = require('path');
var PlantMigrateJob = require('./migrate/plantmigrator.job');
var MarkerMigrateJob = require('./migrate/markermigrator.job');

module.exports = function (grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  }

  var currentdir = path.resolve();

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    protractor: 'grunt-protractor-runner',
    injector: 'grunt-asset-injector',
    buildcontrol: 'grunt-build-control',
    'string-replace': 'grunt-string-replace',
    mocha_istanbul: 'grunt-mocha-istanbul',
    selenium_start: 'grunt-selenium-webdriver',
    selenium_stop: 'grunt-selenium-webdriver',
    html2js: 'grunt-html2js'


  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    yeoman: {
      // configurable paths
      client: require('./bower.json').appPath || 'client',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      },
      migrate: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/server/app.js'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      },
      coverage_client: {
        url: 'file:///' + currentdir + '/coverage/client/index.html'
      },
      coverage_server: {
        url: 'file:///' + currentdir + '/coverage/lcov-report/index.html'
      }
    },
    watch: {
      injectJS: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.js',
          '!<%= yeoman.client %>/{app,components}/**/*.spec.js',
          '!<%= yeoman.client %>/{app,components}/**/*.mock.js',
          '!<%= yeoman.client %>/app/app.js'],
        tasks: ['injector:scripts']
      },
      injectCss: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.css'
        ],
        tasks: ['injector:css']
      },
      mochaTest: {
        files: ['server/**/*.spec.js'],
        tasks: ['env:unittest', 'mochaTest']
      },
      jsTest: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.spec.js',
          '<%= yeoman.client %>/{app,components}/**/*.mock.js'
        ],
        tasks: ['newer:jshint:all', 'karma']
      },
      injectSass: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.{scss,sass}'],
        tasks: ['injector:sass']
      },
      sass: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.{scss,sass}'],
        tasks: ['sass', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.css',
          '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.html',
          '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.js',
          '!{.tmp,<%= yeoman.client %>}{app,components}/**/*.spec.js',
          '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.mock.js',
          '<%= yeoman.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '<%= yeoman.client %>/.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: 'server/.jshintrc'
        },
        src: [
          'server/**/*.js',
          '!server/**/*.spec.js'
        ]
      },
      serverTest: {
        options: {
          jshintrc: 'server/.jshintrc-spec'
        },
        src: ['server/**/*.spec.js']
      },
      all: [
        '<%= yeoman.client %>/{app,components}/**/*.js',
        '!<%= yeoman.client %>/{app,components}/**/*.spec.js',
        '!<%= yeoman.client %>/{app,components}/**/*.mock.js'
      ],
      test: {
        src: [
          '<%= yeoman.client %>/{app,components}/**/*.spec.js',
          '<%= yeoman.client %>/{app,components}/**/*.mock.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*',
              '!<%= yeoman.dist %>/.openshift',
              '!<%= yeoman.dist %>/Procfile'
            ]
          }
        ]
      },
      build: {
        src: 'build/'
      },
      dist_dev: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              'dist_dev/*',
              '!dist_dev/.git*',
              '!dist_dev/.openshift',
              '!dist_dev/Procfile'
            ]
          }
        ]
      },
      dist_dev2: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              'dist_dev2/*',
              '!dist_dev2/.git*',
              '!dist_dev2/.openshift',
              '!dist_dev2/Procfile'
            ]
          }
        ]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/',
            src: '{,*/}*.css',
            dest: '.tmp/'
          }
        ]
      }
    },

    // Debugging with node inspector
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: 'server/app.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: '<%= yeoman.client %>/index.html',
        ignorePath: '<%= yeoman.client %>/',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/public/{,*/}*.js',
            '<%= yeoman.dist %>/public/{,*/}*.css',
            '<%= yeoman.dist %>/public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/public/assets/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.client %>/index.html'],
      options: {
        dest: '<%= yeoman.dist %>/public'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/public/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/public/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/public/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>/public',
          '<%= yeoman.dist %>/public/assets/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.client %>/assets/images',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: '<%= yeoman.dist %>/public/assets/images'
          }
        ]
      }
    },

    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.client %>/assets/images',
            src: '{,*/}*.svg',
            dest: '<%= yeoman.dist %>/public/assets/images'
          }
        ]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/concat',
            src: '*/**.js',
            dest: '.tmp/concat'
          }
        ]
      }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        module: 'wildfoodApp',
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        usemin: 'app/app.js'
      },
      main: {
        cwd: '<%= yeoman.client %>',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/templates.js'
      },
      tmp: {
        cwd: '.tmp',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/tmp-templates.js'
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/public/*.html']
      },
      dist_dev: {
        html: ['dist_dev/public/*.html']
      },
      dist_dev2: {
        html: ['dist_dev2/public/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.client %>',
            dest: '<%= yeoman.dist %>/public',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'bower_components/**/*',
              'assets/images/**/*',
              'assets/fonts/**/*'
              //,
              //'index.html'
            ]
          },
          {
            expand: true,
            cwd: '.tmp/concat/app',
            dest: 'dist/public/app',
            src: ['app.css', 'app.js', 'vendor.css', 'vendor.js']

          },
          {
            expand: true,
            cwd: '.tmp',
            dest: 'dist/public/app',
            src: ['templates.js']

          },
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.client %>',
            dest: '<%= yeoman.dist %>/public/',
            src: 'index_prod.html',
            rename: function (dest, src) {
              return dest + 'index.html';
            }
          },
          //{
          //  expand: true,
          //  cwd: '.tmp/images',
          //  dest: '<%= yeoman.dist %>/public/assets/images',
          //  src: ['generated/*']
          //},
          {
            expand: true,
            dest: '<%= yeoman.dist %>',
            src: [
              'package.json',
              'server/**/*'
            ]
          }
        ]
      },
      dist_dev: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.client %>',
            dest: 'dist_dev/public',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'bower_components/**/*',
              'app/**/*',
              'components/**/*',
              'assets/images/**/*',
              'assets/fonts/**/*',
              'index.html'
            ]
          },
          {
            expand: true,
            cwd: '.tmp/app',
            dest: 'dist_dev/public/app',
            src: ['app.css']

          },
          {
            expand: true,
            dest: 'dist_dev',
            src: [
              'package.json',
              'server/**/*'
            ]
          }
        ]
      },
      dist_dev2: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.client %>',
            dest: 'dist_dev2/public',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'bower_components/**/*',
              'app/**/*',
              'components/**/*',
              'assets/images/**/*',
              'assets/fonts/**/*',
              'index.html'
            ]
          },
          {
            expand: true,
            cwd: '.tmp/app',
            dest: 'dist_dev2/public/app',
            src: ['app.css']

          },
          {
            expand: true,
            dest: 'dist_dev2',
            src: [
              'package.json',
              'server/**/*'
            ]
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.client %>',
        dest: '.tmp/',
        src: ['{app,components}/**/*.css']
      },
      build: {
        files: [
          {expand: true, cwd: 'app/', src: [
            '**',
            '!js/**',
            '!scss/**',
            '!css/**',
            '!dev/**'],
            dest: 'build/app'}
        ]
      },
      components: {
        files: [
          {expand: true, cwd: 'client/app', src: ['*.html'], dest: 'build/components'},
        ]
      }
    },
    'string-replace': {
      dist_dev2: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.client %>',
            dest: 'dist_dev2/public',
            src: ['app/footer/footer.html']
          }
        ],
        options: {
          replacements: [
            {
              pattern: /{{ VERSION }}/g,
              replacement: '<%= pkg.version %> Test'
            }
          ]
        }
      },
      dist_dev: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.client %>',
            dest: 'dist_dev/public',
            src: ['app/footer/footer.html']
          }
        ],
        options: {
          replacements: [
            {
              pattern: /{{ VERSION }}/g,
              replacement: '<%= pkg.version %> Alpha'
            }
          ]
        }
      }
    },

    buildcontrol: {
      options: {
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      dist: {
        options: {
          dir: 'dist',
          remote: 'heroku',
          branch: 'master'
        }
      },
      dist_dev: {
        options: {
          dir: 'dist_dev',
          remote: 'heroku',
          branch: 'master'
        }
      },
      dist_dev2: {
        options: {
          dir: 'dist_dev2',
          remote: 'heroku',
          branch: 'master'
        }
      },
      openshift: {
        options: {
          remote: 'openshift',
          branch: 'master'
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass'
      ],
      test: [
        'sass'
      ],
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        'sass',
        'imagemin',
        'svgmin'
      ],
      dist_dev: [
        'sass'
      ],
      dist_dev2: [
        'sass'
      ]
    },
    concat: {
      css: {
        src: ['build/*.css'],
        dest: 'build/do-and-charge.css'
      },
      appjs: {
        src: [
          'client/app/**/*.js',
          'client/components/**/*.js',
          '!client/app/**/*Spec.js',
          'build/templates.js'
        ],
        dest: 'build/app.js'
      }
    },
    html2js: {
      appjs: {
        options: {
          base: 'client/'
        },
        src: ['client/app/**/*.html','client/components/**/*.html'],
        dest: '.tmp/templates.js'
      }
    },
    // Test settings
    karma: {
      build: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS'],
        preprocessors: {
          '**/*.html': 'html2js'
        }
      },

      unit: {
        configFile: 'karma.conf.js',
        browsers: ['PhantomJS'],
        autoWatch: false,
        singleRun: true,
        preprocessors: {
          '**/*.html': 'html2js'
        }
      },

      debug: {
        browsers: ['Chrome'],
        configFile: 'karma.conf.js',
        autoWatch: true,
        singleRun: false,
        preprocessors: {
          '**/*.html': 'html2js'
        }
      },
      coverage: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
        ,
        preprocessors: {
          '**/*.html': 'html2js',
          'client/app/**/!(*Spec).js': ['coverage'],
          'client/components/**/!(*Spec).js': ['coverage']
        }
      }
    },


    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['server/**/*.spec.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          // use the quiet flag to suppress the mocha console output
          quiet: true,
          // specify a destination file to capture the mocha
          // output (the quiet option does not suppress this)
          captureFile: 'coverage/coverage.html'
        },
        src: ['server/**/*.spec.js']
      }

    },
    mocha_istanbul: {
      coverage: {
        src: 'server',
        options: {
          mask: '**/*.spec.js'
        }
      }
    },
    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
          check: {
            lines: 80,
            statements: 80
          }
        }
      }
    },

    protractor: {
      options: {
        configFile: 'e2e/protractor.e2e.conf.js',
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false // If true, protractor will not use colors in its output.
      },
      chrome: {
        options: {
          args: {
            browser: 'chrome'
          }
        }
      },
      cucumber: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
        options: {
          configFile: "e2e/protractor.cucumber.conf.js", // Target-specific config file
          args: {} // Target-specific arguments
        }
      },
      e2e: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
        options: {
          configFile: 'e2e/protractor.e2e.conf.js',
          args: {} // Target-specific arguments
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      unittest: {
        NODE_ENV: 'unittest'
      }
      ,
      migrate: {
        NODE_ENV: 'migrate'
      },
      all: localConfig
    },

    // Compiles Sass to CSS
    sass: {
      server: {
        options: {
          loadPath: [
            '<%= yeoman.client %>/bower_components',
            '<%= yeoman.client %>/app',
            '<%= yeoman.client %>/components'
          ],
          compass: false
        },
        files: {
          '.tmp/app/app.css': '<%= yeoman.client %>/app/app.scss'
        }
      }
    },

    injector: {
      options: {},
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
            ['{.tmp,<%= yeoman.client %>}/{app,components}/**/*.js',
              '!{.tmp,<%= yeoman.client %>}/app/app.js',
              '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.spec.js',
              '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.mock.js']
          ]
        }
      },

      // Inject component scss into app.scss
      sass: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/client/app/', '');
            filePath = filePath.replace('/client/components/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%= yeoman.client %>/app/app.scss': [
            '<%= yeoman.client %>/{app,components}/**/*.{scss,sass}',
            '!<%= yeoman.client %>/app/app.{scss,sass}'
          ]
        }
      },

      // Inject component css into index.html
      css: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
            '<%= yeoman.client %>/{app,components}/**/*.css'
          ]
        }
      }
    }
  });


  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'env:all',
        'env:prod', 'express:prod', 'wait', 'open:server',
        'express-keepalive',   'watch']);
    }

    if (target === 'test') {
      return grunt.task.run(['build', 'env:all',
        'env:prod', 'express:prod', 'wait', 'open:server',
     'watch']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'injector:sass',
        'concurrent:server',
        'injector',
        'wiredep',
        'autoprefixer',
        'concurrent:debug'
      ]);
    } else if (target === 'migrate') {
      return grunt.task.run([
        'clean:server',
        'env:migrate',
        'injector:sass',
        'sass',
        'injector',
        'wiredep',
        'autoprefixer',
        'express:migrate',
        'wait',
        'open:server',
        'watch'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'env:all',
      'injector:sass',
      //'concurrent:server',
      'sass',
      'injector',
      'wiredep',
      'autoprefixer',
      'express:dev',
      'wait',
      'open:server',
      'watch'
    ]);
  });


  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('callmigrateplants', function (target) {
    var done = this.async();
    PlantMigrateJob.run();
    setTimeout(function () {
      // Fail asynchronously.
      done(true);
    }, 20000);
  });
  grunt.registerTask('callmigratemarkers', function (target) {
    var done = this.async();
    MarkerMigrateJob.run();
    setTimeout(function () {
      // Fail asynchronously.
      done(true);
    }, 20000);
  });

  grunt.registerTask('migrate', function (target) {

    if (target === 'plants') {
      return grunt.task.run([
        'clean:server',
        'env:migrate',
        'express:migrate',
        'wait',
        'callmigrateplants'
      ]);
    }

    else if (target === 'markers') {
      return grunt.task.run([
        'clean:server',
        'env:migrate',
        'express:dev',
        'wait',
        'callmigratemarkers'
      ]);
    } else grunt.task.run([
      'migrate:plants',
      'migrate:markers'
    ]);
  });


  grunt.registerTask('coverage', function (target) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
        'env:unittest',
        'mocha_istanbul',
        'wait',
        'open:coverage_server'
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'env:all',
        'env:unittest',
        'karma:unit',
        'wait',
        'open:coverage_client'
      ]);
    }
    else grunt.task.run([
        'coverage:server',
        'coverage:client'
      ]);
  });

  grunt.registerTask('test', function (target) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
        'env:unittest',
        'mochaTest'
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'injector:sass',
        'concurrent:test',
        'injector',
        'autoprefixer',
        'karma'
      ]);
    }

    else if (target === 'e2e') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'env:unittest',
        'injector:sass',
        'concurrent:test',
        'injector',
        'wiredep',
        'autoprefixer',
        'express:dev',
        'protractor'
      ]);
    }

    else grunt.task.run([
        'test:server',
        'test:client'
      ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'injector:sass',
    'concurrent:dist_dev2',
    'injector',
    'wiredep',
    'useminPrepare',

    'autoprefixer',
    //'ngtemplates',
    'html2js:appjs',
    'concat',
    //'ngAnnotate',
    'copy:dist'
    //,
    //'cdnify',
    //'cssmin',
    //'uglify'
    //'rev'
    //
    //, 'usemin'
  ]);

  grunt.registerTask('build_dev', function (target) {
    return grunt.task.run([
      'clean:' + target,
      'injector:sass',
      'concurrent:' + target,
      'injector',
      'wiredep',
      'autoprefixer',
      'copy:' + target,
      'string-replace:' + target
    ]);
  });


  grunt.registerTask('default', [
    //'newer:jshint',
    'test',
    'build'
  ]);


  grunt.registerTask('deploy', [
    'test:server',
    'build',
    'buildcontrol:dist'
  ]);

  grunt.registerTask('sallatest', [
    //'injector:sass',
    //'concurrent:dist_dev2',
    //'injector',
    //'wiredep',
    ////'useminPrepare',
    //'autoprefixer',
    //'ngtemplates',
    //'concat',
    ////'ngAnnotate',
    //'copy:dist'
    ////,
    ////'cdnify',
    ////'cssmin',
    ////'uglify'
    ////'rev'
    ////
    ////, 'usemin'
    'clean:build',
    'injector:sass',
    'concurrent:server',
    'wiredep',
    'concat:appjs'
    //'copy:components'
    //,
    //'html2js',
    //'concat',
    //'copy:build'
  ]);

  grunt.registerTask('builddeploy', function (target) {

    if (target === 'dist_dev2') {
      return grunt.task.run([
        //'test:server',
        'build_dev:' + target,
        'buildcontrol:' + target
      ]);
    } else {

      return grunt.task.run([
        //'test:server',
        'build:',
        'buildcontrol:dist'
      ]);
    }
  });


};
