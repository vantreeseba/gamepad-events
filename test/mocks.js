let gamepads = [{
  index: 0,
  buttons: [
    {value: 0},
    {value: 0}
  ],
  axes: [0],
  connected: true,
}];

global.navigator = {
  getGamepads(){
    return gamepads;
  }
};

module.exports = {
  resetMocks() {
    gamepads = [{
      index: 0,
      buttons: [
        {value: 0},
        {value: 0}
      ],
      axes: [0],
      connected: true,
    }];
  }
};
