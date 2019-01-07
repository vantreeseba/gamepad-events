const assert = require('chai').assert;
const {resetMocks} = require('./mocks.js');

const Gamepad = require('../index.js');

module.exports = {
  'Gamepad': {
    'beforeEach' : () => {
      resetMocks();
    },
    'should construct': () => {
      var gp = new Gamepad();

      assert.isOk(gp);
    },
    'when gamepad button state is down is down should return true': () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      gp.update();
      pad.buttons[0].value = 1;
      gp.update();
      var isDown = gp.isDown('ps4_x');

      assert.isOk(isDown);
    },
    'when gamepad button state is up isDown should return false': () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.buttons[0].value = 0;
      gp.update();
      var isDown = gp.isDown('ps4_x');

      assert.isNotOk(isDown);
    },
    'when gamepad axis state is down is down should return true': () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      gp.update();
      pad.axes[0] = 0.5;
      gp.update();
      var isDown = gp.isDown('left_stick_x');

      assert.isOk(isDown);
    },
    'when gamepad axis state is up isDown should return false': () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 0;
      gp.update();
      var isDown = gp.isDown('left_stick_x');

      assert.isNotOk(isDown);
    },

  }
};
