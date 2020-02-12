export const myFakeJson = [
  {
    filename: "thing_1.js",
    content: `var editor = require("./cm");
var state = require("./state");
var time = require("./time");
var updateSel = function(anchor, head) {
	editor.doc.setSelection(anchor, head);
};
var displayTimer = function(time) {
	document.getElementById("time").textContent=time;
};
var replayRender = function(events, step) {
	updateSel(events[step].anchor, events[step].head);
};
var renderLoop = function() {
	if (state.playing) {
		if (state.step < state.eventTimes.length) {
			var step = state.step;
			// var thistime = state.eventTimes[step];
			// state.playTimeSoFar = thistime;
			var nextstep = state.step + 1;
			replayRender(state.eventLog, step);
			console.log("step: " + step + ", time: " + state.eventTimes[step]);
//			displayTimer(thistime);
			var wait = time.between(state.eventTimes[step], state.eventTimes[nextstep]);
			setTimeout(function() {
				state.step++;
				renderLoop();
			}, wait);
		} else {
			state.playing = false;
			console.log("That's it!");
		}
}
};
module.exports = {
	startLoop: function() {
		state.playing = true;
    	renderLoop();
	},
	stopLoop: function() {
		state.playing = false;
	},
	displayTimer: displayTimer
};`
  },
  {
    filename: "thing_2.js",
    content: `var person = 'Mike';
  var age = 28;
  
  function myTag(strings, personExp, ageExp) {
    var str0 = strings[0]; // "That "
    var str1 = strings[1]; // " is a "
  
    // There is technically a string after
    // the final expression (in our example),
    // but it is empty (""), so disregard.
    // var str2 = strings[2];
  
    var ageStr;
    if (ageExp > 99){
      ageStr = 'centenarian';
    } else {
      ageStr = 'youngster';
    }
  
  console.log(output);
  // That Mike is a youngster`
  },
  {
    filename: "and_one_more_thing.js",
    content: `export const reducers = (state = {}, action) => {
      switch (action.type) {
        case "ADD_GISTS":
          return {
            ...state,
            active: 0,
            gists: action.gists
          };
        case "CLEAR_GISTS":
          return {
            ...state,
            gists: []
          };
        case "SET_ACTIVE":
          return {
            ...state,
            active: action.index
          };
        default:
          return state;
      }
    };`
  }
];
