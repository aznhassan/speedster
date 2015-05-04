/** 
 * Main file for the program's dynamic UI interactions
 * @author sm15

 * main.js handles:
   - Loading the metadata on the main notes page
   - Functionality to add new folders and new notes on the main page
   - Functionality to delete notes and folders
   - Links to appropriate flashcard page
   - Links to the note pages of all notes
   - Style menu overlay where users can define custom rules by folder

 * Style overlay functionality overview:
   - Lets users add new styles ny folder
   - Can delete existing styles
   - Each new style form features optional additional styling for text after the rule trigger word.

 * Request handlers:

    # TODO

 */


//       /[^\/<>&#;]*/.test(str);  // true if string is valid , else false.




$(document).ready(function() {

    // variables/DOM elements needed
    var prevEditingHTML = null;             // prev HTML of the style overlay
    var foldersList = [];                   // global list of existing folders
    var validRegex = /[^\/<>&#;]*/;         // regex to test for valid user input, returns true if string is valid
                                            // i.e without any of the characters specified in the regex.    
    var invalidRegex = /[\/<>&#;]/;

    /**
     * Handles getting all metadata for folders and within them notes
     * adding them to the DOM as a list to be displayed
     * The JSON format for any folder object in the folder list:

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
    (function getAllMetadata() {
        $.get("/notes", function(responseJSON) {
        // var responseObject = JSON.parse(responseJSON);
        
        // assuming server returns 'List<JSONStrings> folders'.
        // var folders = responseObject.folder;
        var folders = foldersList;
        var json = $(".data");
        var jsonArray = JSON.parse(json.text());
        foldersList = jsonArray;
        displayTitles(jsonArray);
    });
    })();



    /**
     * Handles creating the DOM elements for displaying
     * folder and note titles on the main page

     */
    function displayTitles() {

        // go over the list of folders
        for(var i = 0; i < foldersList.length; i++) {

            // create the folder name div
            var folder_div = document.createElement("div");
            folder_div.className = "folder_name_div";
            folder_div.id = foldersList[i].folder_id;
            $(folder_div).attr('data-folder',foldersList[i]);

            // header span to hold folder title
            var header_span = document.createElement('div');
            header_span.className = 'folder_header_span';
            header_span.innerHTML = '<span class="title">' + foldersList[i].folder_name + '</span>';
            $(folder_div).html(header_span);

            // append the + icon, delete icon and flashcard icon
            createCircleDiv(folder_div, header_span);
            $(header_span).append('<div class="delete_icon" id="delete_icon_' + foldersList[i].folder_id + '"></div>');
            createFlashcardDiv(header_span, foldersList[i].folder_name);
            $(header_span).append('<br>');

            // set icon visibililty on hover
            $(header_span).hover(function() {
                $(this).find('.delete_icon')[0].style.visibility = 'visible';
                $(this).find('.flashcard_icon')[0].style.visibility = 'visible';

            }, function() {
                $(this).find('.delete_icon')[0].style.visibility = 'hidden';
                $(this).find('.flashcard_icon')[0].style.visibility = 'hidden';
            });

            // create a main div for each folder to hold it's note titles
            main_note_div = document.createElement('main_note_div');
            main_note_div.className = 'main_note_div';
            folder_div.appendChild(main_note_div);

            // bind click handler to delete icon
            // sends post request to delete the folder.
            var deleteParam = {
                div: folder_div, 
                name: foldersList[i].folder_name, 
                id: foldersList[i].folder_id
            };

            $(folder_div).find('.delete_icon').bind('click', deleteParam, function(event) {
                var postParam = {
                    folder: event.data.name
                }
                
                $.post('/deleteFolder', postParam, function(responseJSON) {
                    $(event.data.div).remove();

                    // get an updated list of folders from the server and update the jS global list.
                    $.get('/moreNotes', postParam, function(responseJSON) {
                        foldersList = JSON.parse(responseJSON);
                    });
                });
            });

            // iterate over the notes for this folder and add them to the DOM
            for(var j = 0; j < foldersList[i].notes.length; j++) {

                // create divs for the note titles 
                var notes_div = document.createElement("div");
                notes_div.className = "note_name_div";
                notes_div.id = foldersList[i].notes[j].note_id;
                notes_div.innerHTML = '<span class="note_name">' + foldersList[i].notes[j].note_name + '</span>';

                // add delete icon
                $(notes_div).append('<div class="delete_icon delete_icon_notes" id="delete_icon_' + notes_div.id + '"></div>');
                main_note_div.appendChild(notes_div);

                // bind click handler that redirects clicking the note name div to the note itself
                // the note opens in a separate tab.
                $(notes_div).bind('click', {name: foldersList[i].folder_name}, function(event) {
                    //window.open('/getNote/' + event.data.name + "/" +  this.id, '_blank');
                    window.location.href = '/getNote/' + event.data.name + "/" +  this.id, '_blank';
                });

                var deleteParam = {
                    main_div: main_note_div, 
                    div: notes_div, 
                    id: foldersList[i].notes[j].note_id, 
                    folder: foldersList[i].folder_name
                }

                // bind click handler for note deletion
                $(notes_div).find('.delete_icon').bind('click', deleteParam, function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var postParam = {
                        note_id: event.data.id,
                        subject: event.data.folder
                    }

                    // sends post request to server to delete the note and updates the DOM
                    $.post('/deleteNote', postParam, function(responseJSON) {
                        $(event.data.div).remove();
                        if(event.data.main_div.innerHTML === "") {
                            $(event.data.main_div).slideUp('fast');
                        }
                    });
                });

                $(notes_div).hover(function() {
                    $(this).find('.delete_icon').css({'visibility':'visible'}); 
                },function() {
                    $(this).find('.delete_icon').css({'visibility':'hidden'}); 
                });
            }

            // the list of notes is collapsed display by default.
            if(main_note_div) {
                $(main_note_div)[0].style.display='none';
            }
            
            // notes list can be toggled into display by clicking the folder title
            $(folder_div).find('.title').bind('click', {notes: main_note_div}, function(event) {
                if(event.data.notes.innerHTML !== "") {
                    $(event.data.notes).slideToggle(175);
                }
            });

            $('#main-div').append(folder_div);
        }
    }

    /**
     * Helper function to create the 'add section + sign button'
     * @param main div of the folder
     * @param header holding the folder title
     */
    function createCircleDiv(folderDiv, header_span) {
        var circle = document.createElement("div");
        circle.className = "circle_image";
        header_span.appendChild(circle);
        $(circle).click(function(event) {
            createNewNote(folderDiv);
        });
    }


     /**
      * Helper function to create flashcard 'REVIEW' button
      * @param main div of the folder name
      * @param name of the folder.
      */
    function createFlashcardDiv(folderDiv, folderName) {
        var flashcardIcon = document.createElement('div');
        flashcardIcon.innerText = 'REVIEW';
        flashcardIcon.className = 'flashcard_icon';
        folderDiv.appendChild(flashcardIcon);
        $(flashcardIcon).attr('contenteditable', 'false');
        $(flashcardIcon).click(function(event) {
            window.open('/getNewSession/' + encodeURIComponent(folderName), '_blank');
        });
    }



    /**
     * Adds an input field when user clicks the '+' icon on a folder
     * Once the server creates the note and the request is completed
     * The input field turns into a non-editable div title
     * The title can be changed by going into the note and changing the note title
     * @param main div of the folder title
     * @param header span that holds the title of the folder
     */
    function createNewNote(folderDiv, header_span) {

        // create new note
        var new_note_div = document.createElement("div");
        new_note_div.className = "new_note_name_div";
        $(new_note_div).html('<input type="text" class="note_title note_title_input" placeholder="NOTE NAME" maxlength="30"></input>');
        $(new_note_div).find('.note_title').attr('contenteditable','true');
        $(new_note_div).attr('folder', $(folderDiv).find('.title')[0].innerText);
        new_note_div.id = -1;
        
        // append to the folder's main note div
        $(new_note_div).append('<div class="delete_icon" id="delete_icon_' + -1 + '"></div>');
        folderDiv.appendChild(new_note_div);

        // triggers the saving action bound to focusput on enter key press.
        $(new_note_div).find('.note_title').keyup(function(event) {
            if(event.keyCode === 13 || event.which === 13) {
               $(new_note_div).find('.note_title').trigger('focusout');
            }
        });

        // saves note if user focuses out of the note name input
        $(new_note_div).find('.note_title').focusout(function() {
            if(this.value !== "") {
                var postParam = {
                    folder_id :folderDiv.id,
                    folder_name : $(folderDiv).find('.title')[0].innerText,
                    note_id : -1,
                    note_name : this.value
                };

                // post request to save the note
                $.post('/newNote', postParam, function(responseJSON) {
                    var responseObject = JSON.parse(responseJSON);
                    // convert the text input to an actual div with the delete icon
                    $(new_note_div).removeClass('new_note_name_div');
                    $(new_note_div).html('<span class="note_name">' + postParam.note_name + '</span>');
                    $(new_note_div).addClass('note_name_div');
                    new_note_div.id = responseObject.note_id;
                    $(new_note_div).append('<div class="delete_icon delete_icon_notes" id="delete_icon_' + new_note_div.id + '"></div>');
                    
                    // bind click handler to redirect to the note page.
                    $(new_note_div).bind('click', {name: postParam.folder_name}, function(event) {
                        //window.open('/getNote/' + event.data.name + "/" +  this.id, '_blank');
                        window.location.href = '/getNote/' + event.data.name + "/" +  this.id, '_blank';
                    });

                    // binds click handler to the delete icon
                    $(new_note_div).find('.delete_icon').bind('click', {folder_div: folderDiv, div: new_note_div, folder: postParam.folder_name}, function(event) {
                        event.stopPropagation();
                        event.preventDefault();
                        var postParam = {
                            note_id: this.id,
                            subject: event.data.folder
                        }

                        // post request for note deletion
                        $.post('/deleteNote', postParam, function(responseJSON) {
                            event.preventDefault();
                            event.stopPropagation();
                            $(event.data.div).remove();
                            if($(event.data.folder_div).find('.main_note_div')[0].innerHTML === "") {
                                $(event.data.folder_div).find('.main_note_div').slideUp('fast');
                            }

                        });
                    });

                    // set hover handler to see the delete icon
                    $(new_note_div).hover(function() {
                        $(this).find('.delete_icon').css({'visibility':'visible'}); 
                    },function() {
                        $(this).find('.delete_icon').css({'visibility':'hidden'}); 
                    });
                    /// add the div to the note div of the folder.
                    $(folderDiv).find('.main_note_div').append(new_note_div);
                });

            }

        }); 
    }

    /**
     * Click handler for the 'NEW SUBJECT' button
     * Adds an input box for the user to type a folder name
     * Saves the folder on focusout or enter key press and updates folder list
     * also updates the DOM with the new folder.
     */
    function addSectionClick() {
        // create a new folder div
        var new_folder_div = document.createElement("div");
        var header_span = document.createElement('div');
        header_span.className = 'folder_header_span_new';
        $(new_folder_div).html(header_span);
        new_folder_div.className = "new_folder_name_div";
        header_span.innerHTML = '<input class="title title_note" maxlength="30" placeholder="NEW FOLDER" maxlength="30" autofocus="true"></input>';

        // add enter key handler to triggger the focus out event to
        // save the folder
        $(new_folder_div).find('.title').focus();
        $(new_folder_div).find('.title').keyup(function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                $(new_folder_div).find('.title').trigger('focusout');
            }
        });

        // add focusout handler to save the input box to save the folder and
        // update the DOM to reflect the changes.
        $(new_folder_div).find('.title').focusout(function() {
            if(this.value !== "") {
                var folder_data = {
                    "folder_id": -1,
                    "title": this.value
                };

                // sends get request with folder name and recieves updates
                // from the server.
                $.get('/newFolder', folder_data, function(responseJSON) {

                    // create a title div for the folder name.
                    var responseObject = JSON.parse(responseJSON);
                    var folder_id = responseObject.id;
                    var folder_name = responseObject.title;
                    new_folder_div.id = folder_id;
                    header_span.innerHTML = '<span class="title">' + folder_name + '<span>'; 
                    $(header_span).removeClass('folder_header_span_new');
                    header_span.className = 'folder_header_span';
                    $(new_folder_div).html(header_span);

                    // add the icons to the div
                    createCircleDiv(new_folder_div, header_span);
                    $(header_span).append('<div class="delete_icon" id="delete_icon_' + folder_id + '"></div>');
                    createFlashcardDiv(header_span, folder_name);
                    $(header_span).append('<br>');

                    // add hover handler to toggle visibility of the icons.
                    $(header_span).hover(function() {
                        $(this).find('.delete_icon')[0].style.visibility = 'visible';
                        $(this).find('.flashcard_icon')[0].style.visibility = 'visible';

                    }, function() {
                        $(this).find('.delete_icon')[0].style.visibility = 'hidden';
                        $(this).find('.flashcard_icon')[0].style.visibility = 'hidden';
                    });

                    $(new_folder_div).removeClass('new_folder_name_div');
                    $(new_folder_div).addClass('folder_name_div');

                    // add the note div to the folder.
                    var main_note_div = document.createElement('div');
                    main_note_div.className = 'main_note_div';
                    new_folder_div.appendChild(main_note_div);

                    // toggle the display of the note div
                    $(new_folder_div).find('.title').bind('click', {notes: main_note_div}, function(event) {
                        if(event.data.notes.innerHTML !== "") {
                            $(event.data.notes).slideToggle(175);
                        }
                    });

                    // binds a click handler to the delete icon
                    $(new_folder_div).find('.delete_icon').bind('click', {div: new_folder_div, name: folder_name, id: folder_id}, function(event) {
                        var postParam = {
                            folder: event.data.name
                        }
                
                        // updates the server about the deleted folder
                        $.post('/deleteFolder', postParam, function(responseJSON) {
                            $(event.data.div).remove();

                            // requests for an updated list of folders.
                            $.get('/moreNotes', postParam, function(responseJSON) {
                                var responseObject = JSON.parse(responseJSON);
                                foldersList = responseObject;
                            });

                        });
                    });

                    // updates for the folder list.
                    $.get('/moreNotes', function(responseJSON) {
                        var responseObject= JSON.parse(responseJSON);
                        foldersList = responseObject;
                    });
                });
            }
        });
       
        $('#main-div').append(new_folder_div);
    }

    // attach click handler to 'NEW SUBJECT' button
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
     ************************************
     * STYLE EDITING OVERLAY STUFF ******
     ************************************
     ************************************/

    /**
     * Creates DOM for the rule editing overlay.
     * 
     */
     function createEditStyleDivs() {
        // for each existing folder
        for(var i = 0; i < foldersList.length; i++) {
            // create a style div
            var style_div = document.createElement('div');
            var id = foldersList[i].folder_id;
            $('.example_content')[0].appendChild(style_div);
            style_div.className = 'style_div';
            style_div.id = id;

            // HTML for a new style blank form.
            $(style_div).html('<span class="folder_style_header">' +   
                '<span class="circle collapse-main arrow-right" id="collapse-main_' + id + '"></span>' + '<span>' + '       ' + 
                foldersList[i].folder_name  + '</span>' + 
                '<div class="inner_style_div" id="inner_style_div_' + id + '">' + 
                '<span class="new-style-header-to-add"> New Style <span class="circle_image" id="style-circle"></span></span>' + 
                '<div class="rule_div" id="rule_div_' + id + '">' +
                'Rule <input type="text" class="rulename" placeholder="Name" id="rulename_' + id + '" maxlength="20"></input><br>    \
                should start with \
                <input type="text" class="rulestart" id="rulestart_' + id + '" placeholder="Character String" maxlength="15"></input>   \
                <span class="invalid_input" id="invalid_input_rulestart_' + id +'">Invalid input!</span><br>  \
                and have these styles: <br>' + 
                createStyleToolbar('start-style-bar', id, "") + 
                '<span class="extra_styles_title" id="extra_styles_title_' + id + '">   \
                <span class="circle additional-style-collapse arrow-right"><span class="arrow-down"></span></span>' +
                '  Additional Styles</span><br>' +
                '<div class="extra_styles_div" id="extra_styles_div_' + id + '"><span>Extend these styles until</span><br>'  
                + '<input type="text" class="trigger-end-sequence" id="trigger-end-sequence_' + id + '" placeholder = "Character String" maxlength="10"></input>  OR '
                + '<input type="checkbox" class="newline-trigger" id="newline-trigger_' + id + '"></input>  Newline   ' +
                '<span class="invalid_input" id="invalid_trigger_after_' + id + '">Invalid Input!</span><br><br>' +
                'Style text after this rule until<br>'
                + '<input type="text" class="text-after-end-sequence" id="text-after-end-sequence_' + id + '" placeholder = "Character String" maxlength="10"></input>  OR \
                <input type="checkbox" class="newline-text-after" id="newline-text-after_' + id + '"></input>  Newline   ' + 
                '<span class="invalid_input" id="invalid_text_after_' + id + '">Invalid Input!</span><br>' + 
                '<span style="margin-left:3%" id="span_to_toggle_' + id + '">with these styles</span> <br>' 
                + createStyleToolbar('text-after-style-bar', id, "") +
                '<input type="checkbox" name="boxed" value="box" class="box" id="box_' + id + '"></input>  Box this rule<br>' +
                '<input type="checkbox" name="centered" value="center" class="center" id="center_' + id + '"></input>  \
                Center this rule<br><br></div><br>' +
                '<input type="button" class="submit-button" id="submit_' + id + '" value="SAVE"></input>' + 
                '</div>' + 
                '</div>'); 
            
            // hide invalid input text visibility
            $('#invalid_input_rulestart_' + id)[0].style.visibility = "hidden";
            $('#invalid_trigger_after_' + id)[0].style.visibility = "hidden"
            $('#invalid_text_after_' + id)[0].style.visibility = "hidden";

            // filter invalid input for the rule start string
           
            $('#rulestart_' + id).on('keyup', {id: id}, function(event) {
                var currString = this.value;
                if(currString.search(invalidRegex) !== -1) {
                   $('#invalid_input_rulestart_' + event.data.id)[0].style.visibility = "visible"; 
                   $('#submit_' + event.data.id)[0].disabled = true;
                } else {
                    $('#invalid_input_rulestart_' + event.data.id)[0].style.visibility = "hidden"; 
                    $('#submit_' + event.data.id)[0].disabled = false;
                }
            });

            // filter invalid input for the 'extend these styles until' input
            $('#trigger-end-sequence_' + id).on('keyup', {id: id}, function(event) {
                var currString = this.value;
                if(currString.search(invalidRegex) !== -1) {
                    $('#invalid_trigger_after_' + event.data.id)[0].style.visibility = "visible";
                    $('#submit_' + event.data.id)[0].disabled = true;
                } else {
                    $('#invalid_trigger_after_' + event.data.id)[0].style.visibility = "hidden";
                    $('#submit_' + event.data.id)[0].disabled = false;
                }
            });

            // filter invalid input for the text after 'style text after with' input
            $('#text-after-end-sequence_' + id).on('keyup', {id: id}, function(event) {
                var currString = this.value;
                if(currString.search(invalidRegex) !== -1) {
                    $('#invalid_text_after_' + event.data.id)[0].style.visibility = "visible";
                    $('#submit_' + event.data.id)[0].disabled = true;
                    $('#toolbar_text-after-style-bar' + event.data.id)[0].style.visibility = "hidden";
                    $('#span_to_toggle_' + event.data.id)[0].style.visibility = "hidden";
                } else {
                    $('#invalid_text_after_' + event.data.id)[0].style.visibility = "hidden";
                    $('#submit_' + event.data.id)[0].disabled = false;
                    $('#toolbar_text-after-style-bar' + event.data.id)[0].style.visibility = "visible";
                    $('#span_to_toggle_' + event.data.id)[0].style.visibility = "visible";
                }
            });

            // click handler for the newline options, disables the input box if newline box is checked
            $('#newline-trigger_' + id).bind('click', {id: foldersList[i].folder_id }, function(event) {
                if(this.checked) {
                    $('#trigger-end-sequence_' + event.data.id)[0].disabled = true;
                } else {
                    $('#trigger-end-sequence_' + event.data.id)[0].disabled = false;
                }
            });

            //click handler for disabling text after input if newline box is checked
            $('#newline-text-after_' + id).bind('click', {id: foldersList[i].folder_id }, function(event) {
                if(this.checked) {
                    $('#text-after-end-sequence_' + event.data.id)[0].disabled = true;
                    $('#toolbar_text-after-style-bar' + event.data.id)[0].style.visibility = "visible";
                    $('#span_to_toggle_' + event.data.id)[0].style.visibility = "visible";
                } else {
                    $('#text-after-end-sequence_' + event.data.id)[0].disabled = false;
                    if($('#text-after-end-sequence_' + event.data.id)[0].value === "") {
                        $('#toolbar_text-after-style-bar' + event.data.id)[0].style.visibility = "hidden";
                        $('#span_to_toggle_' + event.data.id)[0].style.visibility = "hidden";
                    }
                }
            });

            // toggles visibility of the styling menu after the text-after endSeq input
            // the endSeq cannot be styled unless there is an endSeq specified by the user.
            $('#text-after-end-sequence_' + id).bind('keyup', {id: foldersList[i].folder_id}, function(event) {
                if(this.value !== "" || $('#newline-text-after_' + event.data.id)[0].checked) {
                    // disable everything below it
                    $('#toolbar_text-after-style-bar' + event.data.id)[0].style.visibility = "visible";
                    $('#span_to_toggle_' + event.data.id)[0].style.visibility = "visible";
                } else if(this.value === "" && $('#newline-text-after_' + event.data.id)[0].checked === false) {
                    $('#toolbar_text-after-style-bar' + event.data.id)[0].style.visibility = "hidden";
                    $('#span_to_toggle_' + event.data.id)[0].style.visibility = "hidden";
                }
            });

            // hide styling menu below the text-after endSeq by default
            $('#span_to_toggle_' + id)[0].style.visibility = "hidden";
            $('#toolbar_text-after-style-bar' + id)[0].style.visibility = "hidden";
            
            // bind click handler to the 'Additional styles' collapsible arrow
            $(style_div).find('.additional-style-collapse').bind('click', {id:foldersList[i].folder_id}, function(event) {
                $(document.getElementById('extra_styles_div_' + event.data.id)).slideToggle(175);
                if($(this).hasClass('arrow-right')) {
                    $(this).removeClass('arrow-right');
                    $(this).addClass('arrow-down');

                } else {
                    $(this).removeClass('arrow-down');
                    $(this).addClass('arrow-right');
                }
            });

            // bind click handler to toggle the form for entering a new rule.
            $(style_div).find('#style-circle').bind('click', {id: foldersList[i].folder_id}, function(event) {
                var folderID = event.data.id;
                var divToCollapse = document.getElementById('rule_div_' + folderID);
                $(divToCollapse).slideToggle(175);
            });

            // bind click handler to the main folder collapse arrow to toggle that folder's style menu display
            $(style_div).find('.collapse-main').bind('click', {id: foldersList[i].folder_id}, function(event) {
                $('#inner_style_div_' + event.data.id).slideToggle(175);
                if($(this).hasClass('arrow-right')) {
                    $(this).removeClass('arrow-right');
                    $(this).addClass('arrow-down');

                } else {
                    $(this).removeClass('arrow-down');
                    $(this).addClass('arrow-right');
                }
            });

            // sets toggling for the B, I, U icons on the menu bars.
            setTextStyleToggle('text-after-style-bar', foldersList[i].folder_id, "", 'font-weight');
            setTextStyleToggle('text-after-style-bar', foldersList[i].folder_id, "", 'font-style');
            setTextStyleToggle('text-after-style-bar', foldersList[i].folder_id, "", 'text-decoration');
            setTextStyleToggle('start-style-bar', foldersList[i].folder_id, "", 'font-weight');
            setTextStyleToggle('start-style-bar', foldersList[i].folder_id, "", 'font-style');
            setTextStyleToggle('start-style-bar', foldersList[i].folder_id, "", 'text-decoration');

            // will bind a click handler to the 'SAVE' button that grabs all existing rules of the folder to send to the server.
            getSubjectRules(style_div, foldersList[i].folder_id, foldersList[i].folder_name, "");
        }

        // Get request to get all existing rules from the server
        // the callback parses them and creates all neccessary DOM elements.
        var getParams = {};
        var rules = [];
        $.get('/getRules', getParams, function(responseJSON) {
            console.log("RULES RECIEVED: " + responseJSON);
            rules = JSON.parse(responseJSON);
            createExistingStyleRules(rules);
        });
    }

    /**
     * Sets up toggling the values of B, I, U! 
     * Gets the DOM element id's and toggles display and value
     * using a click handler.
     * @param style bar name
     * @param folder id
     * @param name of the rule
     * @param font style type (bold, italics or underline)
     * @return - void
     */
    function setTextStyleToggle(style_text, folder_id, rulename, style_type) {
        var button = $('#' + style_text + folder_id + rulename + '_' + style_type);
        if(style_type === 'font-weight' || style_type === 'font-style' || style_type === 'text-decoration') {
            button.click(function(event) {
                if($(this).attr('value') === 'none') {
                    var new_val = $(this).attr('name');
                    $(this).attr('value', new_val);
                    $(this).css('background-color', 'rgba(0,0,0,0.3)');
                } else if($(this).attr('value') === $(this).attr('name')) {
                    $(this).attr('value', 'none');
                    $(this).css('background-color','inherit');
                }
            });
        }
    }

     /**
      * given a rule to style, and the folder id, this creates the toolbar
      * for that folder and that rule with unique ids that include the folder id
      * and the rule word itself.
      * ex: createStyleToolbar('text-after-style-bar', foldersList[i].folder_id)
        id of bold button:   text-after-style-bar'folder_id'_font-weight
      * @param - style bar name
      * @param - id of the folder
      * @param name of the rule
      * @return HTML for the style bar
      */
    function createStyleToolbar(style, id, rulename) {
        return '<div class="style-toolbar" id="toolbar_' + style + id + rulename + '">  \
        <div class="boldButton" id="' + style + id + rulename + '_font-weight" value="none" name="bold">B</div> \
        <div class="italicButton" id="' +  style + id + rulename + '_font-style" value="none" name="italic">i</div> \
        <div class="underlineButton" id="' + style + id + rulename + '_text-decoration" value="none" name="underline">U</div> \
        <select class="font-family" id="' + style + id + rulename + '_font-family">    \
        <option selected="selected" disabled="disabled">Font Type</option>  \
        <option value="Playfair Display">Playfair Display</option> \
        <option value="Bitter">Bitter</option> \
        <option value="Open Sans">Open Sans</option> \
        <option value="Merriweather">Merriweather</option> \
        <option value="Palatino">Palatino</option>  \
        </select> \
        <select class="font-size" id="' + style + id + rulename + '_font-size" >   \
        <option selected="selected" disabled="disabled">Font Size</option>  \
        <option value="Small">Small</option>    \
        <option value="Medium">Medium</option>  \
        <option value="Big">Big</option>    \
        </select> \
        </div><br><br>';
    }



    /**
     * Binds a click handler to the 'SAVE' button for rules
     * Callback gets all rules in that folder to send updated
     * information to the server
     * @param: styling div of the folder
     * @param id of the folder
     * @param name of the folder
     * @param name of the rule
     */
    function getSubjectRules(styleDiv, folderID, folderName, rulename) {
        var clickParam = {
            id: folderID,
            name: folderName,
            div: styleDiv,
            rule: rulename
        };

        $('#submit_' + folderID + rulename).bind('click', clickParam, function(event) {
            alert("clicked");
            var rulesForThisFolder = getRulesList(event.data.div, event.data.id, event.data.name, event.data.rule);

            // sends the rules as stringified JSON to the server.
            var postParam = {
                rules: JSON.stringify(rulesForThisFolder)
            };

            console.log("RULES SENT: " + postParam.rules);

            // post request to update the CSS stylsheets.
            $.post('/updateCSS', postParam, function(responseJSON) {
                $('.example_content')[0].innerHTML = '<span id="rule-header">STYLE RULES</span><span class="close-button"></span>';
                $('.example_overlay')[0].style.display = "table";
                $('.example_content')[0].style.display = "table-cell";

                // re-create the styling DOM with updated information
                createEditStyleDivs();

                $('#inner_style_div_' + event.data.id)[0].style.display = 'block';
                $('#collapse-main_' + event.data.id).removeClass('arrow-right');
                $('#collapse-main_' + event.data.id).addClass('arrow-down');

                $('.close-button').click(function(event) {
                    closeStyleMenu();
                });
            });
        });
    }

    /** 
     * Gets the rules of the current folder
     * @param styleDiv is the folder's main style div
     * @param folder id
     * @param folder name
     * @param rule name
     * @return - list of rules for the folder.
     */
    function getRulesList(styleDiv, folder_id, folder_name, rulename) {
        var rulesForThisFolder = [];

        // go over all the rule forms and create rule objects.
        $(styleDiv).find('.rule_div').each(function(i) {
            var name = $(this).find('.rulename')[0].value.replace(/^[^A-Z0-9]+|[^A-Z0-9]+$/ig, '').replace(/\s+/g, '').replace('\'', '');
            if(!document.getElementById('rulename_' + folder_id + name)) { 
                name = "";
            } 
            rulename = name;
            
            // create the rule 
            var rule = 
            {   
                "associated_folder_id": folder_id,
                "associated_folder_name": folder_name,
                "name": document.getElementById('rulename_' + folder_id + name).value,
                "trigger":
                {
                    "word": document.getElementById('rulestart_' + folder_id + name).value,
                    "endSeq": getTriggerEndSequence(this, folder_id, name),
                    "style": 
                    {
                        "font-weight": getButtonValue('start-style-bar', 'font-weight', folder_id, name),
                        "font-style": getButtonValue('start-style-bar', 'font-style', folder_id, name),
                        "text-decoration": getButtonValue('start-style-bar', 'text-decoration', folder_id, name),
                        "font-family": getButtonValue('start-style-bar', 'font-family', folder_id, name),
                        "font-size": getButtonValue('start-style-bar', 'font-size', folder_id, name),
                    }
                },

                "after": 
                {
                    "endSeq": getAfterEndSequence(this, folder_id, name),
                    "style": 
                    {
                        "font-weight": getButtonValue('text-after-style-bar', 'font-weight', folder_id, name),
                        "font-style": getButtonValue('text-after-style-bar', 'font-style', folder_id, name),
                        "text-decoration": getButtonValue('text-after-style-bar', 'text-decoration', folder_id, name),
                        "font-family": getButtonValue('text-after-style-bar', 'font-family', folder_id, name),
                        "font-size": getButtonValue('text-after-style-bar', 'font-size', folder_id, name),
                    }
                },
            }

            // clears the endSeq styles for 'after' as neccessary.
            clearIrrelevantStyles(rule);

            // add 'container' object if needed
            if(document.getElementById('box_' + folder_id + rulename).checked === true) {
                rule["container"] = {};
                rule["container"]["style"] = {}
                rule["container"]["style"]["background-color"] = "rgba(255, 255, 255, 0.35)";
                rule["container"]["style"]["padding"] = "4px";
                rule["container"]["style"]["padding-left"] = "7px";
                rule["container"]["style"]["padding-right"] = "7px";
            }

            if(document.getElementById('center_' + folder_id + rulename).checked === true) {
                if(rule["container"]) {
                    rule["container"]["style"]["text-align"] = "center";
                } else {
                    rule["container"] = {};
                    rule["container"]["style"] = {}
                    rule["container"]["style"]["text-align"] = "center";
                }
            }

            // add more styles if both boxed and centered are specified.
            if(document.getElementById('box_' + folder_id + rulename).checked && document.getElementById('center_' + folder_id + rulename).checked) {
                rule["container"]["style"]["display"] = "table";
                rule["container"]["style"]["margin"] = "auto";
            }

            rulesForThisFolder.push(rule);
            
        });
        return rulesForThisFolder;
    }



    /**
     * Given a rule object, clear out unneccassary styles
     * that a user may not have defined.
     * @param rule object
     */
    function clearIrrelevantStyles(rule) {
        // clean up rule.trigger.style
        if(rule["trigger"]["style"]["font-weight"] === "none") {
            delete rule["trigger"]["style"]["font-weight"];
        }

        if(rule["trigger"]["style"]["font-style"] === "none") {
            delete rule["trigger"]["style"]["font-style"];
        }

        if(rule["trigger"]["style"]["text-decoration"] === "none") {
            delete rule["trigger"]["style"]["text-decoration"];
        }

        if(rule["trigger"]["style"]["font-family"] === null) {
            delete rule["trigger"]["style"]["font-family"];
        }

        if(rule["trigger"]["style"]["font-size"] === null) {
            delete rule["trigger"]["style"]["font-size"];
        }

        if(!rule["trigger"]["style"]["font-weight"] &&
            !rule["trigger"]["style"]["font-style"] &&
            !rule["trigger"]["style"]["text-decoration"] &&
            !rule["trigger"]["style"]["font-family"] &&
            !rule["trigger"]["style"]["font-size"]) {
            delete rule["trigger"]["style"];
        }

        // rule.after and rule.after.style
        if(rule["after"]["endSeq"] === "" && rule["after"]["endSeq"] !== "99999999999") {
            delete rule["after"];
        } 

        if(rule["after"]) {
            if(rule["after"]["style"]["font-weight"] === "none") {
                delete rule["after"]["style"]["font-weight"];
            }

            if(rule["after"]["style"]["font-style"] === "none") {
                delete rule["after"]["style"]["font-style"];
            }

            if(rule["after"]["style"]["text-decoration"] === "none") {
                delete rule["after"]["style"]["text-decoration"];
            }

            if(rule["after"]["style"]["font-family"] === null) {
                delete rule["after"]["style"]["font-family"];
            }

            if(rule["after"]["style"]["font-size"] === null) {
                delete rule["after"]["style"]["font-size"];
            }
        }

        if(rule["after"] && 
            !rule["after"]["style"]["font-weight"] &&
            !rule["after"]["style"]["font-style"] &&
            !rule["after"]["style"]["text-decoration"] &&
            !rule["after"]["style"]["font-family"] &&
            !rule["after"]["style"]["font-size"]) {
            delete rule["after"];
        }
    }


    /**
     * get the value for the styling toolbar buttons according to their unique id
     * on clicking the save style button, so that the rule object can be filled in.
     * @param style bar name
     * @param style type (font weight, style or text decoration)
     * @param id of the folder 
     * @param rule name
     * @return value based on the DOM element being considered.
     */
    function getButtonValue(style_text, style_type, folder_id, rulename) {
        var domElement = $(document.getElementById(style_text + folder_id + rulename + '_' + style_type));
        if(style_type === 'font-style' || style_type === 'font-weight' || style_type === 'text-decoration') {
            return domElement.attr('value');
        } 

        if(style_type === "font-family") {
            if(domElement.val()) {
                return domElement.val();
            } else {
                return null;
            } 
        } 

        if(style_type === "font-size") {
            if(domElement.val() === "Small") {
                return '17px';
            } else if(domElement.val() === "Medium") {
                return '22px';
            } else if(domElement.val() === "Big"){
                return '30px';
            } else {
                return null;
            }
        }
    }

    /**
     * get the end seq specified for the rule.trigger object
     * @param inner style div
     * @param folder id
     * @param rule name
     * @return 'string of 11 characters of newline' else given text box value/
     */
    function getTriggerEndSequence(inner_div, folderID, rulename) {
        return $(inner_div).find('.newline-trigger')[0].checked ? "99999999999" : 
            document.getElementById('trigger-end-sequence_' + folderID + rulename).value;
    }

    /**
     * get the end seq specified for the rule.after object
     * @param inner style div
     * @param folder id
     * @return 'string of 11 characters of newline' else given text box value/
     */
    function getAfterEndSequence(inner_div, folderID) {
        return $(inner_div).find(".newline-text-after")[0].checked ? "99999999999" : 
            $(inner_div).find('.text-after-end-sequence')[0].value;
    }

    // bind click handler to close icon of the style overlay.
    $('.close-button').click(function() {
        closeStyleMenu();
    });

    /**
     * Click handler for close button on the styling overlay
     * Clears the overlay DOM until the next request.
     */
    function closeStyleMenu() {
        prevEditingHTML = $('.example_content').html();
        $('.example_content')[0].innerHTML = '<span id="rule-header">STYLE RULES</span><span class="close-button"></span>';
        $('.example_overlay')[0].style.display = "none";
        $('.example_content')[0].style.display = "none";
        $('.close-button').click(function() {
            closeStyleMenu();
        });
    }

     /**
     * Create the DOM for all existing rules sent by the server.
     * @param list of rules.
     */
    function createExistingStyleRules(rules) {
        for(var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            var rulename = rule.name;
            var rulename_id = rulename.replace(/^[^A-Z0-9]+|[^A-Z0-9]+$/ig, '').replace(/\s+/g, '').replace('\'', '');
            var folder_id = rule.associated_folder_id;
            var folder_name = rule.associated_folder_name;
            var inner_div = document.getElementById('inner_style_div_' + folder_id);
            var eventParam = {
                id: folder_id,
                name: rulename_id
            }

            $(inner_div).prepend('<span class="circle arrow-right existing-styles-collapse" id="existing-styles-collapse_' + folder_id + rulename_id + '"></span>' +
                '<span class="new-style-header" id="new-style-header_' +folder_id +rulename_id+'">' + rulename + '</span>' + 
                '<span class="delete_icon delete_icon_styles" id="delete_icon_' + folder_id + rulename_id + '"></span>' +
                '<div class="rule_div" id="rule_div_' + folder_id + rulename_id + '">' +
                'Rule <input type="text" class="rulename" placeholder="Name" id="rulename_' + folder_id + rulename_id + '" maxlength="20"></input><br>    \
                should start with \
                <input type="text" class="rulestart" id="rulestart_' + folder_id + rulename_id + '" placeholder="Character String" maxlength="15"></input><br>  \
                and have these styles: <br>' + 
                createStyleToolbar('start-style-bar', folder_id, rulename_id) + 
                '<span class="extra_styles_title" id="extra_styles_title_' + folder_id + rulename_id + '">' + 
                '<span class="circle additional-style-collapse arrow-right" id="additional-style-collapse_' + folder_id + rulename_id + '">' +
                '<span class="arrow-down"></span></span>' +
                '  Additional Styles</span><br>' +
                '<div class="extra_styles_div" id="extra_styles_div_' + folder_id + rulename_id + '"><span>' + 
                'Extend these styles until<br>'   
                + '<input type="text" class="trigger-end-sequence" id="trigger-end-sequence_' + folder_id + rulename_id + '" placeholder = "Character String" maxlength="10"></input>  OR \
                <input type="checkbox" class="newline-trigger" id="newline-trigger_' + folder_id + rulename_id + '"></input>  Newline<br><br>' + 
                'Style text after this rule until<br>'
                + '<input type="text" class="text-after-end-sequence" id="text-after-end-sequence_' + folder_id + rulename_id + '" placeholder = "Character String" maxlength="10"></input>  OR \
                <input type="checkbox" class="newline-text-after" id="newline-text-after_' + folder_id + rulename_id + '"></input>  Newline<br>' + 
                '<span id="span_to_toggle_' + folder_id + rulename_id + '">with these styles </span><br>' 
                + createStyleToolbar('text-after-style-bar', folder_id, rulename_id) +
                '<input type="checkbox" name="boxed" value="box" class="box" id="box_' + folder_id + rulename_id+ '"></input> \
                Box this rule<br>' +
                '<input type="checkbox" name="centered" value="center" class="center" id="center_' + folder_id + rulename_id + '"></input> \
                Center this rule<br><br></div>' +
                '<div class="submit-button" id="submit_' + folder_id + rulename_id + '">SAVE</div>' + 
                '</div><br id="line_break_' + folder_id + rulename_id +'">');
            
            // bind click handler to the newline button for trigger endSeq.
            $('#newline-trigger_' + folder_id + rulename_id).bind('click', eventParam, function(event) {
                if(this.checked) {
                    $('#trigger-end-sequence_' + event.data.id + event.data.name)[0].disabled = true;
                } else {
                    $('#trigger-end-sequence_' + event.data.id + event.data.name)[0].disabled = false;
                }
            });

            // bind click handler to the newline checkbox for the rule.after endSeq.
            $('#newline-text-after_' + folder_id + rulename_id).bind('click', eventParam, function(event) {
                if(this.checked) {
                    $('#text-after-end-sequence_' + event.data.id + event.data.name)[0].disabled = true;
                    $('#toolbar_text-after-style-bar' + event.data.id + event.data.name)[0].style.visibility = "visible";
                    $('#span_to_toggle_' + event.data.id + event.data.name)[0].style.visibility = "visible";

                } else {
                    $('#text-after-end-sequence_' + event.data.id + event.data.name)[0].disabled = false;
                    if($('#text-after-end-sequence_' + event.data.id + event.data.name)[0].value === "") {
                        $('#toolbar_text-after-style-bar' + event.data.id + event.data.name)[0].style.visibility = "hidden";
                        $('#span_to_toggle_' + event.data.id + event.data.name)[0].style.visibility = "hidden";
                    }
                }
            });

            // keyup handler to the rule.after.endSeq text box.
            $('#text-after-end-sequence_' + folder_id + rulename_id).bind('keyup', {id: folder_id, name: rulename_id}, function(event) {
                if(this.value !== "" || $('#newline-text-after_' + event.data.id + event.data.name)[0].checked) {
                    $('#toolbar_text-after-style-bar' + event.data.id + event.data.name)[0].style.visibility = "visible";
                    $('#span_to_toggle_' + event.data.id + event.data.name)[0].style.visibility = "visible";

                } else if(this.value === "" && $('#newline-text-after_' + event.data.id + event.data.name)[0].checked === false) {
                    $('#toolbar_text-after-style-bar' + event.data.id + event.data.name)[0].style.visibility = "hidden";
                    $('#span_to_toggle_' + event.data.id + event.data.name)[0].style.visibility = "hidden";
                }
            });

            // click handler to the collapse icon
            $('#rule_div_' + folder_id + rulename_id).find('.additional-style-collapse').bind('click', eventParam, function(event) {
                $('#extra_styles_div_' + event.data.id + event.data.name).slideToggle(175);
                if($(this).hasClass('arrow-right')) {
                    $(this).removeClass('arrow-right');
                    $(this).addClass('arrow-down');
                } else {
                    $(this).removeClass('arrow-down');
                    $(this).addClass('arrow-right');
                }
            });

            // click handler to the the collapse button on the folder collapse.
            $('#existing-styles-collapse_' + folder_id + rulename_id).bind('click', eventParam, function(event) {
                $('#rule_div_' + event.data.id + event.data.name).slideToggle(175);
                if($(this).hasClass('arrow-right')) {
                    $(this).removeClass('arrow-right');
                    $(this).addClass('arrow-down');
                } else {
                    $(this).removeClass('arrow-down');
                    $(this).addClass('arrow-right');
                }
            });

            var clickParam = {
                id: folder_id,
                folder: folder_name,
                rule: rulename_id
            };

            // click handler to the delete icon for the rule
            $('#delete_icon_' + folder_id + rulename_id).bind('click', clickParam, function(event) {
                var list = getRulesList(document.getElementById(event.data.id), event.data.id, event.data.folder, event.data.rule);
                var deleted_rule_name = $('#new-style-header_' + event.data.id + event.data.rule)[0].innerText;

                var postParam = {
                    rules_list : JSON.stringify(list),
                    deleted_rule: deleted_rule_name,
                    subject: event.data.folder
                }

                // sends post request to the server to update about the deleted rule
                // and clears the DOM
                $.post('/deleteRule', postParam, function(responseJSON) {
                    $('#existing-styles-collapse_' + event.data.id + event.data.rule).remove();
                    $('#new-style-header_' + event.data.id + event.data.rule).remove();
                    $('#delete_icon_' + event.data.id + event.data.rule).remove();
                    $('#rule_div_' + event.data.id + event.data.rule).remove();
                    $('#line_break_' + event.data.id + event.data.rule).remove();
                });
            });
            
            // create the rule form for this rule.
            var ruleform = $(inner_div).find('#rule_div_' + folder_id + rulename_id);

            if(document.getElementById('rulename_' + folder_id + rulename_id) !== null) {

                // populate rulename
                document.getElementById('rulename_' + folder_id + rulename_id).value = rulename ? rulename: "";

                // populate rule 'starts with word'
                document.getElementById('rulestart_' + folder_id + rulename_id).value = rule.trigger.word ? rule.trigger.word : "";
                var start_style_bar = document.getElementById('#start-style-bar' + folder_id + rulename_id);

                // populate start (trigger word) style bar
                var triggerBoldBar = $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-weight'));
                var triggerItalicBar =  $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-style'));
                var triggerUnderlineBar =  $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_text-decoration'));

                if(rule.trigger["style"] && rule.trigger["style"]["font-weight"] === "bold") {
                    triggerBoldBar.attr('value','bold');
                    triggerBoldBar.css('background-color','rgba(0,0,0,0.3)');
                    
                } else {
                    triggerBoldBar.attr('value', 'none');
                    triggerBoldBar.css({"background-color": "inherit"});
                }

                if(rule.trigger["style"] && rule.trigger["style"]["font-style"] === "italic") {
                    triggerItalicBar.attr('value', 'italic');
                    triggerItalicBar.css('background-color','rgba(0,0,0,0.3)');
                } else {
                    triggerItalicBar.attr('value', 'none');
                    triggerItalicBar.css({"background-color": "inherit"});
                }

                if(rule.trigger["style"] && rule.trigger["style"]["text-decoration"] === "underline") {
                    triggerUnderlineBar.attr('value', 'underline');
                    triggerUnderlineBar.css("background-color", "rgba(0,0,0,0.3)");
                } else {
                    triggerUnderlineBar.attr('value', 'none');
                    triggerUnderlineBar.css({"background-color": "inherit"});
                }

                // set font family
                if(rule["trigger"]["style"] && rule["trigger"]["style"]["font-family"]) {
                    document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-family').value = rule["trigger"]["style"]["font-family"];
                }


                var fontSizeBar = $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-size'));

                if(rule["trigger"] && rule["trigger"]["style"]) {
                    if(rule["trigger"]["style"]['font-size'] === "17px") {
                        fontSizeBar.val("Small");
                    } else if(rule["trigger"]["style"]["font-size"] === "22px") {
                        fontSizeBar.val("Medium");
                    } else if(rule["trigger"]["style"]["font-size"] === "30px") {
                        fontSizeBar.val("Big");
                    }
                }

                // sets up toggling for the B, I, U buttons
                setTextStyleToggle('start-style-bar', folder_id, rulename_id, 'font-weight');
                setTextStyleToggle('start-style-bar', folder_id, rulename_id, 'font-style');
                setTextStyleToggle('start-style-bar', folder_id, rulename_id, 'text-decoration');

                setTextStyleToggle('text-after-style-bar', folder_id, rulename_id, 'font-weight');
                setTextStyleToggle('text-after-style-bar', folder_id, rulename_id, 'font-style');
                setTextStyleToggle('text-after-style-bar', folder_id, rulename_id, 'text-decoration');

                // extend these styles until ...
                if(rule.trigger.endSeq !== "99999999999") {
                    document.getElementById('trigger-end-sequence_' + folder_id + rulename_id).value  = rule.trigger.endSeq ? rule.trigger.endSeq : "";
                } else {
                    document.getElementById('newline-trigger_' + folder_id + rulename_id).checked = true;
                    $('#trigger-end-sequence_' + folder_id + rulename_id)[0].disabled = true;
                }

                // style text after this rule until
                if(rule.after && rule.after.endSeq !== "99999999999") {
                    document.getElementById('text-after-end-sequence_' + folder_id + rulename_id).value = rule.after.endSeq ? rule.after.endSeq : "";
                } else if(rule.after && rule.after.endSeq === "99999999999") {
                    document.getElementById('newline-text-after_' + folder_id + rulename_id).checked = true;
                    $('#text-after-end-sequence_' + folder_id + rulename_id)[0].disabled = true;
                }

                // with these styles...
                var after_style_toolbar = document.getElementById('text-after-style-bar' + folder_id + rulename_id);
                var afterBoldBar = $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-weight'));
                var afterItalicBar = $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-style'));
                var afterUnderlineBar = $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_text-decoration'));

                if(rule.after && rule.after["style"] && rule.after["style"]["font-weight"] == "bold") {
                    afterBoldBar.attr('value', 'bold');
                    afterBoldBar.css("background-color", "rgba(0,0,0,0.3)");
                } else {
                    afterBoldBar.attr('value', 'none');
                    afterBoldBar.css({"background-color": "inherit"});
                }

                if(rule.after && rule.after["style"] && rule.after["style"]["font-style"] == "italic") {
                    afterItalicBar.attr('value', 'italic');
                    afterItalicBar.css("background-color", "rgba(0,0,0,0.3)");
                } else {
                    afterItalicBar.attr('value','none');
                    afterItalicBar.css("background-color", "inherit");
                }

                if(rule.after && rule.after["style"] && rule.after["style"]["text-decoration"] == "underline") {
                    afterUnderlineBar.attr('value','underline');
                    afterUnderlineBar.css("background-color", "rgba(0,0,0,0.3)");
                } else {
                    afterUnderlineBar.attr('value','none');
                    afterUnderlineBar.css({"background-color": "inherit"});
                }
                // set font family for rule.after
                if(rule["after"] && rule.after["style"] && rule["after"]["style"]["font-family"]) {
                    document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-family').value = rule["after"]["style"]["font-family"];
                }
                
                // font size for rule.after
                var afterFontSize = $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-size'));
                if(rule["after"] && rule.after["style"] && rule["after"]["style"]["font-size"]) {
                    if(rule["after"]["style"]['font-size'] === "17px") {
                        afterFontSize.val("Small");
                    } else if(rule["after"]["style"]["font-size"] === "22px") {
                        afterFontSize.val("Medium");
                    } else if(rule["after"]["style"]["font-size"] === "30px") {
                        afterFontSize.val("Big");
                    }
                }
                
                // box the rule
                if(rule["container"] && rule["container"]["style"]["background-color"]) {
                    $(document.getElementById('box_' + folder_id + rulename_id))[0].checked = true;
                }

                // center this rule ...
                if(rule["container"] && rule["container"]["style"]["text-align"]) {
                    $(document.getElementById('center_' + folder_id + rulename_id))[0].checked = true;
                }

                // hide text after style bar until endSeq is specified.
                if($('#text-after-end-sequence_' + folder_id + rulename_id)[0].value === "" &&
                    $('#newline-text-after_' + folder_id + rulename_id)[0].checked === false) {
                    $('#toolbar_text-after-style-bar' + folder_id + rulename_id)[0].style.visibility = "hidden";
                    $('#span_to_toggle_' + folder_id + rulename_id)[0].style.visibility = "hidden";
                }
            }

            // binds click handler to 'SAVE' button to save the styles.
            getSubjectRules(document.getElementById(folder_id), folder_id, folder_name, rulename_id);
        }
    }
});
