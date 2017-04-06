'use strict';
//should move this inside some file
function cutSentence(input) {
	var n = 60;

	if (input != null && input !== '') {
		var array = input.split(' ');
		var len = array.length;

		for (var i = 0; i < len; i++) {
			var a = array[i];

			if (a.length > 9) {
				a = a.substring(0, 8);
				array[i] = a;
			}
		}

		var strFix = array.join(" ");
		if (input.length > n) {
			return strFix.substring(0, n) + "...";
		}
		return strFix;
	}
	return '';
}
