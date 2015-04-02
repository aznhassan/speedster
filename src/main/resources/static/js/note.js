/**
 * Handles the particular full note page
 * associated with note.ftl file
 */

 $(document).ready(function() {

 	// load autocomplete suggestions on every keyup
 	var postParams = {

 	}
 	$.post("/words", postParams, function(responseList) {
 		// #TODO: populate a drop-down with words from the responseList
 	});

 });