const test = require('node:test');
const assert = require('node:assert/strict');

class FakeHTMLElement {
    constructor(attributes = {}) {
        this.attributes = attributes;
        this.events = [];
        this.children = {};
    }

    hasAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name);
    }

    getAttribute(name) {
        return this.attributes[name] ?? null;
    }

    querySelector(selector) {
        return this.children[selector] ?? null;
    }

    dispatchEvent(event) {
        this.events.push(event.type);
    }
}

global.HTMLElement = FakeHTMLElement;
global.CustomEvent = class CustomEvent {
    constructor(type, options) {
        this.type = type;
        this.detail = options.detail;
        this.bubbles = options.bubbles;
    }
};
global.document = {
    addEventListener() {},
    querySelectorAll() {
        return [];
    }
};

const SWE = require('../dist/swe.js');

test('expired countdown ends once without starting an interval', () => {
    const element = new FakeHTMLElement({
        'data-swe-countdown-end': '2000-01-01T00:00:00Z'
    });
    let endCount = 0;
    let intervalCount = 0;
    const originalSetInterval = global.setInterval;

    global.setInterval = () => {
        intervalCount += 1;
        return 1;
    };

    try {
        const timer = new SWE(element, {
            onEnd() {
                endCount += 1;
            }
        });

        assert.equal(timer.intervalId, null);
        assert.equal(intervalCount, 0);
        assert.equal(endCount, 1);
        assert.equal(element.events.filter(event => event === 'swe:end').length, 1);
    } finally {
        global.setInterval = originalSetInterval;
    }
});

test('zero-duration countdown ends without starting an interval', () => {
    const element = new FakeHTMLElement({
        'data-swe-countdown-duration': '0'
    });
    let intervalCount = 0;
    const originalSetInterval = global.setInterval;

    global.setInterval = () => {
        intervalCount += 1;
        return 1;
    };

    try {
        const timer = new SWE(element);

        assert.equal(timer.intervalId, null);
        assert.equal(intervalCount, 0);
        assert.equal(element.events.filter(event => event === 'swe:end').length, 1);
    } finally {
        global.setInterval = originalSetInterval;
    }
});
