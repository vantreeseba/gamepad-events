const CustomEvent = global.CustomEvent || global.Event;

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
      case 'down':
        this.delta[player][button] = true;
        break;
      case 'hold':
        delete this.delta[player][button];
        this._startHold(player, button);
        break;
      case 'up':
        this.delta[player][button] = false;
        this._clearHold(player, button);
        break;
      case 'longpress':
        this.longpress[player][button].fired = true;
        break;
      case 'repeat':
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
      case 'down':
      case 'hold':
        this._startHold(player, axis);
        this.delta[player][axis] = value;
        break;
      case 'up':
        this.delta[player][axis] = 0;
        this._clearHold(player, axis);
        break;
      case 'longpress':
        this.longpress[player][axis].fired = true;
        break;
      case 'repeat':
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

    if (curVal > this.buttonThreshold && prevVal <= this.buttonThreshold) {
      this._onButtonEvent('down', player, button, curVal);
    }

    if (curVal > this.buttonThreshold && prevVal > this.buttonThreshold) {
      this._onButtonEvent('hold', player, button, curVal);
      const b = `button_${button}`;

      const lp = this.longpress[player][b];
      if (lp && Date.now() - lp.start > this.longpressThreshold && !lp.fired) {
        this._onButtonEvent('longpress', player, button, curVal);
      }

      const r = this.repeat[player][b];
      const startRepeat = r && !r.fired && Date.now() - r.start > this.repeatThreshold;
      const repeat = r && r.fired && Date.now() - r.start > this.repeatRate;
      if (startRepeat || repeat) {
        this._onButtonEvent('repeat', player, button, curVal);
      }
    }

    if (curVal <= this.buttonThreshold && prevVal > this.buttonThreshold) {
      this._onButtonEvent('up', player, button, curVal);
    }

    if (curVal <= this.buttonThreshold && prevVal <= this.buttonThreshold) {
      delete this.delta[player][`button_${button}`];
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
    const pressed = Math.abs(curVal) >= this.axisThreshold;
    const wasPressed = Math.abs(prevVal) >= this.axisThreshold;

    if (pressed) {
      if (!wasPressed) {
        this._onAxisEvent('down', player, axis, curVal);
      } else {
        this._onAxisEvent('hold', player, axis, curVal);
        const a = `axis_${axis}`;

        const lp = this.longpress[player][a];
        if (lp && Date.now() - lp.start > this.longpressThreshold && !lp.fired) {
          this._onAxisEvent('longpress', player, axis, curVal);
        }

        const r = this.repeat[player][a];
        const startRepeat = r && !r.fired && Date.now() - r.start > this.repeatThreshold;
        const repeat = r && r.fired && Date.now() - r.start > this.repeatRate;
        if (startRepeat || repeat) {
          this._onAxisEvent('repeat', player, axis, curVal);
        }
      }
    } else if (wasPressed) {
      this._onAxisEvent('up', player, axis, curVal);
    }

    if (this.delta[player][`axis_${axis}`] === 0) {
      delete this.delta[player][`axis_${axis}`];
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
        this._setState(controller);
        continue;
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
   * @param {string} target The button to check if is down.
   * @param {number} player=-1 The gamepad to check, if -1, all are checked.
   * @return {number} IsDown If the button is pressed or held.
   */
  isDown(target, player = -1) {
    let mapped;

    if (this.mappings[target]) {
      mapped = this.mappings[target];
    }

    if (!mapped) {
      return 0;
    }

    return mapped.type === 'button'
      ? this._isButtonDown(mapped.index, player)
      : this._isAxisDown(mapped.index, player);
  }

  /**
   * Gets the current value of a button.
   * @private
   * @param {number} buttonId The index of the button.
   * @param {number} [player] The player index.
   * @return {number} The value of the button.
   */
  _isButtonDown(buttonId, player) {
    if (player !== -1) {
      if (
        this.states[player]?.buttons?.length &&
        this.states[player]?.buttons[buttonId] >= this.buttonThreshold
      ) {
        return this.states[player].buttons[buttonId];
      }

      return 0;
    }

    for (let i = 0; i < 4; i += 1) {
      if (
        this.states[i]?.buttons?.length &&
        this.states[i]?.buttons[buttonId] >= this.buttonThreshold
      ) {
        return this.states[i].buttons[buttonId];
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
  _isAxisDown(axisId, player) {
    if (player !== -1) {
      if (
        this.states[player]?.axes?.length &&
        Math.abs(this.states[player]?.axes[axisId]) > this.axisThreshold
      ) {
        return this.states[player].axes[axisId];
      }

      return 0;
    }

    for (let i = 0; i < 4; i += 1) {
      if (
        this.states[i]?.axes?.length &&
        Math.abs(this.states[i]?.axes[axisId]) > this.axisThreshold
      ) {
        return this.states[i].axes[axisId];
      }
    }

    return 0;
  }

  /**
   * Get the state of a stick.
   * @param {string} target The stick name.
   * @param {number} player=-1 The index of the player to get.
   * @return {{x:number,y:number}} The x,y state of the stick.
   */
  getStick(target, player = -1) {
    return {
      x: this.isDown(`${target}_x`, player),
      y: this.isDown(`${target}_y`, player),
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

export const mappings = {
  // PS4 Buttons.
  ps4_x: { type: 'button', index: 0 },
  ps4_circle: { type: 'button', index: 1 },
  ps4_square: { type: 'button', index: 2 },
  ps4_triangle: { type: 'button', index: 3 },
  ps4_l1: { type: 'button', index: 4 },
  ps4_r1: { type: 'button', index: 5 },
  ps4_l2: { type: 'button', index: 6 },
  ps4_r2: { type: 'button', index: 7 },
  ps4_share: { type: 'button', index: 8 },
  ps4_options: { type: 'button', index: 9 },
  ps4_left_stick_in: { type: 'button', index: 10 },
  ps4_right_stick_in: { type: 'button', index: 11 },
  ps4_dpad_up: { type: 'button', index: 12 },
  ps4_dpad_down: { type: 'button', index: 13 },
  ps4_dpad_left: { type: 'button', index: 14 },
  ps4_dpad_right: { type: 'button', index: 15 },
  ps4_ps: { type: 'button', index: 16 },

  // PS4 Axes.
  ps4_left_stick_x: { type: 'axis', index: 0 },
  ps4_left_stick_y: { type: 'axis', index: 1 },
  ps4_right_stick_x: { type: 'axis', index: 2 },
  ps4_right_stick_y: { type: 'axis', index: 3 },

  // Xbox Buttons.
  xbox_a: { type: 'button', index: 0 },
  xbox_b: { type: 'button', index: 1 },
  xbox_x: { type: 'button', index: 2 },
  xbox_y: { type: 'button', index: 3 },
  xbox_lb: { type: 'button', index: 4 },
  xbox_rb: { type: 'button', index: 5 },
  xbox_lt: { type: 'button', index: 6 },
  xbox_rt: { type: 'button', index: 7 },
  xbox_back: { type: 'button', index: 8 },
  xbox_start: { type: 'button', index: 9 },
  xbox_left_stick_in: { type: 'button', index: 10 },
  xbox_right_stick_in: { type: 'button', index: 11 },
  xbox_dpad_up: { type: 'button', index: 12 },
  xbox_dpad_down: { type: 'button', index: 13 },
  xbox_dpad_left: { type: 'button', index: 14 },
  xbox_dpad_right: { type: 'button', index: 15 },

  // XBox Axes.
  xbox_left_stick_x: { type: 'axis', index: 0 },
  xbox_left_stick_y: { type: 'axis', index: 1 },
  xbox_right_stick_x: { type: 'axis', index: 2 },
  xbox_right_stick_y: { type: 'axis', index: 3 },

  // Generic Button Mappings
  rc_bottom: { type: 'button', index: 0 },
  rc_right: { type: 'button', index: 1 },
  rc_left: { type: 'button', index: 2 },
  rc_top: { type: 'button', index: 3 },
  l1: { type: 'button', index: 4 },
  r1: { type: 'button', index: 5 },
  l2: { type: 'button', index: 6 },
  r2: { type: 'button', index: 7 },
  center_left: { type: 'button', index: 8 },
  center_right: { type: 'button', index: 9 },
  left_stick_in: { type: 'button', index: 10 },
  right_stick_in: { type: 'button', index: 11 },
  dpad_up: { type: 'button', index: 12 },
  dpad_down: { type: 'button', index: 13 },
  dpad_left: { type: 'button', index: 14 },
  dpad_right: { type: 'button', index: 15 },
  center_center: { type: 'button', index: 16 },

  // Generic Axis Mappings
  left_stick_x: { type: 'axis', index: 0 },
  left_stick_y: { type: 'axis', index: 1 },
  right_stick_x: { type: 'axis', index: 2 },
  right_stick_y: { type: 'axis', index: 3 },
};
