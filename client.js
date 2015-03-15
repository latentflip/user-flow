var webdriverio = require('webdriverio');
var customCommands = require('./custom-commands');

class Client {
    constructor(options) {
        options = options || {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        };

        this.driver = webdriverio.remote(options)
                                 .init();
        customCommands(this.driver);
    }

    initPage(name, Page) {
        this[name] = new Page({ client: this });
        return this;
    }
    
    waitFor(selector, ms) {
        var error = new Error('Could not find element "' + selector + '" within ' + ms + 'ms');

        return new Promise((resolve, reject) => {
            this.driver.waitFor(selector, ms, function (err) {
                if (err) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    pause(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    }

    callDriver(method, ...args) {
        return new Promise((resolve, reject) => {
            args.push((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });

            this.driver[method](...args);
        });
    }
}

[
    'click',
    'close',
    'url',
    'saveScreenshot',
    'element',
    'elementActive',
    'moveToObject',
    'getHTML',
    'setValue',
    'waitForContent'
].forEach(function (method) {
    Client.prototype[method] = function () {
        return this.callDriver(method, ...arguments);
    };
});



module.exports = Client;
