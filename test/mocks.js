let gamepads = [{
  index: 0,
  buttons: [
    {value: 0},
    {value: 0},
    {value: 0},
    {value: 0},
    {value: 0},
    {value: 0},
    {value: 0},
    {value: 0},
    {value: 0},
  ],
  axes: [0],
  connected: true,
}];

global.navigator = {
  getGamepads(){
    return gamepads;
  },
  connectGamepad() {
    gamepads.push({
      index: 1,
      buttons: [],
      axes: [0],
      connected: true
    });
  }
};

module.exports = {
  resetMocks() {
    gamepads = [{
      index: 0,
      buttons: [
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0}
      ],
      axes: [0],
      connected: true,
    }];
  }
};
