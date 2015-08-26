module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai-jquery', 'jquery-1.11.0', 'sinon-chai', 'chai', 'fixture'],
    files: [
      'public/javascripts/vendor/xhr.min.js',
      'public/javascripts/vendor/time.min.js',
      'public/javascripts/vendor/timeFormat.min.js',
      'public/javascripts/vendor/raphael-min.js',
      'public/javascripts/vendor/morris.min.js',
      'public/javascripts/helpers/helper.js',
      'public/javascripts/traffic.js',
      'tests/**/*Spec.js',
      'tests/fixtures/**/*'
    ],
    exclude: [
      '**/*.swp'
    ],
    preprocessors: {
      'public/javascripts/*.js': ['coverage'],
      'tests/**/*.json'   : ['json_fixtures']
    },
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },
    reporters: ['progress', 'coverage', 'coveralls'],
    coverageReporter: {
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'lcov-report' },
      ],
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
