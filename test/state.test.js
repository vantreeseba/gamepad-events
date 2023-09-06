import { resetMocks } from './mocks.js';
import { GamePadManager } from '../index.js';

const Gamepad = GamePadManager;

import { beforeEach, describe, expect, test } from 'vitest';

describe('gamepad state', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('gamepad detection', () => {
    test('should handle gamepad connecting after update', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      gp.update();

      expect(gp.states[0]).toBeTruthy();
      expect(gp.states[1]).toBeFalsy();

      global.navigator.connectGamepad();

      gp.update();

      expect(gp.states[0]).toBeTruthy();
      expect(gp.states[1]).toBeTruthy();
    });
  });

  describe('isDown', () => {
    test('should return true when gamepad button state is down is down', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      gp.update();
      pad.buttons[0].value = 1;
      gp.update();
      var isDown = gp.isDown('ps4_x');

      expect(isDown).toBeTruthy();
    });

    test('should return false when gamepad button state is up', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.buttons[0].value = 0;
      gp.update();
      var isDown = gp.isDown('ps4_x');

      expect(isDown).toBeFalsy();
    });

    test('should return false when button mapping does not exist', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.buttons[0].value = 1;
      gp.update();
      var isDown = gp.isDown('bananaphone_x');

      expect(isDown).toBeFalsy();
    });

    test('should return true when player exists and gamepad state is down', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      gp.update();
      pad.buttons[0].value = 1;
      gp.update();
      var isDown = gp.isDown('ps4_x', 0);

      expect(isDown).toBeTruthy();
    });

    test('should return false when player exists and gamepad state is up', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.buttons[0].value = 1;
      gp.update();
      pad.buttons[0].value = 0;
      gp.update();
      var isDown = gp.isDown('ps4_x', 0);

      expect(isDown).toBeFalsy();
    });

    test.only('should return false when player does not exist', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.buttons[0].value = 1;
      gp.update();
      var isDown = gp.isDown('ps4_x', 2);

      expect(isDown).toBeFalsy();
    });

    test('should return true when gamepad axis state is down', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      gp.update();
      pad.axes[0] = 0.5;
      gp.update();
      var isDown = gp.isDown('left_stick_x');

      expect(isDown).toBeTruthy();
    });

    test('should return false when gamepad axis state is up', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 1;
      gp.update();
      pad.axes[0] = 0;
      gp.update();
      var isDown = gp.isDown('left_stick_x');

      expect(isDown).toBeFalsy();
    });

    test('should return true when player does exist and gamepad axis state is down', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 1;
      gp.update();
      var isDown = gp.isDown('left_stick_x', 0);

      expect(isDown).toBeTruthy();
    });

    test('should return false when player does exist and gamepad axis state is up', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 0;
      gp.update();
      var isDown = gp.isDown('left_stick_x', 0);

      expect(isDown).toBeFalsy();
    });

    test('should return false when player does not exist', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 0;
      gp.update();
      var isDown = gp.isDown('left_stick_x', 2);

      expect(isDown).toBeFalsy();
    });
  });
  describe('getStick', () => {
    test('should return current state of stick', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];

      pad.axes[0] = 1;
      gp.update();
      var xy = gp.getStick('left_stick');

      expect(xy.x).toEqual(1);
      expect(xy.y).toEqual(0);
    });
  });
});
