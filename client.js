var webdriverio = require('webdriverio');
var customCommands = function (driver) {

    driver.addCommand("waitForContent", function(selector, text, ms, cb) {
        var callback = arguments[arguments.length - 1];
        var timedOut = false;
        var timeOut = setTimeout(() => {
            throw new Error('content "' + text + '" not found in selector "' + selector + '"');
            timedOut = true;
            callback(null, false);
        }, ms);

        var search = () => {
            if (timedOut) {
                return;
            }

            this.pause(200)
                .getText(selector, (err, result) => {
                    if (timedOut) {
                        return;
                    }

                    if (err) {
                        clearTimeout(timeOut)
                        return callback(err);
                    }

                    var exists = result.some((string) => string.indexOf(text) !== -1);

                    if (exists) {
                        clearTimeout(timeOut);
                        return callback(null, true);
                    } else {
                        return search();
                    }
                });
        };
        search();


        //var browser = this;
        //var search = function () {
        //    if (timedOut) {
        //        return;
        //    }
        //    browser
        //        .pause(250)
        //        .getText(selector, function (err, result) {
        //            console.log('------', result);
        //            if (err) {
        //                console.error(err);
        //                callback(err, null);
        //            }
        //            if (result && result.indexOf(text) !== -1) {
        //                clearTimeout(timeOut);
        //                callback(null, true);
        //            } else {
        //                search();
        //            }
        //        });
        //};
        //search();
    });
};

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
