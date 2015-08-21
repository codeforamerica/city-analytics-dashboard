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
      platform: 'Windows 8.1',
      version: '11'
    }
  };
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai-jquery', 'jquery-2.1.0', 'chai', 'sinon-chai', 'fixture'],
    files: [
      'public/javascripts/vendor/d3.v3.min.js',
      'public/javascripts/traffic.js',
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
    captureTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
  });
};
