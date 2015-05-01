/** Main class will handle loading the metadata associated with each folder 
 * and note to display clickable titles on the main page.
 * associated with main.ftl fiel
 */


 

$(document).ready(function() {

    // variables/DOM elements needed
    // var editStyleButton = document.getElementById("");
    var folder_num_counter = 0;
    var prevEditingHTML = null;

    // window.glob 

    
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
     var fList = [];

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
            var json = $(".data");
            var jsonArray = JSON.parse(json.text());
            fList = jsonArray;
            displayTitles(jsonArray);
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
  
            $(folder_div).attr('data-folder',folderList[i]);
            var header_span = document.createElement('div');
            header_span.className = 'folder_header_span';
            header_span.innerHTML = '<span class="title">' + folderList[i].folder_name + '</span>';

            $(folder_div).html(header_span);
            createCircleDiv(folder_div, header_span);
          
            $(header_span).append('<div class="delete_icon" id="delete_icon_' + fList[i].folder_id + '"></div>');
            createFlashcardDiv(header_span, folderList[i].folder_name);
            $(header_span).append('<br>');

            $(header_span).hover(function() {
                $(this).find('.delete_icon')[0].style.visibility = 'visible';
                $(this).find('.flashcard_icon')[0].style.visibility = 'visible';

            }, function() {
                $(this).find('.delete_icon')[0].style.visibility = 'hidden';
                $(this).find('.flashcard_icon')[0].style.visibility = 'hidden';
            });

            
           main_note_div = document.createElement('main_note_div');
            main_note_div.className = 'main_note_div';
            folder_div.appendChild(main_note_div);
        
            

            
            $(folder_div).find('.delete_icon').bind('click', {div: folder_div, name: fList[i].folder_name, id: fList[i].folder_id}, function(event) {
                var postParam = {
                    folder: event.data.name
                }
                
                
                $.post('/deleteFolder', postParam, function(responseJSON) {
                    // #TODO: returns boolean for successful deletion of folders, check for that and dsiplay to user
                    // appropriately.
                    // window.location.href = '/notes';
                    $(event.data.div).remove();

                    // #TODO: remove folder from edit style menu as well!
                    // edit: request for the updated folder list from server and update the global varible 'fList'
                    $.get('/moreNotes', postParam, function(responseJSON) {
                        var responseObject = JSON.parse(responseJSON);
                        fList = responseObject;
                    });

                });
            });
            



            for(var j = 0; j < folderList[i].notes.length; j++) {
                var notes_div = document.createElement("div");
                notes_div.className = "note_name_div";
                notes_div.id = folderList[i].notes[j].note_id;
                notes_div.innerHTML = '<span class="note_name">' + folderList[i].notes[j].note_name + '</span>';
                $(notes_div).append('<div class="delete_icon delete_icon_notes" id="delete_icon_' + notes_div.id + '"></div>');
                main_note_div.appendChild(notes_div);
                $(notes_div).bind('click', {name: folderList[i].folder_name}, function(event) {
                    window.location.href = '/getNote/' + event.data.name + "/" +  this.id;
                });

                // $(notes_div).find('.delete_icon')[0].style.float = 'right';

                $(notes_div).find('.delete_icon').bind('click', {main_div: main_note_div, div: notes_div, id: folderList[i].notes[j].note_id, folder: folderList[i].folder_name}, function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var postParam = {
                        note_id: event.data.id,
                        subject: event.data.folder
                    }

                    // #TODO response is a boolean indicating successful deletion, 
                    // handle it.
                    $.post('/deleteNote', postParam, function(responseJSON) {
                        // window.location.href = '/notes';
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

            if(main_note_div) {
                $(main_note_div)[0].style.display='none';
            }
            

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
      */
     function createCircleDiv(folderDiv, header_span) {
        var circle = document.createElement("div");
        circle.className = "circle_image";
        // circle.innerText = '+';
        header_span.appendChild(circle);
        // $(circle).attr('contenteditable','false');
        $(circle).click(function(event) {
            createNewNote(folderDiv);
            
            // #TODO: send info about the new note to server.
        });
     }


     /**
      * Helper function to create flashcard button
      */
    function createFlashcardDiv(folderDiv, folderName) {
        var flashcardIcon = document.createElement('div');
        flashcardIcon.innerText = 'REVIEW';
        flashcardIcon.className = 'flashcard_icon';
        folderDiv.appendChild(flashcardIcon);
        $(flashcardIcon).attr('contenteditable', 'false');
        $(flashcardIcon).click(function(event) {
          window.location.href = '/getNewSession/' + encodeURIComponent(folderName);
         //   $.get('/getNewSession/' + encodeURIComponent(folderName), function() {});
        });
    }



     /**
      * Add a new editable note title div when a user adds one,
      */
     function createNewNote(folderDiv, header_span) {
        var new_note_div = document.createElement("div");
        new_note_div.className = "new_note_name_div";
        // $(new_note_div).attr('contenteditable','true');
        $(new_note_div).html('<input type="text" class="note_title note_title_input" placeholder="NOTE NAME" maxlength="30"></input>');
        $(new_note_div).find('.note_title').attr('contenteditable','true');
        $(new_note_div).attr('folder', $(folderDiv).find('.title')[0].innerText);
        new_note_div.id = -1;
        
        // new_note_div.innerHTML = "NEW  NOTE";
        $(new_note_div).append('<div class="delete_icon" id="delete_icon_' + -1 + '"></div>');
        folderDiv.appendChild(new_note_div);
        

        $(new_note_div).find('.note_title').focusout(function() {
            if(this.value !== "") {
                var postParam = {
                    folder_id :folderDiv.id,
                    folder_name : $(folderDiv).find('.title')[0].innerText,
                    note_id : -1,
                    note_name : this.value
                };

                // post request to save note
                // #TODO: response also contains boolean indicating successful addition, deal with it
                $.post('/newNote', postParam, function(responseJSON) {
                    // parse response for note data to display
		            var responseObject = JSON.parse(responseJSON);

                    $(new_note_div).removeClass('new_note_name_div');
                    $(new_note_div).html('<span class="note_name">' + postParam.note_name + '</span>');
                    $(new_note_div).addClass('note_name_div');
                    new_note_div.id = responseObject.note_id;
		            $(new_note_div).append('<div class="delete_icon delete_icon_notes" id="delete_icon_' + new_note_div.id + '"></div>');
                    
                    $(new_note_div).bind('click', {name: postParam.folder_name}, function(event) {
                        window.location.href = '/getNote/' + event.data.name + "/" +  this.id;
                    });

                    // $(new_note_div).find('.delete_icon')[0].style.float = 'right';

                    $(new_note_div).find('.delete_icon').bind('click', {folder_div: folderDiv, div: new_note_div, folder: postParam.folder_name}, function(event) {
                        event.stopPropagation();
                        event.preventDefault();
                        var postParam = {
                            note_id: this.id,
                            subject: event.data.folder
                        }

                        // #TODO response is a boolean indicating successful deletion, 
                        // handle it.
                        $.post('/deleteNote', postParam, function(responseJSON) {
                            event.preventDefault();
                            event.stopPropagation();
                            // window.location.href = '/notes';
                            $(event.data.div).remove();
                            if($(event.data.folder_div).find('.main_note_div')[0].innerHTML === "") {
                                $(event.data.folder_div).find('.main_note_div').slideUp('fast');
                            }

                        });
                    });

                    $(new_note_div).hover(function() {
                        $(this).find('.delete_icon').css({'visibility':'visible'}); 
                    },function() {
                        $(this).find('.delete_icon').css({'visibility':'hidden'}); 
                    });

                    $(folderDiv).find('.main_note_div').append(new_note_div);
                });
                
            }

        }); 
        
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
      * click handler for the add new section button
      */
    function addSectionClick() {
        var new_folder_div = document.createElement("div");
        var header_span = document.createElement('div');
        header_span.className = 'folder_header_span_new';
        // $(header_span).attr('contenteditable', 'true');
        $(new_folder_div).html(header_span);
        new_folder_div.className = "new_folder_name_div";
        
        header_span.innerHTML = '<input class="title title_note" maxlength="30" placeholder="NEW FOLDER" maxlength="30"></input>';


        new_folder_div.id = folder_num_counter + 1;

        // $(new_folder_div).find('.title').attr('contenteditable', 'true');

        $(new_folder_div).find('.title').focusout(function() {
            if(this.value !== "") {
                var folder_data = {
                    "folder_id": -1,
                    "title": this.value
                };

                $.get('/newFolder', folder_data, function(responseJSON) {
                    var responseObject = JSON.parse(responseJSON);
                    var folder_id = responseObject.id;
                    var folder_name = responseObject.title;
                    new_folder_div.id = folder_id;
                    header_span.innerHTML = '<span class="title">' + folder_name + '<span>'; 
                    $(header_span).removeClass('folder_header_span_new');
                    header_span.className = 'folder_header_span';
                    $(new_folder_div).html(header_span);
                    createCircleDiv(new_folder_div, header_span);
                  
                    $(header_span).append('<div class="delete_icon" id="delete_icon_' + folder_id + '"></div>');
                    createFlashcardDiv(header_span, folder_name);
                    $(header_span).append('<br>');

                    $(header_span).hover(function() {
                        $(this).find('.delete_icon')[0].style.visibility = 'visible';
                        $(this).find('.flashcard_icon')[0].style.visibility = 'visible';

                    }, function() {
                        $(this).find('.delete_icon')[0].style.visibility = 'hidden';
                        $(this).find('.flashcard_icon')[0].style.visibility = 'hidden';
                    });

                    $(new_folder_div).removeClass('new_folder_name_div');
                    $(new_folder_div).addClass('folder_name_div');

                    var main_note_div = document.createElement('div');
                    main_note_div.className = 'main_note_div';
                    new_folder_div.appendChild(main_note_div);

                     $(new_folder_div).find('.title').bind('click', {notes: main_note_div}, function(event) {
                        
                        if(event.data.notes.innerHTML !== "") {
                            $(event.data.notes).slideToggle(175);
                        }
                    });


                    $(new_folder_div).find('.delete_icon').bind('click', {div: new_folder_div, name: folder_name, id: folder_id}, function(event) {
                        var postParam = {
                            folder: event.data.name
                        }
                
                
                        $.post('/deleteFolder', postParam, function(responseJSON) {
                            // #TODO: returns boolean for successful deletion of folders, check for that and dsiplay to user
                            // appropriately.
                            // window.location.href = '/notes';
                            $(event.data.div).remove();

                            // #TODO: remove folder from edit style menu as well!
                            // edit: request for the updated folder list from server and update the global varible 'fList'
                            $.get('/moreNotes', postParam, function(responseJSON) {
                                var responseObject = JSON.parse(responseJSON);
                                fList = responseObject;
                            });

                        });
                    });

                     var getParams = {};

                     $.get('/moreNotes', getParams, function(responseJSON) {
                        var responseObject= JSON.parse(responseJSON);
                        fList = responseObject;
                     });

                     

                    // #TODO: Add a corresonding folder thing to the style overlay,
                    // edit: request for an updated folder list from the server and reassign the variable 'fList'

                });
            }

            

        });
       
        $('#main-div').append(new_folder_div);

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
 ************************************
 * STYLE EDITING OVERLAY STUFF ******
 ************************************
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
                '</h2>' + createStyleToolbar('note', fList[i].folder_id) + 
                createStyleToolbar('q', fList[i].folder_id) + createStyleToolbar('section', fList[i].folder_id)); */
            
            $(style_div).html('<span class="folder_style_header">' +   
            
            '<span class="circle collapse-main arrow-right" id="collapse-main_' + fList[i].folder_id + '"></span>' + '<span>' + '       ' + 
            fList[i].folder_name  + '</span>' + 
            '<div class="inner_style_div" id="inner_style_div_' + fList[i].folder_id + '">' + 
                '<span class="new-style-header-to-add"> New Style <span class="circle" id="style-circle">+</span></span>' + 
                '<div class="rule_div" id="rule_div_' + fList[i].folder_id + '">' +
                'Rule <input type="text" class="rulename" placeholder="Name" id="rulename_' + fList[i].folder_id + '" maxlength="20"></input><br>    \
                should start with <input type="text" class="rulestart" id="rulestart_' + fList[i].folder_id + '" placeholder="Character String" maxlength="15"></input><br>  \
                and have these styles: <br>' + 
                createStyleToolbar('start-style-bar', fList[i].folder_id, "") + 
                '<span class="extra_styles_title" id="extra_styles_title_' + fList[i].folder_id + '"><span class="circle additional-style-collapse arrow-right"><span class="arrow-down"></span></span>' +
                '  Additional Styles</span><br>' +
                '<div class="extra_styles_div" id="extra_styles_div_' + fList[i].folder_id + '"><span>Extend these styles until</span><br>'  
                + '<input type="text" class="trigger-end-sequence" id="trigger-end-sequence_' + fList[i].folder_id + '" placeholder = "Character String" maxlength="10"></input>  OR \
                <input type="checkbox" class="newline-trigger"></input>  Newline<br><br>' + 
                'Style text after this rule until<br>'
                + '<input type="text" class="text-after-end-sequence" id="text-after-end-sequence_' + fList[i].folderID + '" placeholder = "Character String" maxlength="10"></input>  OR \
                <input type="checkbox" class="newline-text-after"></input>  Newline<br>' + 
                '<span style="margin-left:3%">with these styles</span> <br>' 
                + createStyleToolbar('text-after-style-bar', fList[i].folder_id, "") +
                '<input type="checkbox" name="boxed" value="box" class="box" id="box_' + fList[i].folder_id + '"></input>  Box this rule<br>' +
                '<input type="checkbox" name="centered" value="center" class="center" id="center_' + fList[i].folder_id + '"></input>   Center this rule<br><br></div><br>' +
                '<div class="submit-button" id="submit_' + fList[i].folder_id + '">SAVE</div>' + 
                '</div>' + 
            '</div>'); 
            
            
            $(style_div).find('.additional-style-collapse').bind('click', {id:fList[i].folder_id}, function(event) {
                $(document.getElementById('extra_styles_div_' + event.data.id)).slideToggle(175);
                if($(this).hasClass('arrow-right')) {
                    $(this).removeClass('arrow-right');
                    $(this).addClass('arrow-down');

                } else {
                    $(this).removeClass('arrow-down');
                    $(this).addClass('arrow-right');
                }
            });
           
            $(style_div).find('#style-circle').bind('click', {id: fList[i].folder_id}, function(event) {
                var folderID = event.data.id;
                var divToCollapse = document.getElementById('rule_div_' + folderID);
                $(divToCollapse).slideToggle(175);
                
            });

            $(style_div).find('.collapse-main').bind('click', {id: fList[i].folder_id}, function(event) {
                $('#inner_style_div_' + event.data.id).slideToggle(175);
                if($(this).hasClass('arrow-right')) {
                    $(this).removeClass('arrow-right');
                    $(this).addClass('arrow-down');

                } else {
                    $(this).removeClass('arrow-down');
                    $(this).addClass('arrow-right');
                }
            });

            setTextStyleToggle('text-after-style-bar', fList[i].folder_id, "", 'font-weight');
            setTextStyleToggle('text-after-style-bar', fList[i].folder_id, "", 'font-style');
            setTextStyleToggle('text-after-style-bar', fList[i].folder_id, "", 'text-decoration');
            setTextStyleToggle('start-style-bar', fList[i].folder_id, "", 'font-weight');
            setTextStyleToggle('start-style-bar', fList[i].folder_id, "", 'font-style');
            setTextStyleToggle('start-style-bar', fList[i].folder_id, "", 'text-decoration');

            getSubjectRules(style_div, fList[i].folder_id, fList[i].folder_name, "");
        }


        // get the existing style rules from the server here!!
        var getParams = {};
        var rules = [];
        $.get('/getRules', getParams, function(responseJSON) {
            console.log("RULES RECIEVED:   " + responseJSON);
             rules = JSON.parse(responseJSON);

             createExistingStyleRules(rules);

        });

        

        // add in button div
        var button_div = document.createElement('div');
        button_div.className = "style_button_div";
        $('.example_content')[0].appendChild(document.createElement('br'));
        $('.example_content')[0].appendChild(document.createElement('br'));
        $('.example_content')[0].appendChild(document.createElement('br'));


        $('.example_content')[0].appendChild(button_div);

        
    }

    // eg: style_text == 'note', style_type = 'bold' ... 
    // search for id --> 'note' + 'folder_id' + '_' + 'bold'
    // to be used for B, I, U   .... text styles
    // sets up the toggling of values for the B, I, U styles (or any others that can have only two states)
    // ex: id of bold button:   text-after-style-bar'folder_id'_font-weight
    // toggle(text-after-style-bar, folder id, font-weight)
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

                // alert($(this).attr('value'));
            });
        }
    }

     /**
     * given a rule to style, and the folder id, this creates the toolbar
     * for that folder and that rule with unique ids that include the folder id
     * and the rule word itself.
     * ex: createStyleToolbar('note', 2)
     * or, createStyleToolbar('q', 3);
     * or, for custom styles
     * ---- >     start-style-bar'id'

     ex: createStyleToolbar('text-after-style-bar', fList[i].folder_id)
     id of bold button:   text-after-style-bar'folder_id'_font-weight
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
     * Trying to grab all rule objects of a given folder/subject
     * styleDiv is the style div of that folder.
     * folderID and folderName is well... id and name of the folder
     
     */
    function getSubjectRules(styleDiv, folderID, folderName, rulename) {
        $('#submit_' + folderID + rulename).bind('click', {id: folderID, name: folderName, div: styleDiv, rule: rulename}, function(event) {
            

            var rulesForThisFolder = getRulesList(event.data.div, event.data.id, event.data.name, event.data.rule);

            var postParam = {
                rules: JSON.stringify(rulesForThisFolder)
            };

            console.log("RULES SENT:  " + postParam.rules);
            
            $.post('/updateCSS', postParam, function(responseJSON) {
                $('.example_content')[0].innerHTML = '<span id="rule-header">STYLE RULES</span><span class="circle close-button">X</span>';
                $('.example_overlay')[0].style.display = "table";
                $('.example_content')[0].style.display = "table-cell";

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

    /** rules list of the folder given
     *
     */
    function getRulesList(styleDiv, folder_id, folder_name, rulename) {
        var rulesForThisFolder = [];
        $(styleDiv).find('.rule_div').each(function(i) {
                var name = $(this).find('.rulename')[0].value.replace(/^[^A-Z0-9]+|[^A-Z0-9]+$/ig, '').replace(/\s+/g, '').replace('\'', '');
                if(!document.getElementById('rulename_' + folder_id + name)) { 
                    if(rulename !== "") {
                        name = rulename;
                    } else {
                        name = "";
                    }
                }
                
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

                    // "container": 
                    // {
                    //     "style":
                    //     {
                    //         "background-color": $(this).find('.box')[0].checked ? "white" : "inherit",
                    //         "text-align": $(this).find(".center")[0].checked ? "center" : "left"
                    //     }
                    // }
                }

                // if(rule["after"]["endSeq"] === "" && rule["after"]["endSeq"] !== "99999999999") {
                //     delete rule["after"];
                // } 

                // if(rule["after"]) {
                //     if(rule["after"]["style"]["font-weight"] === "none") {
                //         delete rule["after"]["style"]["font-weight"];
                //     }

                //     if(rule["after"]["style"]["font-style"] === "none") {
                //         delete rule["after"]["style"]["font-style"];
                //     }

                //     if(rule["after"]["style"]["text-decoration"] === "none") {
                //         delete rule["after"]["style"]["text-decoration"]
                //     }

                // }


                // trying to do Nick's styling requests for container object; - sm15 
                // #TODO: Do the same with rule.after as with rule.container
                // in other words, don't send an rule.after object if nothing is specified.
                if($('#box_' + folder_id + rulename)[0].checked) {
                    rule["container"] = {};
                    rule["container"]["style"] = {}
                    rule["container"]["style"]["background-color"] = "rgba(255, 255, 255, 0.35)";
                    rule["container"]["style"]["padding"] = "4px";
                    rule["container"]["style"]["padding-left"] = "7px";
                    rule["container"]["style"]["padding-right"] = "7px";
                }

                if($('#center_' + folder_id + rulename)[0].checked) {
                    if(!rule["container"]) {
                        rule["container"] = {};
                        rule["container"]["style"] = {}
                        rule["container"]["style"]["text-align"] = "center";
                    } else {
                        rule["container"]["style"]["text-align"] = "center";
                    }
                }

                if($('#box_' + folder_id + rulename)[0].checked && $('#center_' + folder_id + rulename)[0].checked) {
                    rule["container"]["style"]["display"] = "table";
                    rule["container"]["style"]["margin"] = "auto";
                }

                rulesForThisFolder.push(rule);
                
               
            
                
            });
            return rulesForThisFolder;
        }

    /**
     * get the value for the styling toolbar buttons according to their unique id
     * on clicking the save style button, so we can updates for each style

     ex: id of bold button:   text-after-style-bar'folder_id'_font-weight
     style_text = 'text-after-style-bar'
     style_type = 'font-weight'
     folder_id = folder id ...
     */
    function getButtonValue(style_text, style_type, folder_id, rulename) {
        // ex: note2_bold
        // alert(style_type);
        if(style_type === 'font-style' || style_type === 'font-weight' || style_type === 'text-decoration') {
            return $(document.getElementById(style_text + folder_id + rulename + '_' + style_type)).attr('value');
        } 

        if(style_type === "font-family") {
            if($(document.getElementById(style_text + folder_id + rulename + '_' + style_type)).val()) {
                return $(document.getElementById(style_text + folder_id + rulename + '_' + style_type)).val();
            } else {
                return 'Open Sans';
            } 
        } 

        if(style_type === "font-size") {
            // alert("FONT SIZEEEE");
            //alert($(document.getElementById(style_text + folder_id + rulename + '_' + style_type)).val());
            if($(document.getElementById(style_text + folder_id + rulename + '_' + style_type)).val() === "Small") {
                return '17px';
            } else if($(document.getElementById(style_text + folder_id + rulename + '_' + style_type)).val() === "Medium") {
                return '22px';
            } else if($(document.getElementById(style_text + folder_id + rulename + '_' + style_type)).val() === "Big"){
                return '30px';
            } else {
                return '17px';
            }
        }
    }


    /*
     *
     */
    function getTriggerEndSequence(inner_div, folderID, rulename) {

        return $(inner_div).find('.newline-trigger')[0].checked ? "99999999999" : document.getElementById('trigger-end-sequence_' + folderID + rulename).value;
    }

    /*
     *
     */
    function getAfterEndSequence(inner_div, folderID) {
        return $(inner_div).find(".newline-text-after")[0].checked ? "99999999999" : $(inner_div).find('.text-after-end-sequence')[0].value;
    }

   
/* 

Rule:
{
  "associated_folder_id": event.data.id,
  "associated_folder_name": event.data.name,
  "name": "string"
  "trigger":
  {
    "word": "string",
    "endSeq": "thing typed in box if they typed something", "<br>\u200b" if they checked newline
    "style": 
    {
        "font-weight":"bold",
        "font-style": "italic",
        "text-decoration":"underline",
        "font-family": "Times New Roman",
        "font-size": "small/medium/big"

    }
  }

  "after":
  {
    "endSeq": "thing they typed in the style text after box" or "<br>\u200b" if they checked newline
    "style": 
    {
        "font-weight":"bold",
        "font-style": "italic",
        "text-decoration":"underline",
        "font-family": "Times New Roman",
        "font-size": "small/medium/big"

    }
  }

  "container":
  {
    "style": 
    {
        
    }
  }
}



Rules can take the following forms based on what is defined:

<style1> trigger.word </style1>
<style1> trigger.word (stuff) trigger.endSeq </style1>
<style1> trigger.word </style1> <style2> (stuff) after.endSeq </style2>
<style1> trigger.word (stuff) trigger.endSeq </style1> <style2> (stuff) after.endSeq </style2>

... any of the above but inside of a div (if container and container.style are defined). The div can center things/box things/do whatever css can do.

*/

/*  if(no box is checked -- no style object)
    
    if 'boxed' is checked -- style {
        "background-color": --
    }

    if 'center' is checked -- style {
        "text-align": --
    }

*/


    $('.close-button').click(function() {
        closeStyleMenu();
    });
     

    /**
     * Click handler for the save styles button
     * #TODO: DO we need this ?
     */
    function closeStyleMenu() {
        // var updated_styles = styleChangesToSave();
      
        // clear the style editing overlay
        prevEditingHTML = $('.example_content').html();
        $('.example_content')[0].innerHTML = '<span id="rule-header">STYLE RULES</span><span class="circle close-button">X</span>';
        $('.example_overlay')[0].style.display = "none";
        $('.example_content')[0].style.display = "none";
        $('.close-button').click(function() {
            closeStyleMenu();
        });

    }


/* 

Rule:
{
    "associated_folder_id": event.data.id,
    "associated_folder_name": event.data.name,
    "name": "string"
    "trigger":
      {
        "word": "string",
        "endSeq": "thing typed in box if they typed something", "<br>\u200b" if they checked newline
        "style": 
        {
            "font-weight":"bold",
            "font-style": "italic",
            "text-decoration":"underline",
            "font-family": "Times New Roman",
            "font-size": "small/medium/big"

        }
      }

      "after":
      {
        "endSeq": "thing they typed in the style text after box" or "<br>\u200b" if they checked newline
        "style": 
        {
            "font-weight":"bold",
            "font-style": "italic",
            "text-decoration":"underline",
            "font-family": "Times New Roman",
            "font-size": "small/medium/big"

        }
      }

      "container":
      {
        "style": 
        {
            
        }
      }
}


    /**
     * Trying to populate a custom style menu with existing style rules
     * Input --> List of 'rule objects where each object is in the exact format I sent them back to the server'

     * random notes:
     <select class="font-family" id="' + style + id + '_font-family">
     <div class="boldButton" id="' + style + id + rulename + '_font-weight" value="none" name="bold">B</div> \
            
     *
     */
    function createExistingStyleRules(rules) {
        for(var i = 0; i < rules.length; i++) {
            var rule = rules[i];

            var rulename = rule.name;
            var rulename_id = rulename.replace(/^[^A-Z0-9]+|[^A-Z0-9]+$/ig, '').replace(/\s+/g, '').replace('\'', '');
            
            var folder_id = rule.associated_folder_id;
            var folder_name = rule.associated_folder_name;
            var inner_div = document.getElementById('inner_style_div_' + folder_id);
    
            $(inner_div).prepend('<span class="circle arrow-right existing-styles-collapse" id="existing-styles-collapse_' + folder_id + rulename_id + '"></span>' +
                '<span class="new-style-header" id="new-style-header_' +folder_id +rulename_id+'">' + rulename + '</span>' + 
                '<span class="delete_icon delete_icon_styles" id="delete_icon_' + folder_id + rulename_id + '"></span>' +
            '<div class="rule_div" id="rule_div_' + folder_id + rulename_id + '">' +
                'Rule <input type="text" class="rulename" placeholder="Name" id="rulename_' + folder_id + rulename_id + '" maxlength="20"></input><br>    \
                should start with <input type="text" class="rulestart" id="rulestart_' + folder_id + rulename_id + '" placeholder="Character String" maxlength="15"></input><br>  \
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
                '<span>with these styles </span><br>' 
                + createStyleToolbar('text-after-style-bar', folder_id, rulename_id) +
                '<input type="checkbox" name="boxed" value="box" class="box" id="box_' + folder_id + rulename_id+ '"></input>  Box this rule<br>' +
                '<input type="checkbox" name="centered" value="center" class="center" id="center_' + folder_id + rulename_id + '"></input>   Center this rule<br><br></div>' +
                '<div class="submit-button" id="submit_' + folder_id + rulename_id + '">SAVE</div>' + 
            '</div><br id="line_break_' + folder_id + rulename_id +'">');
            
            
            
             $('#rule_div_' + folder_id + rulename_id).find('.additional-style-collapse').bind('click', {id: folder_id, name: rulename_id}, function(event) {
                $('#extra_styles_div_' + event.data.id + event.data.name).slideToggle(175);
                if($(this).hasClass('arrow-right')) {
                    $(this).removeClass('arrow-right');
                    $(this).addClass('arrow-down');
                } else {
                    $(this).removeClass('arrow-down');
                    $(this).addClass('arrow-right');
                }
            });

            $('#existing-styles-collapse_' + folder_id + rulename_id).bind('click', {id: folder_id, name: rulename_id}, function(event) {
                $('#rule_div_' + event.data.id + event.data.name).slideToggle(175);
                if($(this).hasClass('arrow-right')) {
                    $(this).removeClass('arrow-right');
                    $(this).addClass('arrow-down');
                } else {
                    $(this).removeClass('arrow-down');
                    $(this).addClass('arrow-right');
                }
            });

            $('#delete_icon_' + folder_id + rulename_id).bind('click', {id:folder_id, folder: folder_name, rule:rulename_id}, function(event) {
                var list = getRulesList(document.getElementById(event.data.id), event.data.id, event.data.folder, event.data.rule);
                var deleted_rule_name = $('#new-style-header_' + event.data.id + event.data.rule)[0].innerText;
               

                var postParam = {
                    rules_list : JSON.stringify(list),
                    deleted_rule: deleted_rule_name,
                    subject: event.data.folder
                }

                $.post('/deleteRule', postParam, function(responseJSON) {
                    $('#existing-styles-collapse_' + event.data.id + event.data.rule).remove();
                    $('#new-style-header_' + event.data.id + event.data.rule).remove();
                    $('#delete_icon_' + event.data.id + event.data.rule).remove();
                    $('#rule_div_' + event.data.id + event.data.rule).remove();
                    $('#line_break_' + event.data.id + event.data.rule).remove();
                });
            });

            var ruleform = $(inner_div).find('#rule_div_' + folder_id + rulename_id);

            if(document.getElementById('rulename_' + folder_id + rulename_id) !== null) {


                // populate rulename
                document.getElementById('rulename_' + folder_id + rulename_id).value = rulename ? rulename: "";

                // populate rule 'starts with word'
                document.getElementById('rulestart_' + folder_id + rulename_id).value = rule.trigger.word ? rule.trigger.word : "";
                var start_style_bar = document.getElementById('#start-style-bar' + folder_id + rulename_id);

                // populate start (trigger word) style bar
                // <div class="boldButton" id="' + style + id + rulename + '_font-weight" value="none" name="bold">B</div> \
               
                console.log(rule["container"]);
                if(rule.trigger["style"]["font-weight"] == "bold") {
                    $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-weight')).attr('value','bold');
                    $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-weight')).css('background-color','rgba(0,0,0,0.3)');
                    
                } else {
                    $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-weight')).attr('value', 'none');
                    $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-weight')).css({"background-color": "inherit"});
                }

                if(rule.trigger["style"]["font-style"] == "italic") {

                   $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-style')).attr('value', 'italic');
                   $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-style')).css('background-color','rgba(0,0,0,0.3)');
                } else {
                   $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-style')).attr('value', 'none');
                   $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-style')).css({"background-color": "inherit"});
                }

                if(rule.trigger["style"]["text-decoration"] == "underline") {
                   $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_text-decoration')).attr('value', 'underline');
                   $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_text-decoration')).css("background-color", "rgba(0,0,0,0.3)");
                } else {
                    $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_text-decoration')).attr('value', 'none');
                    $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_text-decoration')).css({"background-color": "inherit"});
                }

                document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-family').value = rule["trigger"]["style"]["font-family"];


                if(rule["after"]["style"]['font-size'] === "17px") {
                    $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-size')).val("Small");
                } else if(rule["after"]["style"]["font-size"] === "22px") {
                    $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-size')).val("Medium");
                } else {
                    $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-size')).val("Big");
                }

                // document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-size').value = rule["trigger"]["style"]["font-size"];

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
                }

                // style text after this rule until
                if(rule.after.endSeq !== "99999999999") {
                    document.getElementById('text-after-end-sequence_' + folder_id + rulename_id).value = rule.after.endSeq ? rule.after.endSeq : "";
                } else {
                    document.getElementById('newline-text-after_' + folder_id + rulename_id).checked = true;
                }

                // with these styles...
                var after_style_toolbar = document.getElementById('text-after-style-bar' + folder_id + rulename_id);

                if(rule.after["style"]["font-weight"] == "bold") {
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-weight')).attr('value', 'bold');
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-weight')).css("background-color", "rgba(0,0,0,0.3)");
                } else {
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-weight')).attr('value', 'none');
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-weight')).css({"background-color": "inherit"});
                }

                if(rule.after["style"]["font-style"] == "italic") {
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-style')).attr('value', 'italic');
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-style')).css("background-color", "rgba(0,0,0,0.3)");
                } else {
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-style')).attr('value','none');
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-style')).css("background-color", "inherit");
                }

                if(rule.after["style"]["text-decoration"] == "underline") {
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_text-decoration')).attr('value','underline');
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_text-decoration')).css("background-color", "rgba(0,0,0,0.3)");
                } else {
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_text-decoration')).attr('value','none');
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_text-decoration')).css({"background-color": "inherit"});
                }

                document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-family').value = rule["after"]["style"]["font-family"];

                if(rule["after"]["style"]['font-size'] === "17px") {
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-size')).val("Small");
                } else if(rule["after"]["style"]["font-size"] === "22px") {
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-size')).val("Medium");
                } else {
                    $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-size')).val("Big");
                }
                

                // box this rule... 

                if(rule["container"] && rule["container"]["style"]["background-color"]) {
                    document.getElementById('box_' + folder_id + rulename_id).checked = true;
                }

                // center this rule ...
              
                if(rule["container"] && rule["container"]["style"]["text-align"]) {
                   document.getElementById('center_' + folder_id + rulename_id).checked = true;
                }

            }

            getSubjectRules(document.getElementById(folder_id), folder_id, folder_name, rulename_id);
         
        }
    }
});




