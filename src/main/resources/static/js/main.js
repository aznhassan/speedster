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
/* JSON format for received folders from the server

{
	"folder_id":id,
	"folder_name":name,
	"notes": [{
				"note_id":id,
				"note_name":name
			  },
			  {
				"note_id":id,
				"note_name":name
			  }]
}



*/
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



/* Format to pass back newly created folders to server
	[{
		"folder_id":id,
		"title": this.innerText
	},

	{
		"folder_id":id,
		"title":this.innerText
	}]      

	This folder contains a temporary id

	(This will be sent as stringified JSON)
*/


/* Format to pass back newly created notes to the server
	[{
		"associated_folder_id": folder_id,
		"title": this.innerText
	},
	{
		"associated_folder_id":f_id,
		"title":this.innerText
	}]
	
	(This will be sent as stringified JSON)


	The server will assign it it's note id and also change
	the folder id if needed.

*/
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
	 		folders: JSON.stringify(new_folders),
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

	
	$('#edit_style_button').click(function(event) {
		$('.example_overlay')[0].style.display = "table";
		$('.example_content')[0].style.display = "table-cell";
		createEditStyleDivs();
	});

	
	/**
	 * creates all HTML of the edit styles overlay
	 *
	 */
	function createEditStyleDivs() {
		for(var i = 0; i < fList.length; i++) {
			var style_div = document.createElement('div');
			$('.example_content')[0].appendChild(style_div);
			style_div.className = 'style_div';
			style_div.id = fList[i].folder_id;

			$(style_div).html('<h2 class="folder_style_header">' +  
				fList[i].folder_name +   
				'</h2>' + getStyleHTML('note', fList[i].folder_id) + 
				getStyleHTML('q', fList[i].folder_id));

			$(style_div).find('.font-size').each(function() {
				for(var i = 0; i < 40; i+=2) {
					$(this).append('<option>' + i + '</option>');
				}
			});

			$(style_div).find('h2').text(fList[i].folder_name);
			setTextStyleToggle('note', fList[i].folder_id, 'font-weight');
			setTextStyleToggle('note', fList[i].folder_id, 'font-style');
			setTextStyleToggle('note', fList[i].folder_id, 'text-decoration');
			setTextStyleToggle('q', fList[i].folder_id, 'font-weight');
			setTextStyleToggle('q', fList[i].folder_id, 'font-style');
			setTextStyleToggle('q', fList[i].folder_id, 'text-decoration');


		}
		var style_save_button = document.createElement('div');
		style_save_button.id = "style-save-button";
		style_save_button.innerText = 'SAVE';
		$(style_div)[0].appendChild(style_save_button);
		$(style_save_button).click(function(event) {
			saveStyleClick();
		});

		

	}

	function saveStyleClick() {
		var updated_styles = styleChangesToSave();
		console.log("POST PARAMS: " + JSON.stringify(updated_styles));
		var postParam = {
			styles_on_save: JSON.stringify(updated_styles)
			
		};

		$.post('/updateStyle', postParam, function(responseJSON) {
			// response may be not needed
		});


		$('.example_content')[0].innerHTML = '<h1 id="rule-header">STYLE RULES</h1>';
		$('.example_overlay')[0].style.display = "none";
		$('.example_content')[0].style.display = "none";

	}




/* Sending style editing changes by the user to the server:

{
	"associated_folder":folder_id,
	"style_classes": 
	[{".note": 
		{
			"font-weight":"bold",
			"font-style":"italic",
			"text_decoration":"underline",
			"font-family":"Helvetica"
		}
	 },

	{".q": 
		{
			"font-weight":"bold",
			"font-style":"italic",
			"font-family":"Arial"
		}
	}],
}

*/

/* Here's how the style changes will be found and saved:
 list_of_folder_ids = [1,2,3];
 list_of_styles_texts = ['note', 'q'];
 list_of_style_types = ["bold", "italic", "underline", "font-family"]
*/

function styleChangesToSave() {
	list_of_folder_ids = [1,2];
 	list_of_styles_texts = ['note', 'q'];
	list_of_style_types = ["font-weight", "font-style", "text-decoration", "font-family", "font-size", "text-align"]

	result_list = [];

	for(var i = 0; i < list_of_folder_ids.length; i++) {
		var folder_style = 
		{
			"folder_id": list_of_folder_ids[i],
			"style_classes": []
		}


		for(var j = 0; j < list_of_styles_texts.length; j++) {
			var class_value = String(list_of_styles_texts[j]);
			console.log("VALUE: " + class_value);
			var style_text_object = 
			{

			};

			var container_class = {
				
			};

			container_class[class_value] = style_text_object;

			for(var k = 0; k < list_of_style_types.length; k++) {
				style_text_object[list_of_style_types[k]] = 
					getButtonValue(list_of_styles_texts[j], list_of_style_types[k], list_of_folder_ids[i]);
			}
			folder_style.style_classes.push(container_class);


		}



		result_list.push(folder_style);
	}

	console.log(result_list);
	return result_list;
}

function getButtonValue(style_text, style_type, folder_id) {
	// ex: note2_bold
	if(style_type === 'font-style' || style_type === 'font-weight' || style_type === 'text-decoration') {
		console.log('styleee!!!   ' + $(document.getElementById(style_text + folder_id + '_' + style_type)).attr('value'));
		return $(document.getElementById(style_text + folder_id + '_' + style_type)).attr('value');
	} else if(style_type === 'font-family' || style_type === 'font-size' || style_type === 'text-align') {
		return $(document.getElementById(style_text + folder_id + '_' + style_type)).val();
	}
	
}


/***********************
STYLE PLAN:

One style html:

// pass in style_text --> 'note'
// folder_id --> 1
// style_type --> 'font-weight'
// id for that style button is --> 'note' + folder_id + '_' + 'font-weight';

<h3 class="note_styles">Style for "note:"</h3> \
	<div class="style-toolbar">  \
		<div class="boldButton" id="note_bold" value="off">B</div> \
	 	<div class="italicButton" id="note_italic" value = "off">i</div> \
	  	<div class="underlineButton" id="note_underline" value="off">U</div> \
	  	<select class="font-family" id="note_font">	\
	  		<option value="Arial">Arial</option> \
	  		<option value="Helvetica">Helvetica</option> \
		  	<option value="Sans Serif">Sans Serif</option> \
		  	<option value="Times New Roman">Times New Roman</option> \
	  	</select> \
	</div><br> \





************************/



	function getStyleHTML(style, id) {
		return '<h3 class=' + style + '_styles">Style for ' + style + ': </h3> \
		<div class="style-toolbar">  \
			<div class="boldButton" id="' + style + id + '_font-weight" value="none" name="bold">B</div> \
		 	<div class="italicButton" id="' +  style + id + '_font-style" value = "none" name="italic">i</div> \
		  	<div class="underlineButton" id="' + style + id + '_text-decoration" value="none" name="underline">U</div> \
		  	<select class="font-family" id="' + style + id + '_font-family">	\
		  		<option value="Arial">Arial</option> \
		  		<option value="Helvetica">Helvetica</option> \
			  	<option value="Sans Serif">Sans Serif</option> \
			  	<option value="Times New Roman">Times New Roman</option> \
		  	</select> \
		  	<select class="font-size" id="' + style + id + '_font-size" ></select> \
		  	<select class="text-align" id="' + style + id + '_text-align">	\
		  		<option value="left">left</option> \
		  		<option value="center">center</option> \
		  		<option value="right">right</option> \
		  	</select> \
		</div><br>'

	}

	// eg: style_text == 'note', style_type = 'bold' ... 
	// search for id --> 'note' + 'folder_id' + '_' + 'bold'
	// to be used for B, I, U   .... text styles
	function setTextStyleToggle(style_text, folder_id, style_type) {
		console.log($('.style-toolbar').find('#' + style_text + folder_id + '_' + style_type));
		var button = $('.style-toolbar').find('#' + style_text + folder_id + '_' + style_type);
		if(style_type === 'font-weight' || style_type === 'font-style' || style_type === 'text-decoration') {
			button.click(function(event) {
				if($(this).attr('value') === 'none') {
					var new_val = $(this).attr('name');
					$(this).attr('value', new_val);
					$(this).css('background-color', 'rgba(0,0,0,0.3)');
				} else if($(this).attr('value') === style_type) {
					$(this).attr('value', 'none');
					$(this).css('background','transparent');
				}
				console.log($(this).attr('value'));
			});
		}
		
	}





	// function returnStyleHtml() {
	// 	return '<h2 class="folder_style_header">Style Folder One</h2> \
	// 	<h3 class="note_styles">Style for "note:"</h3> \
	// 	<div class="style-toolbar">  \
	// 		<div class="boldButton" id=' + "note" + "_bold"  + 'value="off">B</div> \
	// 	 	<div class="italicButton" id="note_italic" value = "off">i</div> \
	// 	  	<div class="underlineButton" id="note_underline" value="off">U</div> \
	// 	  	<select class="font-family" id="note_font">	\
	// 	  		<option value="Arial">Arial</option> \
	// 	  		<option value="Helvetica">Helvetica</option> \
	// 		  	<option value="Sans Serif">Sans Serif</option> \
	// 		  	<option value="Times New Roman">Times New Roman</option> \
	// 	  	</select> \
	// 	</div><br> \
	// 	<h3 class="q_styles">Style for "q:/a:"</h3> \
	// 	<div class="style-toolbar">  \
	// 		<div class="boldButton" id="q_bold" value="off">B</div> \
	// 	 	<div class="italicButton" id="q_italic" value = "off">i</div> \
	// 	  	<div class="underlineButton" id="q_underline" value="off">U</div> \
	// 	  	<select class="font-family" id="q_font">	\
	// 	  		<option value="Arial">Arial</option> \
	// 	  		<option value="Helvetica">Helvetica</option> \
	// 		  	<option value="Sans Serif">Sans Serif</option> \
	// 		  	<option value="Times New Roman">Times New Roman</option> \
	// 	  	</select> \
	// 	</div><br>';
	// }


	

});








