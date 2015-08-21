module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai-jquery', 'jquery-2.1.0', 'chai', 'sinon-chai', 'fixture'],
    files: [
      'public/javascripts/vendor/d3.v3.min.js',
      'public/javascripts/vendor/handlebars-v3.0.3.js',
      'public/javascripts/helper/templateHelper.js',
      'public/javascripts/landing-pages.js',
      'public/javascripts/search.js',
      'public/javascripts/traffic.js',
      'tests/**/*Spec.js',
      'tests/fixtures/**/*'
    ],
    exclude: [
      '**/*.swp'
    ],
    preprocessors: {
      'public/javascripts/*.js': ['coverage'],
      'public/javascripts/helper/*.js': ['coverage'],
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
