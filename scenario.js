class Scenario {
    constructor({ title, cb } = {}) {
        this.title = title;
        this.cb = cb;
    }

    _run() {
        return Promise.resolve()
                .then(this.cb.bind(this))
                .then(() => {
                    console.log('PASS', this.title);
                })
                .catch((err) => {
                    console.error('FAIL', this.title);
                    throw err;
                });
    }
}

module.exports = Scenario;
