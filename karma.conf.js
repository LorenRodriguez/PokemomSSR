const { executablePath } = require('puppeteer');
process.env.CHROME_BIN = executablePath();

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    browsers: ['ChromeHeadless'],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: false,
    restartOnFileChange: true
  });
};
