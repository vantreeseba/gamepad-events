const CustomEvent = global.CustomEvent || global.Event;

/**
 * @typedef {{x:number,y:number}} Vector2
 */

/**
 * A helper to manage gamepad inputs.
 * @extends EventTarget
 */
export class GamePadManager extends EventTarget {
  /**
   * Constructor.
   * @param {object} [config] The configuration object.
   * @param {number} [config.buttonThreshold] The threshold to trigger button events.
   * Used for analog buttons / triggers with variable values and not binary ones.
   * @param {number} [config.axisThreshold] The threshold to trigger axis events.
   * @param {number} [config.longpressThreshold] The threshold to trigger longpress.
   * @param {number} [config.repeatThreshold] The threshold to trigger repeat.
   * @param {number} [config.repeatRate] The time between repeat events.
   */
  constructor(config = {}) {
    super();

    this.states = {};
    this.buttonThreshold = config.buttonThreshold || 0.1;
    this.axisThreshold = config.axisThreshold || 0.1;
    this.longpressThreshold = config.longpressThreshold || 300;
    this.repeatThreshold = config.repeatThreshold || 300;
    this.repeatRate = config.repeatRate || 100;
    this.delta = {
      0: {},
      1: {},
      2: {},
      3: {},
    };

    this.longpress = {
      0: {},
      1: {},
      2: {},
      3: {},
    };

    this.repeat = {
      0: {},
      1: {},
      2: {},
      3: {},
    };

    this.mappings = mappings;

    for (let j = 0; j < 4; j += 1) {
      const controller = navigator.getGamepads()[j];
      if (controller) {
        this._setState(controller);
      }
    }
  }

  /**
   * Set the current hold state for a players button.
   * @private
   * @param {number} player The gamepad that triggered the event.
   * @param {string} index The Index of the button/axis to be marked as long press.
   */
  _startHold(player, index) {
    if (!this.longpress[player][index]) {
      this.longpress[player][index] = {
        start: Date.now(),
        fired: false,
      };
    }

    if (!this.repeat[player][index]) {
      this.repeat[player][index] = {
        start: Date.now(),
        fired: false,
      };
    }
  }

  /**
   * Clear the current hold state for a players button.
   * @private
   * @param {number} player The gamepad that triggered the event.
   * @param {string} button The Index of the button to be cleared.
   */
  _clearHold(player, button) {
    delete this.longpress[player][button];
    delete this.repeat[player][button];
  }

  /**
   * Internal method for handling button events.
   * @private
   * @param {string} event Type of event.
   * @param {number} player The gamepad that triggered the event.
   * @param {number} bIndex The index of the button that triggered the event.
   * @param {number} value Value of the button press (this can be a between 0,1 for triggers).
   */
  _onButtonEvent(event, player, bIndex, value) {
    const button = `button_${bIndex}`;

    this.dispatchEvent(new CustomEvent(event, { detail: { player, bIndex, value } }));
    this.dispatchEvent(
      new CustomEvent(`${event}:${button}`, { detail: { player, button, value } }),
    );

    switch (event) {
      case E_EVENT_TYPES.DOWN:
        this.delta[player][button] = true;
        break;
      case E_EVENT_TYPES.HOLD:
        delete this.delta[player][button];
        this._startHold(player, button);
        break;
      case E_EVENT_TYPES.UP:
        this.delta[player][button] = false;
        this._clearHold(player, button);
        break;
      case E_EVENT_TYPES.LONG_PRESS:
        this.longpress[player][button].fired = true;
        break;
      case E_EVENT_TYPES.REPEAT:
        this.repeat[player][button].fired = true;
        this.repeat[player][button].start = Date.now();
        break;
    }
  }

  /**
   * Internal method for handling axis events.
   * @private
   * @param {string} event Type of event.
   * @param {number} player The gamepad that triggered the event.
   * @param {number} axisIndex The index of the axis that triggered the event.
   * @param {number} value Value of the axis (this is between -1, 1).
   */
  _onAxisEvent(event, player, axisIndex, value) {
    const axis = `axis_${axisIndex}`;

    this.dispatchEvent(new CustomEvent(event, { detail: { player, axisIndex, value } }));
    this.dispatchEvent(
      new CustomEvent(`${event}:${axis}`, { detail: { player, axisIndex, value } }),
    );

    switch (event) {
      case E_EVENT_TYPES.DOWN:
      case E_EVENT_TYPES.HOLD:
        this._startHold(player, axis);
        this.delta[player][axis] = value;
        break;
      case E_EVENT_TYPES.UP:
        this.delta[player][axis] = 0;
        this._clearHold(player, axis);
        break;
      case E_EVENT_TYPES.LONG_PRESS:
        this.longpress[player][axis].fired = true;
        break;
      case E_EVENT_TYPES.REPEAT:
        this.repeat[player][axis].fired = true;
        this.repeat[player][axis].start = Date.now();
        break;
    }
  }

  /**
   * Set the internal state of the gamepad.
   * @private
   * @param {object} gamepad The gamepad.
   */
  _setState(gamepad) {
    this.states[gamepad.index] = this.states[gamepad.index] || {};
    this.states[gamepad.index].axes = gamepad.axes.map((a) => a);
    this.states[gamepad.index].buttons = gamepad.buttons.map((a) => a.value);
  }

  /**
   * Update the buttons state.
   * @private
   * @param {number} player The index of the controller.
   * @param {object} controller The controller.
   * @param {number} button The index of the button to update.
   */
  _updateButtons(player, controller, button) {
    const curVal = controller.buttons[button].value;
    const prevVal = this.states[player].buttons[button];
    const b = `button_${button}`;
    const isDown = curVal >= this.buttonThreshold;
    const wasDown = prevVal >= this.buttonThreshold;

    if (isDown && !wasDown) {
      this._onButtonEvent(E_EVENT_TYPES.DOWN, player, button, curVal);
    }

    if (isDown && wasDown) {
      this._onButtonEvent(E_EVENT_TYPES.HOLD, player, button, curVal);

      const lp = this.longpress[player][b];
      const duration = Date.now() - lp.start;
      if (lp && duration > this.longpressThreshold && !lp.fired) {
        this._onButtonEvent(E_EVENT_TYPES.LONG_PRESS, player, button, curVal);
      }

      const r = this.repeat[player][b];
      const startRepeat = r && !r.fired && Date.now() - r.start > this.repeatThreshold;
      const repeat = r && r.fired && Date.now() - r.start > this.repeatRate;

      if (startRepeat || repeat) {
        this._onButtonEvent(E_EVENT_TYPES.REPEAT, player, button, curVal);
      }
    }

    if (!isDown && wasDown) {
      this._onButtonEvent(E_EVENT_TYPES.UP, player, button, curVal);
    }

    if (!isDown && !wasDown) {
      delete this.delta[player][b];
    }
  }

  /**
   * Update the axes state.
   * @private
   * @param {number} player The index of the controller.
   * @param {object} controller The controller.
   * @param {number} axis The index of the axis to update.
   */
  _updateAxes(player, controller, axis) {
    const curVal = controller.axes[axis];
    const prevVal = this.states[player].axes[axis];
    const isDown = Math.abs(curVal) >= this.axisThreshold;
    const wasDown = Math.abs(prevVal) >= this.axisThreshold;

    const a = `axis_${axis}`;

    if (isDown) {
      if (!wasDown) {
        this._onAxisEvent(E_EVENT_TYPES.DOWN, player, axis, curVal);
      } else {
        this._onAxisEvent(E_EVENT_TYPES.HOLD, player, axis, curVal);

        const lp = this.longpress[player][a];
        const duration = Date.now() - lp.start;

        if (lp && duration > this.longpressThreshold && !lp.fired) {
          this._onAxisEvent(E_EVENT_TYPES.LONG_PRESS, player, axis, curVal);
        }

        const r = this.repeat[player][a];
        const startRepeat = r && !r.fired && Date.now() - r.start > this.repeatThreshold;
        const repeat = r && r.fired && Date.now() - r.start > this.repeatRate;

        if (startRepeat || repeat) {
          this._onAxisEvent(E_EVENT_TYPES.REPEAT, player, axis, curVal);
        }
      }
    } else if (wasDown) {
      this._onAxisEvent(E_EVENT_TYPES.UP, player, axis, curVal);
    }

    if (this.delta[player][a] === 0) {
      delete this.delta[player][a];
    }
  }

  /**
   * Update the gamepad manager, this handles button/axis events,
   * as well as updating the internal state and setting up the delta.
   */
  update() {
    const controllers = navigator.getGamepads();

    for (let player = 0; player < 4; player += 1) {
      const controller = controllers[player];

      if (!controller || !controller.connected) {
        continue;
      }

      // Handle new connected gamepad.
      if (!this.states[player]) {
        // initial state should be "empty" and all 0
        // so first detection of button press can fire event
        this.states[controller.index] = this.states[controller.index] || {};
        this.states[controller.index].axes = controller.axes.map(() => 0);
        this.states[controller.index].buttons = controller.buttons.map(() => 0);
      }

      for (let button = 0; button < controller.buttons.length; button += 1) {
        this._updateButtons(player, controller, button);
      }

      for (let axis = 0; axis < controller.axes.length; axis += 1) {
        this._updateAxes(player, controller, axis);
      }

      this._setState(controller);
    }
  }

  /**
   * Check if a button is pressed or held.
   * @param {keyof mappings} target The button to check if is down.
   * @param {number} player=-1 The gamepad to check, if -1, all are checked.
   * @return {boolean} IsDown If the button is pressed or held.
   */
  isDown(target, player = -1) {
    let mapped = this.mappings[target];

    if (!mapped) {
      return false;
    }

    let value = this.value(target, player);

    switch (mapped.type) {
      case E_INPUT_TYPES.BUTTON:
        return value >= this.buttonThreshold;
      case E_INPUT_TYPES.AXIS:
        return Math.abs(value) >= this.axisThreshold;
      case E_INPUT_TYPES.STICK:
        return value != null;
    }

    return false;
  }

  /**
   * Check if a button is pressed or held.
   * @param {keyof mappings} target The button to check if is down.
   * @param {number} player=-1 The gamepad to check, if -1, all are checked.
   * @return {number|Vector2} IsDown If the button is pressed or held.
   */
  value(target, player = -1) {
    let mapped = this.mappings[target];

    switch (mapped?.type) {
      case E_INPUT_TYPES.BUTTON:
        return this._getButtonValue(mapped.index, player);
      case E_INPUT_TYPES.AXIS:
        return this._getAxisValue(mapped.index, player);
      case E_INPUT_TYPES.STICK:
        return this._getStickValue(target, player);
    }

    return 0;
  }

  /**
   * Gets the current value of a button.
   * @private
   * @param {number} buttonId The index of the button.
   * @param {number} [player] The player index.
   * @return {number} The value of the button.
   */
  _getButtonValue(buttonId, player) {
    if (player !== -1) {
      if (this.states[player]?.buttons?.length) {
        return this.states[player].buttons[buttonId] || 0;
      }
      return 0;
    }

    for (let i = 0; i < 4; i += 1) {
      if (this.states[i]?.buttons?.length) {
        return this.states[i].buttons[buttonId] || 0;
      }
    }

    return 0;
  }

  /**
   * Gets the current value of an axis.
   * @private
   * @param {number} axisId The axis index.
   * @param {number} [player] The player index.
   * @return {number} The value of the axis.
   */
  _getAxisValue(axisId, player) {
    if (player !== -1) {
      if (this.states[player]?.axes?.length) {
        return this.states[player].axes[axisId] || 0;
      }
      return 0;
    }

    for (let i = 0; i < 4; i += 1) {
      if (this.states[i]?.axes?.length) {
        return this.states[i].axes[axisId] || 0;
      }
    }

    return 0;
  }

  /**
   * Get the state of a stick.
   * @private
   * @param {keyof mappings} target The stick name.
   * @param {number} player=-1 The index of the player to get.
   * @return {Vector2} The x,y state of the stick.
   */
  _getStickValue(target, player = -1) {
    let xMapped = this.mappings[`${target}_x`];
    let yMapped = this.mappings[`${target}_y`];

    if (!xMapped || !yMapped) {
      return { x: 0, y: 0 };
    }

    return {
      x: this._getAxisValue(xMapped?.index, player),
      y: this._getAxisValue(yMapped?.index, player),
    };
  }

  /**
   * Maps an event name to the internal name.
   * I.e. down:ps4_circle to down:button_1
   *
   * @private
   * @param {string} event The event name to map.
   * @return {string} The mapped event name.
   */
  _getMappedEventName(event) {
    if (event.includes(':')) {
      let [type, id] = event.split(':');
      if (this.mappings[id]) {
        const mapping = this.mappings[id];
        id = mapping.type + '_' + mapping.index;
      }

      return `${type}:${id}`;
    }

    return event;
  }

  /**
   * Add an event listener.
   * These are namespaced as well, so you can do down:axis_0 to get the specific axis event.
   * @param {string} type The name of the event.
   * @param {EventListener | EventListenerObject} listener The name of the event.
   * @param {EventListenerOptions} [options]
   * @returns {GamePadManager}
   */
  addEventListener(type, listener, options) {
    const name = this._getMappedEventName(type);
    super.addEventListener(name, listener, options);
    return this;
  }

  /**
   * Remove an event listener.
   * These are namespaced as well, so you can do down:axis_0 to get the specific axis event.
   * @param {string} type The name of the event.
   * @param {EventListener | EventListenerObject} listener The name of the event.
   * @param {EventListenerOptions} [options]
   * @returns {GamePadManager}
   */
  removeEventListener(type, listener, options) {
    const name = this._getMappedEventName(type);
    super.removeEventListener(name, listener, options);
    return this;
  }
}

const E_INPUT_TYPES = {
  BUTTON: 'button',
  AXIS: 'axis',
  STICK: 'stick',
};

export const E_EVENT_TYPES = {
  DOWN: 'down',
  UP: 'up',
  HOLD: 'hold',
  LONG_PRESS: 'long_press',
  REPEAT: 'repeat',
};

export const mappings = {
  // PS4 Buttons.
  ps4_x: { type: E_INPUT_TYPES.BUTTON, index: 0 },
  ps4_circle: { type: E_INPUT_TYPES.BUTTON, index: 1 },
  ps4_square: { type: E_INPUT_TYPES.BUTTON, index: 2 },
  ps4_triangle: { type: E_INPUT_TYPES.BUTTON, index: 3 },
  ps4_l1: { type: E_INPUT_TYPES.BUTTON, index: 4 },
  ps4_r1: { type: E_INPUT_TYPES.BUTTON, index: 5 },
  ps4_l2: { type: E_INPUT_TYPES.BUTTON, index: 6 },
  ps4_r2: { type: E_INPUT_TYPES.BUTTON, index: 7 },
  ps4_share: { type: E_INPUT_TYPES.BUTTON, index: 8 },
  ps4_options: { type: E_INPUT_TYPES.BUTTON, index: 9 },
  ps4_left_stick_in: { type: E_INPUT_TYPES.BUTTON, index: 10 },
  ps4_right_stick_in: { type: E_INPUT_TYPES.BUTTON, index: 11 },
  ps4_dpad_up: { type: E_INPUT_TYPES.BUTTON, index: 12 },
  ps4_dpad_down: { type: E_INPUT_TYPES.BUTTON, index: 13 },
  ps4_dpad_left: { type: E_INPUT_TYPES.BUTTON, index: 14 },
  ps4_dpad_right: { type: E_INPUT_TYPES.BUTTON, index: 15 },
  ps4_ps: { type: E_INPUT_TYPES.BUTTON, index: 16 },

  // PS4 Axes.
  ps4_left_stick_x: { type: E_INPUT_TYPES.AXIS, index: 0 },
  ps4_left_stick_y: { type: E_INPUT_TYPES.AXIS, index: 1 },
  ps4_right_stick_x: { type: E_INPUT_TYPES.AXIS, index: 2 },
  ps4_right_stick_y: { type: E_INPUT_TYPES.AXIS, index: 3 },

  // Xbox Buttons.
  xbox_a: { type: E_INPUT_TYPES.BUTTON, index: 0 },
  xbox_b: { type: E_INPUT_TYPES.BUTTON, index: 1 },
  xbox_x: { type: E_INPUT_TYPES.BUTTON, index: 2 },
  xbox_y: { type: E_INPUT_TYPES.BUTTON, index: 3 },
  xbox_lb: { type: E_INPUT_TYPES.BUTTON, index: 4 },
  xbox_rb: { type: E_INPUT_TYPES.BUTTON, index: 5 },
  xbox_lt: { type: E_INPUT_TYPES.BUTTON, index: 6 },
  xbox_rt: { type: E_INPUT_TYPES.BUTTON, index: 7 },
  xbox_back: { type: E_INPUT_TYPES.BUTTON, index: 8 },
  xbox_start: { type: E_INPUT_TYPES.BUTTON, index: 9 },
  xbox_left_stick_in: { type: E_INPUT_TYPES.BUTTON, index: 10 },
  xbox_right_stick_in: { type: E_INPUT_TYPES.BUTTON, index: 11 },
  xbox_dpad_up: { type: E_INPUT_TYPES.BUTTON, index: 12 },
  xbox_dpad_down: { type: E_INPUT_TYPES.BUTTON, index: 13 },
  xbox_dpad_left: { type: E_INPUT_TYPES.BUTTON, index: 14 },
  xbox_dpad_right: { type: E_INPUT_TYPES.BUTTON, index: 15 },

  // XBox Axes.
  xbox_left_stick_x: { type: E_INPUT_TYPES.AXIS, index: 0 },
  xbox_left_stick_y: { type: E_INPUT_TYPES.AXIS, index: 1 },
  xbox_right_stick_x: { type: E_INPUT_TYPES.AXIS, index: 2 },
  xbox_right_stick_y: { type: E_INPUT_TYPES.AXIS, index: 3 },

  // Generic Button Mappings
  rc_bottom: { type: E_INPUT_TYPES.BUTTON, index: 0 },
  rc_right: { type: E_INPUT_TYPES.BUTTON, index: 1 },
  rc_left: { type: E_INPUT_TYPES.BUTTON, index: 2 },
  rc_top: { type: E_INPUT_TYPES.BUTTON, index: 3 },
  l1: { type: E_INPUT_TYPES.BUTTON, index: 4 },
  r1: { type: E_INPUT_TYPES.BUTTON, index: 5 },
  l2: { type: E_INPUT_TYPES.BUTTON, index: 6 },
  r2: { type: E_INPUT_TYPES.BUTTON, index: 7 },
  center_left: { type: E_INPUT_TYPES.BUTTON, index: 8 },
  center_right: { type: E_INPUT_TYPES.BUTTON, index: 9 },
  left_stick_in: { type: E_INPUT_TYPES.BUTTON, index: 10 },
  right_stick_in: { type: E_INPUT_TYPES.BUTTON, index: 11 },
  dpad_up: { type: E_INPUT_TYPES.BUTTON, index: 12 },
  dpad_down: { type: E_INPUT_TYPES.BUTTON, index: 13 },
  dpad_left: { type: E_INPUT_TYPES.BUTTON, index: 14 },
  dpad_right: { type: E_INPUT_TYPES.BUTTON, index: 15 },
  center_center: { type: E_INPUT_TYPES.BUTTON, index: 16 },

  // Generic Axis Mappings
  left_stick_x: { type: E_INPUT_TYPES.AXIS, index: 0 },
  left_stick_y: { type: E_INPUT_TYPES.AXIS, index: 1 },
  right_stick_x: { type: E_INPUT_TYPES.AXIS, index: 2 },
  right_stick_y: { type: E_INPUT_TYPES.AXIS, index: 3 },

  //index doesn't make sense here?
  left_stick: { type: E_INPUT_TYPES.STICK, index: 0 },
  right_stick: { type: E_INPUT_TYPES.STICK, index: 1 },
  ps4_left_stick: { type: E_INPUT_TYPES.STICK, index: 0 },
  ps4_right_stick: { type: E_INPUT_TYPES.STICK, index: 1 },
  xbox_left_stick: { type: E_INPUT_TYPES.STICK, index: 0 },
  xbox_right_stick: { type: E_INPUT_TYPES.STICK, index: 1 },
};

/** @typedef {{[Key in keyof mappings as Uppercase<string & Key>]: keyof mappings}} E_INPUT_NAMES */

/**
 * @param {any} acc
 * @param {any} cur
 */
function mapToNames(acc, cur) {
  /** @type {E_INPUT_NAMES} */
  return { ...acc, [cur.toUpperCase()]: cur };
}

/** @type {E_INPUT_NAMES} */
export const E_INPUT_NAMES = Object.keys(mappings).reduce(mapToNames, {});
