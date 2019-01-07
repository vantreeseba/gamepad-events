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
    'when gamepad button state is change it should emit an event.': () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.on('down', () => fired = true, this);
      gp.update();
      pad.buttons[0].value = 1;
      gp.update();

      assert.isTrue(fired);
    },
    'when gamepad button state is change it should emit more specific events.': () => {
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
    'when gamepad axis state is changed it should emit an event.': () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.on('down', () => fired = true, this);
      gp.update();
      pad.axes[0] = 1;
      gp.update();

      assert.isTrue(fired);
    },
    'when gamepad axis state is changed it should emit a specific event.': () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.on('down:axis_0', () => fired = true, this);
      gp.update();
      pad.axes[0] = 1;
      gp.update();

      assert.isTrue(fired);
    },

  }
};
