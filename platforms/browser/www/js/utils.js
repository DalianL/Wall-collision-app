// Time functions
var oldTime = 0;

function timer(currentTime) {
    var delta = currentTime - oldTime;
    oldTime = currentTime;
	return delta > -100000 ? delta : 0;
}

// Distance functions
function calcDistanceToMove(delta, speed) {
	return (speed * delta) / 1000;
}

function distancePoint(x1, y1, x2, y2) {
	return Math.sqrt( ((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)) );
}

// Device functions
var mobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }
};

var isMobile = function() {
	mobileArray = mobile.iOS();
	if (typeof mobileArray !== 'undefined' && mobileArray != null && mobileArray.length > 0) {
		return true;
	}
	mobileArray = mobile.Android();
	if (typeof mobileArray !== 'undefined' && mobileArray != null && mobileArray.length > 0) {
		return true;
	}
	return false;
}

// Position event functions
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
    };
}

function getTouchPos(canvasDom, touchEvent) {
	var rect = canvasDom.getBoundingClientRect();
	return {
		x: touchEvent.touches[0].clientX - rect.left,
		y: touchEvent.touches[0].clientY - rect.top
	};
}