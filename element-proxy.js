
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

    waitFor(ms) {
        return this.client.waitFor(this.selector, ms);
    }

    click() {
        return this.client.click(this.selector);
    }

    getRaw() {
        return this.client.element(this.selector);
    }

    getHTML() {
        return this.client.getHTML(this.selector);
    }

    setValue(value) {
        return this.client.setValue(this.selector, value);
    }

    waitForContent(text, ms) {
        return this.client.waitForContent(this.selector, text, ms);
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
}

module.exports = {
    Single: ElementProxy,
    Multiple: ElementProxy
};
