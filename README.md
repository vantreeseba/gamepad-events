<a name="GamePadManager"></a>

## GamePadManager
A helper to manage gamepad inputs.

**Kind**: global class  

* [GamePadManager](#GamePadManager)
    * [new GamePadManager([config])](#new_GamePadManager_new)
    * [.update()](#GamePadManager+update)
    * [.isDown(target, [player])](#GamePadManager+isDown) ⇒ <code>Boolean</code>
    * [.getStick(target, [player])](#GamePadManager+getStick) ⇒ <code>Object</code>

<a name="new_GamePadManager_new"></a>

### new GamePadManager([config])
Constructor.


| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>Object</code> | The configuration object. |
| [config.axisThreshold] | <code>Number</code> | The threshold to trigger axis events. |
| [config.longpressThreshold] | <code>Number</code> | The threshold to trigger longpress. |
| [config.repeatThreshold] | <code>Number</code> | The threshold to trigger longpress. |
| [config.repeatRate] | <code>Number</code> | The threshold to trigger longpress. |

<a name="GamePadManager+update"></a>

### gamePadManager.update()
Update the gamepad manager, this handles button/axis events,
as well as updating the internal state and setting up the delta.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  
<a name="GamePadManager+isDown"></a>

### gamePadManager.isDown(target, [player]) ⇒ <code>Boolean</code>
Check if a button is pressed or held.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  
**Returns**: <code>Boolean</code> - IsDown If the button is pressed or held.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| target | <code>String</code> |  | The button to check if is down. |
| [player] | <code>Number</code> | <code>-1</code> | The gamepad to check, if -1, all are checked. |

<a name="GamePadManager+getStick"></a>

### gamePadManager.getStick(target, [player]) ⇒ <code>Object</code>
Get the state of a stick.

**Kind**: instance method of [<code>GamePadManager</code>](#GamePadManager)  
**Returns**: <code>Object</code> - The x,y state of the stick.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>String</code> | The stick name. |
| [player] | <code>Number</code> | The index of the player to get. |

