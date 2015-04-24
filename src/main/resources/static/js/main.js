/** Main class will handle loading the metadata associated with each folder 
 * and note to display clickable titles on the main page.
 * associated with main.ftl fiel
 */


 

$(document).ready(function() {

    // variables/DOM elements needed
    // var editStyleButton = document.getElementById("");
    var folder_num_counter = 0;
    var prevEditingHTML = null;

    
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
            createFlashcardDiv(folder_div);
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

     /**
      * Helper function to create the 'add section + sign button'
      */
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


     /**
      * Helper function to create flashcard button
      */
    function createFlashcardDiv(folderDiv) {
        var circle = document.createElement('div');
        circle.className = 'circle';
        circle.innerHTML = 'F';
        folderDiv.appendChild(circle);
        $(circle).attr('contenteditable', 'false');
        $(circle).click(function(event) {
            window.location.replace("/flashcard/" + folderDiv.id);
        });
    }


    /**
     * Helper function to create collapsible icon for the editing menu
     */
    function createCollapsibleButton() {
        var circle = document.createElement('div');
        circle.className = 'circle';
        circle.innerHTML = '+';
        return circle;
    }


     /**
      * Add a new editable note title div when a user adds one,
      */
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
    /**
     * click handler for the save changes button on the main page
     * sends information in the above format about new folders
     * and notes to the server.
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
            window.location.replace('/notes');
        });


     }

     // attach the click handler to the button
     $('#save-button').click(function(event) {
        saveClick();
     });


     /**
      * click handler for the add new section button
      */
    function addSectionClick() {
        var new_folder_div = document.createElement("div");
        new_folder_div.className = "new_folder_name_div";
        new_folder_div.innerHTML = "NEW FOLDER";
        new_folder_div.id = folder_num_counter + 1;
        $(new_folder_div).attr('contenteditable', 'true');
        createCircleDiv(new_folder_div);
        createFlashcardDiv(new_folder_div);
        $('#main-div').append(new_folder_div);
        folder_num_counter++;

    }

    // attach handler to the button
    $('#add_section_button').click(function(event) {
        addSectionClick();
    });

    // handler for the edit style button on the main page,
    // displays the style edit overlay
    $('#edit_style_button').click(function(event) {
        $('.example_overlay')[0].style.display = "table";
        $('.example_content')[0].style.display = "table-cell";
        createEditStyleDivs();
    });

/************************************
 * STYLE EDITING OVERLAY
 ************************************/

    /**
     * creates all HTML of the edit styles overlay
     * 
     */
    function createEditStyleDivs() {
        // for each existing folder
        for(var i = 0; i < fList.length; i++) {
            // create a style div
            var style_div = document.createElement('div');
            $('.example_content')[0].appendChild(style_div);
            style_div.className = 'style_div';
            style_div.id = fList[i].folder_id;
            

            // for each folder's style div, create a toolbar per style text to be edited

            /* $(style_div).html('<h2 class="folder_style_header">' +  
                fList[i].folder_name +   
                '</h2>' + getStyleHTML('note', fList[i].folder_id) + 
                getStyleHTML('q', fList[i].folder_id) + getStyleHTML('section', fList[i].folder_id)); */
            
            $(style_div).html('<span class="folder_style_header">' +   
            fList[i].folder_name + '<span class="circle"> + </span>' + 
            '</span>' + '<div class="inner_style_div" id="inner_style_div_' + fList[i].folder_id + '">' + getStyleHTML('note', fList[i].folder_id) + 
            getStyleHTML('q', fList[i].folder_id) + getStyleHTML('section', fList[i].folder_id) + '</div>'); 

          
           
            var inner = $(style_div).find('#inner_style_div_' + fList[i].folder_id);
            $(style_div).find('.circle').bind('click', {id: fList[i].folder_id}, function(event) {
                var folderID = event.data.id;
                var divToCollapse = document.getElementById('inner_style_div_' + folderID);
                $(divToCollapse).slideToggle();
//                 alert(this.innerText === '+');
                if(this.innerText === "+") {
//                     alert("ugh");
                    this.innerText = "-";
                } else {
                    this.innerText = "+";
                }
            });

            // append font sizes to the font size dropdowns
            $(style_div).find('.font-size').each(function() {
                for(var i = 0; i < 40; i+=2) {
                    $(this).append('<option>' + i + '</option>');
                }
            });

            // set up toggling values on click for the B, I, U styles
            $(style_div).find('h2').text(fList[i].folder_name);
            setTextStyleToggle('note', fList[i].folder_id, 'font-weight');
            setTextStyleToggle('note', fList[i].folder_id, 'font-style');
            setTextStyleToggle('note', fList[i].folder_id, 'text-decoration');
            setTextStyleToggle('q', fList[i].folder_id, 'font-weight');
            setTextStyleToggle('q', fList[i].folder_id, 'font-style');
            setTextStyleToggle('q', fList[i].folder_id, 'text-decoration');
            setTextStyleToggle('section', fList[i].folder_id, 'font-weight');
            setTextStyleToggle('section', fList[i].folder_id, 'font-style');
            setTextStyleToggle('section', fList[i].folder_id, 'text-decoration');

        }

        // add in a save styles button
        var style_save_button = document.createElement('div');
        style_save_button.id = "style-save-button";
        style_save_button.innerText = 'SAVE';
        $(style_div)[0].appendChild(style_save_button);

        // attach click handler to the save style button
        $(style_save_button).click(function(event) {
            saveStyleClick();
        });

  
    }




   /**
    * attempting collapsing
    */
    function collapsingFolderStyleMenu() {
        for(var i = 0; i < fList.length; i++) {
            var style_div = document.getElementById(fList[i].folder_id);
            console.log("I'm trying to collapse:    "  + $(style_div)[0]);
        }
    }

    /**
     * Click handler for the save styles button
     * Sends updated styles to the server as a JSON string
     * in a POST request '/updateStyle'.
     */
    function saveStyleClick() {
        var updated_styles = styleChangesToSave();
        console.log("POST PARAMS: " + JSON.stringify(updated_styles));
        var postParam = {
            styles_on_save: JSON.stringify(updated_styles)
            
        };

        $.post('/updateStyle', postParam, function(responseJSON) {
            // response may be not needed
        });

        // clear the style editing overlay
        prevEditingHTML = $('.example_content').html();
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
 list_of_styles_texts = ['note', 'q', ...];
 list_of_style_types = ["bold", "italic", "underline", "font-family", ...]
*/

/** 
 * gets all the updated CSS that needs to be sent ot the server on clicking the save styles button
 */
function styleChangesToSave() {

    // list of all existing folder ids, existing rules to style, existing styles possible to change
    list_of_folder_ids = [1,2];
    list_of_styles_texts = ['note', 'q', 'section'];
    list_of_style_types = ["font-weight", "font-style", "text-decoration", "font-family", "font-size", "text-align"]

    // this will contain all the info to be sent to the server.
    result_list = [];

    // go over all the folder ids
    for(var i = 0; i < list_of_folder_ids.length; i++) {

        // create a style object for each folder
        var folder_style = 
        {
            "folder_id": list_of_folder_ids[i],
            "style_classes": []
        }

        // go over all possible rules to style for the folder
        for(var j = 0; j < list_of_styles_texts.length; j++) {

            // set a rule string to map the styles to
            var class_value = String(list_of_styles_texts[j]);
            console.log("VALUE: " + class_value);

            // create a styles object for this folder and this rule
            var style_text_object = 
            {

            };

            // container class object to map the rule to it's style object
            var container_class = {
                
            };

            // map the rule to it's style object
            container_class[class_value] = style_text_object;

            // fill in the style object with all the styles' current values as of on clicking the save button
            for(var k = 0; k < list_of_style_types.length; k++) {
                style_text_object[list_of_style_types[k]] = 
                    getButtonValue(list_of_styles_texts[j], list_of_style_types[k], list_of_folder_ids[i]);
            }

            // add the updates to the style object for this rule
            folder_style.style_classes.push(container_class);

        }

        // store everything in the results list
        result_list.push(folder_style);
    }

    console.log(result_list);
    return result_list;
}

/**
 * get the value for the styling toolbar buttons according to their unique id
 * on clicking the save style button, so we can updates for each style
 */
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
        <select class="font-family" id="note_font"> \
            <option value="Arial">Arial</option> \
            <option value="Helvetica">Helvetica</option> \
            <option value="Sans Serif">Sans Serif</option> \
            <option value="Times New Roman">Times New Roman</option> \
        </select> \
    </div><br> \





************************/


    /**
     * given a rule to style, and the folder id, this creates the toolbar
     * for that folder and that rule with unique ids that include the folder id
     * and the rule word itself.
     * ex: getStyleHTML('note', 2)
     * or, getstyleHTML('q', 3);
     *
     */
    function getStyleHTML(style, id) {
        return '<h3 class=' + style + '_styles">Style for ' + style + ': </h3> \
        <div class="style-toolbar" id="toolbar_' + style + id + '">  \
            <div class="boldButton" id="' + style + id + '_font-weight" value="none" name="bold">B</div> \
            <div class="italicButton" id="' +  style + id + '_font-style" value = "none" name="italic">i</div> \
            <div class="underlineButton" id="' + style + id + '_text-decoration" value="none" name="underline">U</div> \
            <select class="font-family" id="' + style + id + '_font-family">    \
                <option value="Arial">Arial</option> \
                <option value="Helvetica">Helvetica</option> \
                <option value="Sans Serif">Sans Serif</option> \
                <option value="Times New Roman">Times New Roman</option> \
            </select> \
            <select class="font-size" id="' + style + id + '_font-size" ></select> \
            <select class="text-align" id="' + style + id + '_text-align">  \
                <option value="left">left</option> \
                <option value="center">center</option> \
                <option value="right">right</option> \
            </select> \
        </div><br>'

    }

    // eg: style_text == 'note', style_type = 'bold' ... 
    // search for id --> 'note' + 'folder_id' + '_' + 'bold'
    // to be used for B, I, U   .... text styles
    // sets up the toggling of values for the B, I, U styles (or any others that can have only two states)
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
                    console.log("HELLO");
                    $(this).attr('value', 'none');
                    $(this).css('background','rgba(255,255,255,0.8');
                }
                console.log($(this).attr('value'));
            });
        }
        
    }

});







