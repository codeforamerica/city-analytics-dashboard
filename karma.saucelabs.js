module.exports = function(config) {
  var customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '35'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '30'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8',
      version: '10'
    },
    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '9'
    }
  };
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai-jquery', 'jquery-1.11.0', 'chai-changes', 'sinon-chai', 'chai', 'fixture'],
    files: [
      'public/javascripts/vendor/xhr.min.js',
      'public/javascripts/vendor/time.min.js',
      'public/javascripts/vendor/timeFormat.min.js',
      'public/javascripts/vendor/handlebars-v3.0.3.js',
      'public/javascripts/vendor/raphael-min.js',
      'public/javascripts/vendor/morris.min.js',
      'public/javascripts/helpers/helper.js',
      'public/javascripts/helpers/templateHelper.js',
      'public/javascripts/landing-pages.js',
      'public/javascripts/search.js',
      'public/javascripts/traffic.js',
      'public/javascripts/content.js',
      'public/javascripts/helper/dataHelper.js',
      'tests/**/*Spec.js',
      'tests/fixtures/**/*'
    ],
    exclude: [
      '**/*.swp'
    ],
    preprocessors: {
      'tests/**/*.json'   : ['json_fixtures']
    },
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },
    reporters: ['progress', 'saucelabs'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,
    sauceLabs: {
      testName: 'Web App Unit Tests',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      startConnect: true,
      recordVideo: true,
      recordScreenshots: true
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    browserDisconnectTimeout : 10000,
    browserDisconnectTolerance : 1,
    browserNoActivityTimeout : 4*60*1000,
    captureTimeout : 4*60*1000
  });
};
