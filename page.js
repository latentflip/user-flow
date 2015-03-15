var ElementProxy = require('./element-proxy');

class Page {
    constructor({ client } = {}) {
        this.client = client;
        if (this.initialize) {
            this.initialize();
        }
    }

    bindAll() {
        let keys = Object.getOwnPropertyNames(this.__proto__);
        var omit = [
            'constructor',
            'initialize'
        ];

        for (let idx in keys) {
            let key = keys[idx];
            if (typeof this[key] === 'function' && omit.indexOf(key) === -1) {
                this[key] = this[key].bind(this);
            }
        }
    }

    sequence() {
        return Promise.resolve();
    }

    query(selector) {
        return new ElementProxy.Single({
            client: this.client, 
            selector: selector
        });
    }

    queryAll(selector) {
        return new ElementProxy.Multiple({
            client: this.client, 
            selector: selector
        });
    }
}

module.exports = Page;
