import { beforeEach, describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { resetMocks } from './mocks.js';
import { E_EVENT_TYPES, GamePadManager } from '../index.js';

const Gamepad = GamePadManager;

/**
 * @param {number} ms
 */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('GamePadManager', () => {
  test('should construct', () => {
    let gp = new Gamepad();
    assert(gp);
  });

  beforeEach(() => {
    resetMocks();
  });

  describe('down', () => {
    test('should emit an event when gamepad button state changes.', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];
      let fired = false;

      gp.addEventListener('down', () => (fired = true));
      gp.update();
      pad.buttons[0].value = 1;
      gp.update();

      assert(fired);
    });

    test('should not emit an event when gamepad button state changes when event is off.', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];
      let fired = false;
      const cb = () => {
        console.log('callback fired.');
        fired = true;
      };

      gp.addEventListener('down', cb);
      gp.removeEventListener('down', cb);
      gp.update();
      pad.buttons[0].value = 1;
      gp.update();

      assert(fired == false);
    });

    test('should emit an a mapped event when gamepad button state changes.', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];
      let fired = false;

      gp.addEventListener('down:r2', () => (fired = true));
      gp.update();
      pad.buttons[7].value = 1;
      gp.update();

      assert(fired);
    });

    test('should not emit a mapped event when gamepad button state changes when listener removed.', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];
      let fired = false;

      const cb = () => (fired = true);

      gp.addEventListener('down:r2', cb);
      gp.removeEventListener('down:r2', cb);
      gp.update();
      pad.buttons[7].value = 1;
      gp.update();

      assert(fired == false);
    });

    test('should emit more specific event when button state changes', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];
      let fired1 = false;
      let fired2 = false;

      gp.addEventListener('down:button_0', () => (fired1 = true));
      gp.addEventListener('down:button_1', () => (fired2 = true));
      gp.update();
      pad.buttons[0].value = 1;
      gp.update();

      assert(fired1);
      assert(fired2 == false);
    });

    test('should emit an event when axis state changes', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];
      let fired = false;

      gp.addEventListener('down', () => (fired = true));
      gp.update();
      pad.axes[0] = 1;
      gp.update();

      assert(fired);
    });
    test('should emit a more specific event when axis state changes', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];
      let fired = false;

      gp.addEventListener('down:axis_0', () => (fired = true));
      gp.update();
      pad.axes[0] = 1;
      gp.update();

      assert(fired);
    });
    test('should not emit a more specific event when axis state changes and event is off', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];
      let fired = false;
      const cb = () => (fired = true);
      gp.addEventListener('down:axis_0', cb);
      gp.removeEventListener('down:axis_0', cb);
      gp.update();
      pad.axes[0] = 1;
      gp.update();

      assert(fired == false);
    });

    //     test('should not emit any events when all listeners are removed', () => {
    //       let gp = new Gamepad();
    //       let pad = global.navigator.getGamepads()[0];
    //       let fired1 = false;
    //       let fired2 = false;
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
    //       assert(fired1 == false);
    //       assert(fired2 == false);
    //     });

    test('should emit event only once when set as once', () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];
      let firedCount = 0;

      gp.addEventListener('down:axis_0', () => firedCount++);
      gp.update();
      pad.axes[0] = 1;
      gp.update();
      pad.axes[0] = 1;
      gp.update();
      pad.axes[0] = 1;
      gp.update();

      assert.equal(firedCount, 1);
    });
  });
  describe('hold', () => {
    test('should be fired when button is held', async () => {
      let gp = new Gamepad();
      let pad = global.navigator.getGamepads()[0];
      let fired = false;

      gp.addEventListener('hold', () => (fired = true));

      const interval = setInterval(() => {
        pad.buttons[0].value = 1;
        gp.update();
      }, 10);
      await sleep(200);

      clearInterval(interval);
      assert(fired);
    }),
      test('should be fired when axis is held', async () => {
        let gp = new Gamepad();
        let pad = global.navigator.getGamepads()[0];
        let fired = false;

        gp.addEventListener('hold', () => (fired = true));

        const interval = setInterval(() => {
          pad.axes[0] = 1;
          gp.update();
        }, 10);

        await sleep(200);
        clearInterval(interval);
        assert(fired);
      });
  });

  describe('repeat', () => {
    test('should be fired when button is held', async () => {
      let gp = new Gamepad({ repeatThreshold: 10 });
      let pad = global.navigator.getGamepads()[0];
      let fired = false;

      gp.addEventListener('repeat', () => (fired = true));

      const interval = setInterval(() => {
        pad.buttons[0].value = 1;
        gp.update();
      }, 10);

      await sleep(50);
      clearInterval(interval);
      assert(fired);
    });

    test('should be fired when axis is held', async () => {
      let gp = new Gamepad({ repeatThreshold: 10 });
      let pad = global.navigator.getGamepads()[0];
      let fired = false;

      gp.addEventListener('repeat', () => (fired = true));

      const interval = setInterval(() => {
        pad.axes[0] = 1;
        gp.update();
      }, 10);

      await sleep(50);
      clearInterval(interval);
      assert(fired);
    });
  });

  describe('long_press', () => {
    test('should be fired when button is held', async () => {
      let gp = new Gamepad({ longpressThreshold: 10 });
      let pad = global.navigator.getGamepads()[0];
      let fired = false;

      gp.addEventListener(E_EVENT_TYPES.LONG_PRESS, () => (fired = true));

      const interval = setInterval(() => {
        pad.buttons[0].value = 1;
        gp.update();
      }, 1);

      await sleep(50);
      clearInterval(interval);
      assert(fired);
    });
    test('should be fired when axis is held', async () => {
      let gp = new Gamepad({ longpressThreshold: 10 });
      let pad = global.navigator.getGamepads()[0];
      let fired = false;

      gp.addEventListener(E_EVENT_TYPES.LONG_PRESS, () => (fired = true));

      const interval = setInterval(() => {
        pad.axes[0] = 1;
        gp.update();
      }, 1);

      await sleep(50);
      clearInterval(interval);
      assert(fired);
    });
  });
});
