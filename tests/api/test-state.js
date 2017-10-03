// tests/api/test-state.js
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var State = require('./../../libs/game/state.js');

describe('State', function() {
  it('Constructor should build state from object passed in', function() {
    var state = new State({
        name: "Test State",
    });
    expect(state.name).to.equal("Test State");
  });
});