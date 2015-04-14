/** Main class will handle loading the metadata associated with each folder 
 * and note to display clickable titles on the main page.
 * associated with main.ftl fiel
 */

$(document).ready(function() {

	// variables/DOM elements needed
	// var editStyleButton = document.getElementById("");
	var folder_num_counter = 0;

	/**************************************
	 * TESTING JSON STRINGS FOR MAIN PAGE
	 *************************************/
	 var folderOne = {
	 	"folder_id":1,
	 	"folder_name": "CS 22: Discrete Structures and Probabilty",
	 	"notes": [{"note_id":1, "note_name": "Bayes Law"}, 
	 	          {"note_id":2, "note_name": "Graph Colouring"}]
	 };

	 var folderTwo = {
	 	"folder_id":2,
	 	"folder_name": "POBS 990: Mapping Cross Cultural Boundaries",
	 	"notes": [{"note_id":3, "note_name": "Interpreter of Maladies"},
	 			  {"note_id":4, "note_name": "In the time of Butterflies"}]
	 };

	 var fList = [folderOne, folderTwo];

	 folder_num_counter = fList.length;

	/**
	 * Handles getting all metadata for folders and within them notes
	 * adding them to the DOM as a list to be displayed/
	 */
	function getAllMetadata() {
		var getParams = {

		}

		$.get("/notes", getParams, function(responseJSON) {
			// var responseObject = JSON.parse(responseJSON);
			
			// assuming server returns 'List<JSONStrings> folders'.
			// var folders = responseObject.folder;
			var folders = fList;
			// alert("CALLBACK");
			
			displayTitles(folders);
		});
	}


	getAllMetadata();


	/**
	 * Display note and folder titles on the DOM
	 */
	 function displayTitles(folderList) {
	 	
	 	for(var i = 0; i < folderList.length; i++) {
	 		var folder_div = document.createElement("div");
	 		folder_div.className = "folder_name_div";
	 		folder_div.id = folderList[i].folder_id;
	 		console.log("DATA: " + folderList[i]);
	 		$(folder_div).attr('data-folder',folderList[i]);
	 		folder_div.innerHTML = folderList[i].folder_name;
	 		createCircleDiv(folder_div);
	 		for(var j = 0; j < folderList[i].notes.length; j++) {
	 			var notes_div = document.createElement("div");
	 			notes_div.className = "note_name_div";
	 			notes_div.id = folderList[i].notes[j].note_id;
	 			notes_div.innerHTML = folderList[i].notes[j].note_name;
	 			folder_div.appendChild(notes_div);
	 			$(notes_div).click(function(event) {
	 				console.log("NOTE ID: " + this.id);
	 				window.location.replace("/getNote/" + this.id);
	 			});
	 		}
	 		$('#main-div').append(folder_div);
	 	}
	 }


	 function createCircleDiv(folderDiv) {
	 	var circle = document.createElement("div");
	 	circle.className = "circle";
	 	circle.innerHTML = "+";
	 	folderDiv.appendChild(circle);
	 	$(circle).attr('contenteditable','false');
	 	$(circle).click(function(event) {
	 		createNewNote(folderDiv);
	 		
	 		// #TODO: send info about the new note to server.
	 	});
	 }


	 function createNewNote(folderDiv) {
	 	var new_note_div = document.createElement("div");
 		new_note_div.className = "new_note_name_div";
 		$(new_note_div).attr('contenteditable','true');
 		new_note_div.id = folderDiv.id;
 		console.log("NEW NOTE ID: " + new_note_div.id);
 		new_note_div.innerHTML = "NEW  NOTE";
 		folderDiv.appendChild(new_note_div);
 		
	 }

	 function saveClick() {
	 	/* Find all new folders added */
	 	console.log($(document).find('.new_folder_name_div'));
	 	var new_folders = [];
	 	$('.new_folder_name_div').each(function(j) {
	 		this.id = fList.length + 1;
	 		var folder_data = {
	 			"folder_id": this.id,
	 			"title": this.innerText
	 		}

	 	});

	 	/* Find all new notes */
	 	console.log($(document).find('.new_note_name_div'));
	 	var newNotes = [];
	 	$('.new_note_name_div').each(function(i) {
	 		var noteData = {
	 			"associated_folder_id":this.id,
	 			"title":this.innerText
			}
			console.log("NOTE DATA :::: " + noteData);
	 		newNotes.push(noteData);
	 	});
	 	console.log(newNotes);
	 	// POST REQUEST TO SERVER INFORMING OF NEW NOTE(S)
	 	var postParam = {
	 		notes: JSON.stringify(newNotes)
	 	}
	 	$.post("/updateNotes", postParam, function(responseObject) {

	 	});
	 }

	 $('#save-button').click(function(event) {
	 	saveClick();
	 });



	function addSectionClick() {
		var new_folder_div = document.createElement("div");
		new_folder_div.className = "new_folder_name_div";
		new_folder_div.innerHTML = "NEW FOLDER";
		new_folder_div.id = folder_num_counter + 1;
		$(new_folder_div).attr('contenteditable', 'true');
		createCircleDiv(new_folder_div);
		$('#main-div').append(new_folder_div);
		folder_num_counter++;

	}

	$('#add_section_button').click(function(event) {
		addSectionClick();
	});

	

});








