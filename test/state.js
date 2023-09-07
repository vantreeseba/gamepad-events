import { beforeEach, describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { resetMocks } from './mocks.js';
import { GamePadManager } from '../index.js';

const Gamepad = GamePadManager;

describe('gamepad state', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('gamepad detection', () => {
    test('should handle gamepad connecting after update', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      gp.update();

      assert(gp.states[0]);
      assert.equal(!!gp.states[1], false);

      global.navigator.connectGamepad();

      gp.update();

      assert(gp.states[0]);
      assert(gp.states[1]);
    });
  });

  describe('isDown', () => {
    test('should return true when gamepad button state is 1', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      gp.update();
      pad.buttons[0].value = 1;
      gp.update();
      let isDown = gp.isDown('ps4_x');

      assert(isDown);
    });

    test('should return false when gamepad button state is up', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      pad.buttons[0].value = 0;
      gp.update();
      let isDown = gp.isDown('ps4_x');

      assert(isDown == false);
    });

    test('should return false when button mapping does not exist', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      pad.buttons[0].value = 1;
      gp.update();
      let isDown = gp.isDown('bananaphone_x');

      assert(isDown == false);
    });

    test('should return true when player exists and gamepad state is down', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      gp.update();
      pad.buttons[0].value = 1;
      gp.update();
      let isDown = gp.isDown('ps4_x', 0);

      assert(isDown);
    });

    test('should return false when player exists and gamepad state is up', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      pad.buttons[0].value = 1;
      gp.update();
      pad.buttons[0].value = 0;
      gp.update();
      let isDown = gp.isDown('ps4_x', 0);

      assert(isDown == false);
    });

    test('should return false when player does not exist', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      pad.buttons[0].value = 1;
      gp.update();
      let isDown = gp.isDown('ps4_x', 2);

      assert(isDown == false);
    });

    test('should return true when gamepad axis state is down', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      gp.update();
      pad.axes[0] = 0.5;
      gp.update();
      let isDown = gp.isDown('left_stick_x');

      assert(isDown);
    });

    test('should return false when gamepad axis state is up', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 1;
      gp.update();
      pad.axes[0] = 0;
      gp.update();
      let isDown = gp.isDown('left_stick_x');

      assert(isDown == false);
    });

    test('should return true when player does exist and gamepad axis state is down', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 1;
      gp.update();
      let isDown = gp.isDown('left_stick_x', 0);

      assert(isDown);
    });

    test('should return false when player does exist and gamepad axis state is up', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 0;
      gp.update();
      let isDown = gp.isDown('left_stick_x', 0);

      assert(isDown == false);
    });

    test('should return false when player does not exist', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 0;
      gp.update();
      let isDown = gp.isDown('left_stick_x', 2);

      assert(isDown == false);
    });
  });
  describe('getStick', () => {
    test('should return current state of stick', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 1;
      gp.update();
      let xy = gp.value('left_stick');

      assert.equal(xy.x, 1);
      assert.equal(xy.y, 0);
    });
  });
});
