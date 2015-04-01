/** Main class will handle loading the metadata associated with each folder 
 * and note to display clickable titles on the main page.
 * associated with main.ftl fiel
 */

$(document).ready(function() {

	// variables/DOM elements needed
	var editStyleButton = document.getElementById("");


	/**
	 * Handles getting all metadata for folders and within them notes
	 * adding them to the DOM as a list to be displayed/
	 */
	function getAllMetadata() {
		var getParams = {

		}

		$.get("/allNotes", getParams, function(responseJSON) {
			var responseObject = JSON.parse(responseJSON);
			
			// assuming server returns 'List<JSONStrings> folders'.
			var folders = responseObject.folder;

			
			for (var i = 0; i < folders.length; i++) {
				// #TODO: display folders.get(i).name with folder click handler

				// assuming a List<JSONString> of notes metadat associated with this folder
				var notes = folders.get(i).notes;

				for (var j = 0; j < notes.length; j++) {
					// #TODO: display notes.get(j).name with note click handler
				}
			}
		});
	}

	/**
	 * Click handler for folder name
	 */
	function folderClick(id) {
		// #TODO
	}

	/**
	 * Click handler for note name
	 */
	function noteClick(id) {
		// #TODO: send get request for the whole note and load a new page with the note.
		// this was "getNote/:id" in our note.js stencil, not sure how to abstract this out to the
		// other class since we need to attach a click handler to the name here ?

		// load note.ftl, which has note.js linked in it.
		var getParams = {

		}

		$.get("/getNote/:id", getParams, function(responseHTML)) {
			// reponseHTML should be the note.ftl file
			// which has note.js linked in it so that can deal with the specifics of this note
		}
	}

	/**
	 * Click handler for the edit style button
	 */
	 $(editStyleButton).click(function(event) {
	 	// #TODO: open style edit pop-up
	 });

});








