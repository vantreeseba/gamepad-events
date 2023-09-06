import { resetMocks } from './mocks.js';
import { GamePadManager } from '../index.js';

const Gamepad = GamePadManager;

import { beforeEach, describe, expect, test } from 'vitest';

describe('GamePadManager', () => {
  test('should construct', () => {
    var gp = new Gamepad();
    expect(gp).not.toBeNull();
  });

  beforeEach(() => {
    resetMocks();
  });

  describe('down', () => {
    test('should emit an event when gamepad button state changes.', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.addEventListener('down', () => (fired = true));
      gp.update();
      pad.buttons[0].value = 1;
      gp.update();

      expect(fired).toBeTruthy();
    });

    test('should not emit an event when gamepad button state changes when event is off.', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;
      const cb = () => (fired = true);

      gp.addEventListener('down', cb);
      gp.removeEventListener('down', cb);
      gp.update();
      pad.buttons[0].value = 1;
      gp.update();

      expect(fired).toBeFalsy();
    });

    test('should emit an a mapped event when gamepad button state changes.', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.addEventListener('down:r2', () => (fired = true));
      gp.update();
      pad.buttons[7].value = 1;
      gp.update();

      expect(fired).toBeTruthy();
    });

    test('should not emit a mapped event when gamepad button state changes when listener removed.', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      const cb = () => (fired = true);

      gp.addEventListener('down:r2', cb);
      gp.removeEventListener('down:r2', cb);
      gp.update();
      pad.buttons[7].value = 1;
      gp.update();

      expect(fired).toBeFalsy();
    });

    test('should emit more specific event when button state changes', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired1 = false;
      var fired2 = false;

      gp.addEventListener('down:button_0', () => (fired1 = true));
      gp.addEventListener('down:button_1', () => (fired2 = true));
      gp.update();
      pad.buttons[0].value = 1;
      gp.update();

      expect(fired1).toBeTruthy();
      expect(fired2).toBeFalsy();
    });

    test('should emit an event when axis state changes', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.addEventListener('down', () => (fired = true));
      gp.update();
      pad.axes[0] = 1;
      gp.update();

      expect(fired).toBeTruthy();
    });
    test('should emit a more specific event when axis state changes', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.addEventListener('down:axis_0', () => (fired = true));
      gp.update();
      pad.axes[0] = 1;
      gp.update();

      expect(fired).toBeTruthy();
    });
    test('should not emit a more specific event when axis state changes and event is off', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;
      const cb = () => (fired = true);
      gp.addEventListener('down:axis_0', cb);
      gp.removeEventListener('down:axis_0', cb);
      gp.update();
      pad.axes[0] = 1;
      gp.update();

      expect(fired).toBeFalsy();
    });

    //     test('should not emit any events when all listeners are removed', () => {
    //       var gp = new Gamepad();
    //       var pad = global.navigator.getGamepads()[0];
    //       var fired1 = false;
    //       var fired2 = false;
    //
    //       gp.addEventListener('down:axis_0', () => (fired1 = true));
    //       gp.addEventListener('down:axis_0', () => (fired2 = true));
    //       //       gp.removeAllListeners('down:axis_0');
    //       gp.removeEventListener('down:axis_0');
    //
    //       gp.update();
    //       pad.axes[0] = 1;
    //       gp.update();
    //
    //       expect(fired1).toBeFalsy();
    //       expect(fired2).toBeFalsy();
    //     });

    test('should emit event only once when set as once', () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var firedCount = 0;

      gp.addEventListener('down:axis_0', () => firedCount++);
      gp.update();
      pad.axes[0] = 1;
      gp.update();
      pad.axes[0] = 1;
      gp.update();
      pad.axes[0] = 1;
      gp.update();

      expect(firedCount).toEqual(1);
    });
  });
  describe('hold', () => {
    test('should be fired when button is held', async () => {
      var gp = new Gamepad();
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.addEventListener('hold', () => (fired = true));

      const interval = setInterval(() => {
        pad.buttons[0].value = 1;
        gp.update();
      }, 10);

      await new Promise((resolve) => {
        setTimeout(() => {
          clearInterval(interval);
          expect(fired).toBeTruthy();
          resolve(null);
        }, 200);
      });
    }),
      test('should be fired when axis is held', async () => {
        var gp = new Gamepad();
        var pad = global.navigator.getGamepads()[0];
        var fired = false;

        gp.addEventListener('hold', () => (fired = true));

        const interval = setInterval(() => {
          pad.axes[0] = 1;
          gp.update();
        }, 10);

        await new Promise((resolve) => {
          setTimeout(() => {
            clearInterval(interval);
            expect(fired).toBeTruthy();
            resolve();
          }, 200);
        });
      });
  });

  describe('repeat', () => {
    test('should be fired when button is held', async () => {
      var gp = new Gamepad({ repeatThreshold: 10 });
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.addEventListener('repeat', () => (fired = true));

      const interval = setInterval(() => {
        pad.buttons[0].value = 1;
        gp.update();
      }, 10);

      await new Promise((resolve) => {
        setTimeout(() => {
          clearInterval(interval);
          expect(fired).toBeTruthy();
          resolve();
        }, 100);
      });
    });

    test('should be fired when axis is held', async () => {
      var gp = new Gamepad({ repeatThreshold: 10 });
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.addEventListener('repeat', () => (fired = true));

      const interval = setInterval(() => {
        pad.axes[0] = 1;
        gp.update();
      }, 10);

      await new Promise((resolve) => {
        setTimeout(() => {
          clearInterval(interval);
          expect(fired).toBeTruthy();
          resolve();
        }, 100);
      });
    });
  });

  describe('longpress', () => {
    test('should be fired when button is held', async () => {
      var gp = new Gamepad({ longpressThreshold: 10 });
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.addEventListener('longpress', () => (fired = true));

      const interval = setInterval(() => {
        pad.buttons[0].value = 1;
        gp.update();
      }, 1);

      await new Promise((resolve) => {
        setTimeout(() => {
          clearInterval(interval);
          expect(fired).toBeTruthy();
          resolve();
        }, 50);
      });
    });
    test('should be fired when axis is held', async () => {
      var gp = new Gamepad({ longpressThreshold: 10 });
      var pad = global.navigator.getGamepads()[0];
      var fired = false;

      gp.addEventListener('longpress', () => (fired = true));

      const interval = setInterval(() => {
        pad.axes[0] = 1;
        gp.update();
      }, 1);

      await new Promise((resolve) => {
        setTimeout(() => {
          clearInterval(interval);
          expect(fired).toBeTruthy();
          resolve();
        }, 50);
      });
    });
  });
});
