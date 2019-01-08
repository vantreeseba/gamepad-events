<a name="GamePadManager"></a>

## GamePadManager ⇐ <code>EventEmitter</code>
A helper to manage gamepad inputs.

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  
**See**: [https://github.com/primus/eventemitter3](https://github.com/primus/eventemitter3) eventemitter3  

* [GamePadManager](#GamePadManager) ⇐ <code>EventEmitter</code>
    * [new GamePadManager([config])](#new_GamePadManager_new)
    * [.update()](#GamePadManager+update)
    * [.isDown(target, player)](#GamePadManager+isDown) ⇒ <code>Boolean</code>
    * [.getStick(target, player)](#GamePadManager+getStick) ⇒ <code>Object</code>
    * [.on(event, listener, context)](#GamePadManager+on) ⇒ <code>EventEmitter</code>
    * [.off(event, listener)](#GamePadManager+off) ⇒ <code>EventEmitter</code>

<a name="new_GamePadManager_new"></a>

### new GamePadManager([config])
Constructor.


| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>Object</code> | The configuration object. |
| [config.buttonThreshold] | <code>Number</code> | The threshold to trigger button events. Used for analog buttons / triggers with variable values and not binary ones. |
| [config.axisThreshold] | <code>Number</code> | The threshold to trigger axis events. |
| [config.longpressThreshold] | <code>Number</code> | The threshold to trigger longpress. |
| [config.repeatThreshold] | <code>Number</code> | The threshold to trigger repeat. |
| [config.repeatRate] | <code>Number</code> | The time between repeat events. |

<a name="GamePadManager+update"></a>

### gamePadManager.update()
Update the gamepad manager, this handles button/axis events,
as well as updating the internal state and setting up the delta.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  
<a name="GamePadManager+isDown"></a>

### gamePadManager.isDown(target, player) ⇒ <code>Boolean</code>
Check if a button is pressed or held.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  
**Returns**: <code>Boolean</code> - IsDown If the button is pressed or held.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| target | <code>String</code> |  | The button to check if is down. |
| player | <code>Number</code> | <code>-1</code> | The gamepad to check, if -1, all are checked. |

<a name="GamePadManager+getStick"></a>

### gamePadManager.getStick(target, player) ⇒ <code>Object</code>
Get the state of a stick.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  
**Returns**: <code>Object</code> - The x,y state of the stick.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| target | <code>String</code> |  | The stick name. |
| player | <code>Number</code> | <code>-1</code> | The index of the player to get. |

<a name="GamePadManager+on"></a>

### gamePadManager.on(event, listener, context) ⇒ <code>EventEmitter</code>
Add an event listener.
These are namespaced as well, so you can do down:axis_0 to get the specific axis event.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The name of the event. |
| listener | <code>function</code> | The name of the event. |
| context | <code>object</code> | The context to be used as 'this' in the listener. |

<a name="GamePadManager+off"></a>

### gamePadManager.off(event, listener) ⇒ <code>EventEmitter</code>
Remove an event listener.
These are namespaced as well, so you can do down:axis_0 to get the specific axis event.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The name of the event. |
| listener | <code>function</code> | The name of the event. |

