# This is a template for node/js modules.
<a name="GamePadManager"></a>

## GamePadManager
A helper to manage gamepad inputs.

**Kind**: global class  

* [GamePadManager](#GamePadManager)
    * [new GamePadManager([config])](#new_GamePadManager_new)
    * [._startHold(player, button)](#GamePadManager+_startHold)
    * [._clearHold(player, button)](#GamePadManager+_clearHold)
    * [.update()](#GamePadManager+update)
    * [.on(type, target, listener)](#GamePadManager+on)
    * [.off(type, target)](#GamePadManager+off)
    * [.isDown(target, [player])](#GamePadManager+isDown) ⇒ <code>Boolean</code>
    * [.isMoved(target, [player])](#GamePadManager+isMoved)
    * [.getStick(target, [player])](#GamePadManager+getStick) ⇒ <code>Object</code>
    * [.hasDelta([player])](#GamePadManager+hasDelta) ⇒ <code>Boolean</code>

<a name="new_GamePadManager_new"></a>

### new GamePadManager([config])
Constructor.


| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>Object</code> | The configuration object. |
| [config.axisThreshold] | <code>Number</code> | The threshold to trigger axis events. |
| [config.longPressThreshold] | <code>Number</code> | The threshold to trigger longPress. |
| [config.repeatThreshold] | <code>Number</code> | The threshold to trigger longPress. |
| [config.repeatRate] | <code>Number</code> | The threshold to trigger longPress. |

<a name="GamePadManager+_startHold"></a>

### gamePadManager._startHold(player, button)
Set the current hold state for a players button.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  

| Param | Type | Description |
| --- | --- | --- |
| player | <code>Number</code> | The gamepad that triggered the event. |
| button | <code>Number</code> | The Index of the button to be marked as long press. |

<a name="GamePadManager+_clearHold"></a>

### gamePadManager._clearHold(player, button)
Clear the current hold state for a players button.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  

| Param | Type | Description |
| --- | --- | --- |
| player | <code>Number</code> | The gamepad that triggered the event. |
| button | <code>Number</code> | The Index of the button to be cleared. |

<a name="GamePadManager+update"></a>

### gamePadManager.update()
Update the gamepad manager, this handles button/axis events,
as well as updating the internal state and setting up the delta.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  
<a name="GamePadManager+on"></a>

### gamePadManager.on(type, target, listener)
Set an event listender for a button or axis event.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | The type of event to listen for. |
| target | <code>String</code> | The button or axis to listen to events for. |
| listener | <code>function</code> | Called with event data when the event occurs. |

<a name="GamePadManager+off"></a>

### gamePadManager.off(type, target)
Remove the event listener from the button or axis.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | The type of event to remove the listener for. |
| target | <code>String</code> | The button or axis to remove the listener for. |

<a name="GamePadManager+isDown"></a>

### gamePadManager.isDown(target, [player]) ⇒ <code>Boolean</code>
Check if a button is pressed or held.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  
**Returns**: <code>Boolean</code> - IsDown If the button is pressed or held.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| target | <code>String</code> |  | The button to check if is down. |
| [player] | <code>Number</code> | <code>-1</code> | The gamepad to check, if -1, all are checked. |

<a name="GamePadManager+isMoved"></a>

### gamePadManager.isMoved(target, [player])
Returns a number representing if an axis has moved, 0 if not, (-1,0] or [0,1) otherwise.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  

| Param | Type | Default |
| --- | --- | --- |
| target | <code>String</code> |  | 
| [player] | <code>Number</code> | <code>-1</code> | 

<a name="GamePadManager+getStick"></a>

### gamePadManager.getStick(target, [player]) ⇒ <code>Object</code>
Get the state of a stick.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  
**Returns**: <code>Object</code> - The x,y state of the stick.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>String</code> | The stick name. |
| [player] | <code>Number</code> | The index of the player to get. |

<a name="GamePadManager+hasDelta"></a>

### gamePadManager.hasDelta([player]) ⇒ <code>Boolean</code>
Returns if the state of the buttons has changed since the last update.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  
**Returns**: <code>Boolean</code> - If there was a change since the last update in button/axis states.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [player] | <code>Number</code> | <code>-1</code> | The gamepad to check for a delta, if -1, all are checked. |

