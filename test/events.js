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
      'should not emit an event when gamepad button state changes when event is off.': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired = false;
        const cb =  () => fired = true;

        gp.on('down', cb, this);
        gp.off('down', cb, this);
        gp.update();
        pad.buttons[0].value = 1;
        gp.update();

        assert.isFalse(fired);
      },

      'should emit an a mapped event when gamepad button state changes.': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.on('down:r2', () => fired = true, this);
        gp.update();
        pad.buttons[7].value = 1;
        gp.update();

        assert.isTrue(fired);
      },
      'should not emit a mapped event when gamepad button state changes when listener removed.': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        const cb = () => fired = true;

        gp.on('down:r2', cb, this);
        gp.off('down:r2', cb, this);
        gp.update();
        pad.buttons[7].value = 1;
        gp.update();

        assert.isFalse(fired);
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
      'should not emit a more specific event when axis state changes and event is off': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired = false;
        const cb = () => fired = true;
        gp.on('down:axis_0', cb, this);
        gp.off('down:axis_0', cb, this);
        gp.update();
        pad.axes[0] = 1;
        gp.update();

        assert.isFalse(fired);
      },

      'should not emit any events when all listeners are removed': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired1 = false;
        var fired2 = false;


        gp.on('down:axis_0', () => fired1 = true, this);
        gp.on('down:axis_0', () => fired2 = true, this);
        gp.removeAllListeners('down:axis_0');

        gp.update();
        pad.axes[0] = 1;
        gp.update();

        assert.isFalse(fired1);
        assert.isFalse(fired2);
      },

      'should emit event only once when set as once': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var firedCount = 0;

        gp.once('down:axis_0', () => firedCount++, this);
        gp.update();
        pad.axes[0] = 1;
        gp.update();
        pad.axes[0] = 1;
        gp.update();
        pad.axes[0] = 1;
        gp.update();

        assert.equal(firedCount, 1);
      }

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
        var gp = new Gamepad({repeatThreshold: 10});
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
        var gp = new Gamepad({repeatThreshold: 10});
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
