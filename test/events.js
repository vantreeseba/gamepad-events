const assert = require('chai').assert;
const {resetMocks} = require('./mocks.js');

const Gamepad = require('../index.js');

module.exports = {
  'Gamepad': {
    'beforeEach': () => {
      resetMocks();
    },
    'should construct': () => {
      var gp = new Gamepad();

      assert.isOk(gp);
    },
    down: {
      'should emit an event when gamepad button state changes.': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.on('down', () => fired = true, this);
        gp.update();
        pad.buttons[0].value = 1;
        gp.update();

        assert.isTrue(fired);
      },
      'should emit more specific event when button state changes': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired1 = false;
        var fired2 = false;

        gp.on('down:button_0', () => fired1 = true, this);
        gp.on('down:button_1', () => fired2 = true, this);
        gp.update();
        pad.buttons[0].value = 1;
        gp.update();

        assert.isTrue(fired1);
        assert.isFalse(fired2);
      },
      'should emit an event when axis state changes': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.on('down', () => fired = true, this);
        gp.update();
        pad.axes[0] = 1;
        gp.update();

        assert.isTrue(fired);
      },
      'should emit a more specific event when axis state changes': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.on('down:axis_0', () => fired = true, this);
        gp.update();
        pad.axes[0] = 1;
        gp.update();

        assert.isTrue(fired);
      },
    },
    hold: {
      'should be fired when button is held': (done) => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.on('hold', () => fired = true, this);

        const interval = setInterval(() => {
          pad.buttons[0].value = 1;
          gp.update();
        }, 10);

        setTimeout(() => {
          clearInterval(interval);
          assert.isTrue(fired);
          done();
        }, 200);
      },
      'should be fired when axis is held': (done) => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.on('hold', () => fired = true, this);

        const interval = setInterval(() => {
          pad.axes[0] = 1;
          gp.update();
        }, 10);

        setTimeout(() => {
          clearInterval(interval);
          assert.isTrue(fired);
          done();
        }, 200);
      }
    },
    repeat: {
      'should be fired when button is held': (done) => {
        var gp = new Gamepad({repeatThreshold: 50});
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.on('repeat', () => fired = true, this);

        const interval = setInterval(() => {
          pad.buttons[0].value = 1;
          gp.update();
        }, 10);

        setTimeout(() => {
          clearInterval(interval);
          assert.isTrue(fired);
          done();
        }, 100);
      },
      'should be fired when axis is held': (done) => {
        var gp = new Gamepad({repeatThreshold: 50});
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.on('repeat', () => fired = true, this);

        const interval = setInterval(() => {
          pad.axes[0] = 1;
          gp.update();
        }, 10);

        setTimeout(() => {
          clearInterval(interval);
          assert.isTrue(fired);
          done();
        }, 100);
      }
    },
    longpress: {
      'should be fired when button is held': (done) => {
        var gp = new Gamepad({longpressThreshold: 10});
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.on('longpress', () => fired = true, this);

        const interval = setInterval(() => {
          pad.buttons[0].value = 1;
          gp.update();
        }, 10);

        setTimeout(() => {
          clearInterval(interval);
          assert.isTrue(fired);
          done();
        }, 50);
      },
      'should be fired when axis is held': (done) => {
        var gp = new Gamepad({longpressThreshold: 10});
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.on('longpress', () => fired = true, this);

        const interval = setInterval(() => {
          pad.axes[0] = 1;
          gp.update();
        }, 10);

        setTimeout(() => {
          clearInterval(interval);
          assert.isTrue(fired);
          done();
        }, 50);
      }
    }
  }
};
