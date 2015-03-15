
var getWebElementId = function (resp) {
    if (Array.isArray(resp.values)) {
        return resp.value.map((v) => v.ELEMENT);
    } else {
        return resp.value.ELEMENT;
    }
};

class ElementProxy {
    constructor({ client, selector } = {}) {
        this.client = client;
        this.selector = selector;
    }

    getRaw() {
        return this.client.element(this.selector);
    }

    isFocused() {
        return Promise.all([
            this.getRaw(),
            this.client.elementActive()
        ]).then(([currentElement, activeElement] = []) => {
            return getWebElementId(currentElement) === getWebElementId(activeElement);
        });
    }

    hover(x=0, y=0) {
        return this.client.moveToObject(this.selector, x, y);
    }

    hasClass(match) {
        return this.getAttribute('class')
                    .then((attr) => {
                        return attr.split(' ').indexOf(match) !== -1;
                    });
    }
}

class ElementsProxy extends ElementProxy {
    elements() {
        return this.client.elements(this.selector);
    }

    count() {
        return this.elements()
                    .then((resp) => resp.value.length);
    }
}

[
    'waitFor',
    'waitForContent',
    'getHTML',
    'click',
    'addValue',
    'setValue',
    'getAttribute',
    'moveToObject'
].forEach((method) => {
    ElementProxy.prototype[method] = function (...args) {
        return this.client[method](this.selector, ...args);
    };
});


[
    'elements',
].forEach((method) => {
    ElementsProxy.prototype[method] = function (...args) {
        return this.client[method](this.selector, ...args);
    };
});

module.exports = {
    Single: ElementProxy,
    Multiple: ElementsProxy
};
