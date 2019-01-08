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
    isDown: {
      'should return true when gamepad button state is down is down': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        gp.update();
        pad.buttons[0].value = 1;
        gp.update();
        var isDown = gp.isDown('ps4_x');

        assert.isOk(isDown);
      },
      'should return false when gamepad button state is up': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        pad.buttons[0].value = 0;
        gp.update();
        var isDown = gp.isDown('ps4_x');

        assert.isNotOk(isDown);
      },
      'should return false when button mapping does not exist': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        pad.buttons[0].value = 1;
        gp.update();
        var isDown = gp.isDown('bananaphone_x');

        assert.isNotOk(isDown);
      },
      'should return true when player exists and gamepad state is down': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        gp.update();
        pad.buttons[0].value = 1;
        gp.update();
        var isDown = gp.isDown('ps4_x', 0);

        assert.isOk(isDown);
      },
      'should return false when player exists and gamepad state is up': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        pad.buttons[0].value = 1;
        gp.update();
        pad.buttons[0].value = 0;
        gp.update();
        var isDown = gp.isDown('ps4_x', 0);

        assert.isNotOk(isDown);
      },
      'should return false when player does not exist': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        pad.buttons[0].value = 1;
        gp.update();
        var isDown = gp.isDown('ps4_x', 2);

        assert.isNotOk(isDown);
      },
      'should return true when gamepad axis state is down': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        gp.update();
        pad.axes[0] = 0.5;
        gp.update();
        var isDown = gp.isDown('left_stick_x');

        assert.isOk(isDown);
      },
      'should return false when gamepad axis state is up': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        pad.axes[0] = 1;
        gp.update();
        pad.axes[0] = 0;
        gp.update();
        var isDown = gp.isDown('left_stick_x');

        assert.isNotOk(isDown);
      },
      'should return true when player does exist and gamepad axis state is down': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        pad.axes[0] = 1;
        gp.update();
        var isDown = gp.isDown('left_stick_x', 0);

        assert.isOk(isDown);
      },
      'should return false when player does exist and gamepad axis state is up': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        pad.axes[0] = 0;
        gp.update();
        var isDown = gp.isDown('left_stick_x', 0);

        assert.isNotOk(isDown);
      },
      'should return false when player does not exist': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        pad.axes[0] = 0;
        gp.update();
        var isDown = gp.isDown('left_stick_x', 2);

        assert.isNotOk(isDown);
      }
    },
    getStick: {
      'should return current state of stick': () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];

        pad.axes[0] = 1;
        gp.update();
        var xy = gp.getStick('left_stick');

        assert.equal(xy.x, 1);
        assert.equal(xy.y, 0);
      }
    }
  }
};
