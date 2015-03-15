module.exports = function (driver) {

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
                    let exists;

                    if (timedOut) {
                        return;
                    }

                    if (err) {
                        clearTimeout(timeOut)
                        return callback(err);
                    }

                    if (Array.isArray(result)) {
                        exists = result.some((string) => string.indexOf(text) !== -1);
                    } else {
                        exists = result.indexOf(text) !== -1;
                    }

                    if (exists) {
                        clearTimeout(timeOut);
                        return callback(null, true);
                    } else {
                        return search();
                    }
                });
        };
        search();
    });
};
