var ElementProxy = require('./element-proxy');

class Page {
    constructor({ client } = {}) {
        this.client = client;
        if (this.initialize) {
            this.initialize();
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
