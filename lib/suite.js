var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var Scenario = require('./scenario');

var callSequentially = function (arr) {
    return arr.reduce(function (p, cb) {
        return p.then(cb);
    }, Promise.resolve());
};

class Suite {
    constructor(name) {
        this.name = name;
        this._beforeEach = [];
        this._scenarios = [];
        this._onFail = [];
        this._onEnsure = [];
        this._onSuccess = [];
    }

    beforeEach(cb) {
        this._beforeEach.push(cb);
        return this;
    }

    onSuccess(cb) {
        this._onSuccess.push(cb);
        return this;
    }

    onFail(cb) {
        this._onFail.push(cb);
        return this;
    }

    ensure(cb) {
        this._onEnsure.push(cb);
        return this;
    }

    scenario(title, cb) {
        this._scenarios.push(new Scenario({ title, cb }));
        return this;
    }

    _run() {
        return this._scenarios.reduce((p, scenario) => {
            return p.then(() => this._runCallbacks('_beforeEach'))
                    .then(() => scenario._run());
        }, Promise.resolve());
    }

    _runCallbacks(name) {
        return callSequentially(this[name]);
    }
}

module.exports = function suite(name, cb) {
    var suite = new Suite(name);
    cb(suite);
    suite._run()
            .then(() => {
                console.log('Success, all pass!');
                return suite._runCallbacks('_onSuccess');
            })
            .catch((err) => {
                console.error(err.message);
                console.log(err.stack);
                return suite._runCallbacks('_onFail')
            })
            .then(() => suite._runCallbacks('_onEnsure'));
};
