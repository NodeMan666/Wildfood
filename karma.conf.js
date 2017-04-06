// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)

    // list of files / patterns to load in the browser
    files: [
        'client/bower_components/jquery/dist/jquery.js',
        'client/bower_components/angular/angular.js',
        'client/bower_components/angular-mocks/angular-mocks.js',
        'client/bower_components/angular-resource/angular-resource.js',
        'client/bower_components/angular-cookies/angular-cookies.js',
        'client/bower_components/angular-sanitize/angular-sanitize.js',
        'client/bower_components/angular-route/angular-route.js',
        'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'client/bower_components/lodash/dist/lodash.compat.js',
        'client/bower_components/angular-socket-io/socket.js',
        'client/bower_components/angular-ui-autocomplete/autocomplete.js',
        'client/bower_components/android-toast/dist/android_toast.min.js',
        'client/bower_components/ngDraggable/ngDraggable.js',
        'client/bower_components/angular-xeditable/dist/js/xeditable.js',
        'client/bower_components/moment/moment.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/ng-file-upload/angular-file-upload.js',
      'client/bower_components/ng-file-upload-shim/angular-file-upload-shim.js',
      'client/bower_components/hello/dist/hello.all.min.js',
      'client/bower_components/nsPopover/src/nsPopover.js',

      'client/app/app.js',
      'client/app/app.coffee',
      'client/app/**/*.js',
      'client/app/**/*.coffee',
      'client/components/**/*.js',
      'client/components/**/*.coffee',
      'client/app/**/*.jade',
      'client/components/**/*.jade',
      'client/app/**/*.html',
      'client/components/**/*.html'
    ],

    preprocessors: {
      '**/*.jade': 'ng-jade2js',
      '**/*.html': 'html2js',
      '**/*.coffee': 'coffee',
      'client/app/**/!(*Spec).js': ['coverage'],
      'client/components/**/!(*Spec).js': ['coverage']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    ngJade2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    frameworks: ['mocha', 'chai'],


    // enable / disable watching file and executing tests whenever any file changes
    //autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
   // browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
   // singleRun: false
      reporters: ['dots','junit','coverage'],
      coverageReporter: {
          type: 'html',
          dir: 'coverage/client/',
          subdir: '.'
      },

      junitReporter : {
          outputFile: 'coverage/client/unit.xml',
          suite: ''
      }
  });
};
