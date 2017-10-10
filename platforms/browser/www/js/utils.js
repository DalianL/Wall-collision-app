// Time-related functions
var oldTime = 0;

function timer(currentTime) {
    var delta = currentTime - oldTime;
    oldTime = currentTime;
	return delta > -100000 ? delta : 0;
}

// Distance-related functions
function calcDistanceToMove(delta, speed) {
	return (speed * delta) / 1000;
}

// Device related functions
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