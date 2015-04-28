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
            var json = $(".data");
            var jsonArray = JSON.parse(json.text());
            fList = jsonArray;
            // alert("CALLBACK");
            displayTitles(jsonArray);



            //displayTitles(folders);
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

            var main_note_div = document.createElement('main_note_div');
            main_note_div.className = 'main_note_div';
            folder_div.appendChild(main_note_div);

            
            $(folder_div).find('.delete_icon').bind('click', {name: fList[i].folder_name}, function(event) {
                var postParam = {
                    folder: event.data.name
                }
                alert("FOLDER TO DELETE: " + postParam);
                
                $.post('/deleteFolder', postParam, function(responseJSON) {
                    // #TODO: returns boolean for successful deletion of folders, check for that and dsiplay to user
                    // appropriately.
                    window.location.href = '/notes';
                });
            });
            



            for(var j = 0; j < folderList[i].notes.length; j++) {
                var notes_div = document.createElement("div");
                notes_div.className = "note_name_div";
                notes_div.id = folderList[i].notes[j].note_id;
                notes_div.innerHTML = folderList[i].notes[j].note_name;
                $(notes_div).append('<div class="delete_icon delete_icon_notes" id="delete_icon_' + notes_div.id + '"></div>');
                main_note_div.appendChild(notes_div);
                $(notes_div).bind('click', {name: folderList[i].folder_name}, function(event) {
                    window.location.href = '/getNote/' + event.data.name + "/" +  this.id;
                });

                $(notes_div).find('.delete_icon').bind('click', {id: folderList[i].notes[j].note_id, folder: folderList[i].folder_name}, function(event) {
                    var postParam = {
                        note_id: event.data.id,
                        subject: event.data.folder
                    }

                    // #TODO response is a boolean indicating successful deletion, 
                    // handle it.
                    $.post('/deleteNote', postParam, function(responseJSON) {
                        window.location.href = '/notes';
                    });
                });

                $(notes_div).hover(function() {
                    $(this).find('.delete_icon').css({'visibility':'visible'}); 
                },function() {
                    $(this).find('.delete_icon').css({'visibility':'hidden'}); 
                });
            }

            $(main_note_div)[0].style.display='none';

            $(folder_div).find('.title').bind('click', {notes: main_note_div}, function(event) {
                console.log(event.data.notes);
                // if($(this.innerHTML)[0].className === 'arrow-down') {
                //     console.log("I'm at arrow down");
                //     $(this).html('<span class="arrow-up" id="main-page-arrow"></span>');
                // } else {
                //     $(this).html('<span class="arrow-down" id="main-page-arrow"></span>');
                // }
                $(event.data.notes).slideToggle(175);
                    
              
                
            });



            $('#main-div').append(folder_div);

        }
     }

     /**
      * Helper function to create the 'add section + sign button'
      */
     function createCircleDiv(folderDiv, header_span) {
        var circle = document.createElement("div");
        circle.className = "circle";
        circle.innerText = '+';
        header_span.appendChild(circle);
        $(circle).attr('contenteditable','false');
        $(circle).click(function(event) {
            createNewNote(folderDiv);
            
            // #TODO: send info about the new note to server.
        });
     }


     /**
      * Helper function to create flashcard button
      */
    function createFlashcardDiv(folderDiv, folderName) {
        // var circle = document.createElement('div');
        // circle.className = 'circle';
        // circle.innerHTML = 'F';
        // folderDiv.appendChild(circle);
        // $(circle).attr('contenteditable', 'false');
        // $(circle).click(function(event) {
            
          
        //     $.get("/getNewSession/" + encodeURIComponent(folderName), function() {

        //     });
        // });
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
        $(new_note_div).html('<span class="note_title">NEW NOTE</span>');
        $(new_note_div).find('.note_title').attr('contenteditable','true');
        console.log($(folderDiv).find('.folder_header_span'));
        $(new_note_div).attr('folder', $(folderDiv).find('.title')[0].innerText);
        new_note_div.id = -1;
        console.log("NEW NOTE ID: " + new_note_div.id);

        // new_note_div.innerHTML = "NEW  NOTE";
        $(new_note_div).append('<div class="delete_icon" id="delete_icon_' + -1 + '"></div>');
        folderDiv.appendChild(new_note_div);
        

    
        $(new_note_div).hover(function() {
            if($(this).find('.delete_icon') != null) {
                $(this).find('.delete_icon')[0].style.display='inline-block';
            }
            
        }, function() {
           if($(this).find('.delete_icon') != null) {
                $(this).find('.delete_icon')[0].style.display='none';
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
     * click handler for the save changes button on the main page
     * sends information in the above format about new folders
     * and notes to the server.
     */
     function saveClick() {
        /* Find all new folders added */
        console.log($(document).find('.new_folder_name_div'));
        var new_folders = [];
        $('.new_folder_name_div').each(function(j) {
            this.id = -1;
            var folder_data = {
                "folder_id": this.id,
                "title": $(this).find('.title')[0].innerText
            }
            new_folders.push(folder_data);
            // console.log(folder_data);
        });


        /* Find all new notes */
        console.log($(document).find('.new_note_name_div'));
        var newNotes = [];
        $('.new_note_name_div').each(function(i) {
            var noteData = {
                "note_id":-1,
                "associated_folder_name": $(this).attr('folder'),

                "title":$(this).find('.note_title')[0].innerText
            }
            newNotes.push(noteData);
            alert(noteData);
        });

        // POST REQUEST TO SERVER INFORMING OF NEW NOTE(S)
        var postParam = {
            folders: JSON.stringify(new_folders),
            notes: JSON.stringify(newNotes)
        }
        console.log(postParam);
        $.post("/updateNotes", postParam, function(responseObject) {
            window.location.href = '/notes';
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
        var header_span = document.createElement('span');
        header_span.className = 'folder_header_span';
        // $(header_span).attr('contenteditable', 'true');
        $(new_folder_div).html(header_span);
        new_folder_div.className = "new_folder_name_div";
        
        header_span.innerHTML = '<span class="title">NEW FOLDER</span>';

        new_folder_div.id = folder_num_counter + 1;

        $(new_folder_div).find('.title').attr('contenteditable', 'true');
        createCircleDiv(new_folder_div, header_span);
        // $(header_span).append('<div class="delete_icon id="delete_icon_' + -1 + '"></div>');
        // createFlashcardDiv(header_span);
       
        $('#main-div').append(new_folder_div);

        // $(header_span).hover(function() {
//             $(this).find('.flashcard_icon')[0].style.display = 'inline';
            // console.log($(this).find('.delete_icon'));
            // $(this).find('.flashcard_icon')[0].style.display = 'inline';
            // $(this).find('.delete_icon')[0].style.display = 'inline-block';
        // }, function() {
            // $(this).find('.flashcard_icon')[0].style.display = 'none';
            // $(this).find('.delete_icon')[0].style.display = 'none';
        // });

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
            
            '<span class="circle collapse-main arrow-right"></span>' + '<span>' + '       ' + 
            fList[i].folder_name  + 
            '<div class="inner_style_div" id="inner_style_div_' + fList[i].folder_id + '">' + 
                '<span class="new-style-header-to-add"> New Style <span class="circle" id="style-circle">+</span></span>' + 
                '<div class="rule_div" id="rule_div_' + fList[i].folder_id + '">' +
                'Rule <input type="text" class="rulename" placeholder="Name" id="rulename_' + fList[i].folder_id + '"></input><br>    \
                should start with <input type="text" class="rulestart" id="rulestart_' + fList[i].folder_id + '" placeholder="Character String"></input><br>  \
                and have these styles: <br>' + 
                createStyleToolbar('start-style-bar', fList[i].folder_id, "") + 
                '<span class="extra_styles_title" id="extra_styles_title_' + fList[i].folder_id + '"><span class="circle additional-style-collapse arrow-right"><span class="arrow-down"></span></span>' +
                '  Additional Styles</span><br>' +
                '<div class="extra_styles_div" id="extra_styles_div_' + fList[i].folder_id + '"><span>Extend these styles until</span><br>'  
                + '<input type="text" class="trigger-end-sequence" id="trigger-end-sequence_' + fList[i].folder_id + '" placeholder = "Character String"></input>  OR \
                <input type="checkbox" class="newline-trigger"></input>  Newline<br><br>' + 
                'Style text after this rule until<br>'
                + '<input type="text" class="text-after-end-sequence" id="text-after-end-sequence_' + fList[i].folderID + '" placeholder = "Character String"></input>  OR \
                <input type="checkbox" class="newline-text-after"></input>  Newline<br>' + 
                '<span style="margin-left:3%">with these styles</span> <br>' 
                + createStyleToolbar('text-after-style-bar', fList[i].folder_id, "") +
                '<input type="checkbox" name="boxed" value="box" class="box"></input>  Box this rule<br>' +
                '<input type="checkbox" name="centered" value="center" class="center"></input>   Center this rule<br><br></div><br>' +
                '<div class="submit-button" id="submit_' + fList[i].folder_id + '">SAVE</div>' + 
                '</div>' + 
            '</div>'); 

         
            
            
            setTextStyleToggle('text-after-style-bar', fList[i].folder_id, "", 'font-weight');
            setTextStyleToggle('text-after-style-bar', fList[i].folder_id, "", 'font-style');
            setTextStyleToggle('text-after-style-bar', fList[i].folder_id, "", 'text-decoration');
            setTextStyleToggle('start-style-bar', fList[i].folder_id, "", 'font-weight');
            setTextStyleToggle('start-style-bar', fList[i].folder_id, "", 'font-style');
            setTextStyleToggle('start-style-bar', fList[i].folder_id, "", 'text-decoration');

            addStyleClickHandler(style_div, fList[i].folder_id, fList[i].folder_name);
            
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


        }


        // get the existing style rules from the server here!!
        var getParams = {};
        var rules = [];
        $.get('/getRules', getParams, function(responseJSON) {
             // var responseObject = JSON.parse(responseJSON);
             console.log("RULESSSSSSSSSS PLZ: " + responseJSON);
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
        // alert(rulename);
        var button = $('.style-toolbar').find('#' + style_text + folder_id + rulename + '_' + style_type);
        if(style_type === 'font-weight' || style_type === 'font-style' || style_type === 'text-decoration') {
            button.click(function(event) {

                if($(this).attr('value') === 'none') {
                    var new_val = $(this).attr('name');
                    $(this).attr('value', new_val);
                    console.log($(this).attr('value'));
                    alert("once");
                    $(this).css('background-color', 'rgba(0,0,0,0.3)');
                } else if($(this).attr('value') === $(this).attr('name')) {
                    console.log("HELLO");
                    $(this).attr('value', 'none');
                    $(this).css('background-color','inherit');
                    alert("twice");
                }
                
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
            <div class="italicButton" id="' +  style + id + rulename + '_font-style" value = "none" name="italic">i</div> \
            <div class="underlineButton" id="' + style + id + rulename + '_text-decoration" value="none" name="underline">U</div> \
            <select class="font-family" id="' + style + id + rulename + '_font-family">    \
                <option selected="selected" disabled="disabled">Font Type</option>  \
                <option value="Arial">Arial</option> \
                <option value="Helvetica">Helvetica</option> \
                <option value="Sans Serif">Sans Serif</option> \
                <option value="Times New Roman">Times New Roman</option> \
            </select> \
            <select class="font-size" id="' + style + id + rulename + '_font-size" >   \
                <option selected="selected" disabled="disabled">Font Size</option>  \
                <option value="Small">Small</option>    \
                <option value="Medium">Medium</option>  \
                <option value="Big">Big</option>    \
            </select> \
        </div><br><br>';

    }


    function addStyleClickHandler(styleDiv, folderID, folderName) {
        $('#submit_' + folderID).bind('click', {id: folderID, style_div: styleDiv, name: folderName}, function(event) {
            var inner_div = $(event.data.style_div).find('#inner_style_div_' + event.data.id);
            var rule = 
            {   
                "associated_folder_id": event.data.id,
                "associated_folder_name": event.data.name,
                "name": document.getElementById('rulename_' + event.data.id).value,
                "trigger":
                {
                    "word": document.getElementById('rulestart_' + event.data.id).value,
                    "endSeq": getTriggerEndSequence(inner_div, event.data.id),
                    "style": 
                    {
                        "font-weight": getButtonValue('start-style-bar', 'font-weight', event.data.id),
                        "font-style": getButtonValue('start-style-bar', 'font-style', event.data.id),
                        "text-decoration": getButtonValue('start-style-bar', 'text-decoration', event.data.id),
                        "font-family": getButtonValue('start-style-bar', 'font-family', event.data.id),
                        "font-size": getButtonValue('start-style-bar', 'font-size', event.data.id),
                    }
                },

                "after": 
                {
                    "endSeq": getAfterEndSequence(inner_div, event.data.id),
                    "style": 
                    {
                        "font-weight": getButtonValue('text-after-style-bar', 'font-weight', event.data.id),
                        "font-style": getButtonValue('text-after-style-bar', 'font-style', event.data.id),
                        "text-decoration": getButtonValue('text-after-style-bar', 'text-decoration', event.data.id),
                        "font-family": getButtonValue('text-after-style-bar', 'font-family', event.data.id),
                        "font-size": getButtonValue('text-after-style-bar', 'font-size', event.data.id),
                    }
                },

                "container": 
                {
                    "style":
                    {
                        "background-color": $(inner_div).find('.box')[0].checked ? "white" : "inherit",
                        "text-align": $(inner_div).find(".center")[0].checked ? "center" : "left"
                    }
                }
            }

            var postParam = {
                rule: JSON.stringify(rule)
            }
            $.post('/updateCSS', postParam, function() {

            });
            
        });
    }

    /**
     * get the value for the styling toolbar buttons according to their unique id
     * on clicking the save style button, so we can updates for each style

     ex: id of bold button:   text-after-style-bar'folder_id'_font-weight
     style_text = 'text-after-style-bar'
     style_type = 'font-weight'
     folder_id = folder id ...
     */
    function getButtonValue(style_text, style_type, folder_id) {
        // ex: note2_bold
        if(style_type === 'font-style' || style_type === 'font-weight' || style_type === 'text-decoration') {
            return $(document.getElementById(style_text + folder_id + '_' + style_type)).attr('value');
        } else if(style_type === 'font-family' || style_type === 'font-size' || style_type === 'text-align') {
            if($(document.getElementById(style_text + folder_id + '_' + style_type)).val()) {
                return $(document.getElementById(style_text + folder_id + '_' + style_type)).val();
            } else if(style_type === 'font-family') {
                return 'Arial';
            } else {
                return 'Medium';
            }
        }
    }

    /*
     *
     */
    function getTriggerEndSequence(inner_div, folderID) {
        return $(inner_div).find('.newline-trigger')[0].checked ? "<br>\u200b" : document.getElementById('trigger-end-sequence_' + folderID).value;
    }

    /*
     *
     */
    function getAfterEndSequence(inner_div, folderID) {
        return $(inner_div).find(".newline-text-after")[0].checked ? "<br>\u200b" : $(inner_div).find('.text-after-end-sequence')[0].value;
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
        // console.log("POST PARAMS: " + JSON.stringify(updated_styles));
        var postParam = {
            // styles_on_save: JSON.stringify(updated_styles)
            
        };

        $.post('/updateCSS', postParam, function(responseJSON) {
            // response may be not needed
        });

        // clear the style editing overlay
        prevEditingHTML = $('.example_content').html();
        $('.example_content')[0].innerHTML = '<span id="rule-header">STYLE RULES</span><span class="circle close-button">X</span>';
        $('.example_overlay')[0].style.display = "none";
        $('.example_content')[0].style.display = "none";
        $('.close-button').click(function() {
            closeStyleMenu();
        });

    }


/* SAMPLE EXISTING RULES */
    var rule1 = {
        "associated_folder_id":22,
        "associated_folder_name": "CS 22: Discrete Structures and Probabilty",
        "name": "quotes once more plz(^((&$#$%",
        "trigger":
        {
            "word": "quotes plz",
            "endSeq": "stop plz",
            "style":
            {
                "font-weight":"bold",
                "font-style":"none",
                "text-decoration":"none",
                "font-family": "Helvetica",
                "font-size":"Big"
            }
        },

        "after":
        {
            "endSeq": '<br>',
            "style":
            {
                "font-weight":"none",
                "font-style":"italic",
                "text-decoration":"underline",
                "font-family": "Helvetica",
                "font-size":"Big"
            }

        },

        "container":
        {
           "style":
           {
                "background-color":'inherit',
                "text-align":'center'
            }
        }
    };
    
    var rule2 = {
        "associated_folder_id":22,
        "associated_folder_name": "CS 22: Discrete Structures and Probabilty",
        "name": "one more quotes though",
        "trigger":
        {
            "word": "quotes plz",
            "endSeq": "stop plz",
            "style":
            {
                "font-weight":"bold",
                "font-style":"none",
                "text-decoration":"none",
                "font-family": "Helvetica",
                "font-size":"Big"
            }
        },

        "after":
        {
            "endSeq": '<br>',
            "style":
            {
                "font-weight":"none",
                "font-style":"italic",
                "text-decoration":"underline",
                "font-family": "Helvetica",
                "font-size":"Big"
            }

        },

        "container":
        {
           "style":
           {
                "background-color":'inherit',
                "text-align":'center'
            }
        }
    };

    var rule3 = {
        "associated_folder_id":24,
        "associated_folder_name": "History",
        "name": "is this quotes though",
        "trigger":
        {
            "word": "Tushar is a viking",
            "endSeq": "ehhhhh",
            "style":
            {
                "font-weight":"bold",
                "font-style":"none",
                "text-decoration":"none",
                "font-family": "Helvetica",
                "font-size":"Big"
            }
        },

        "after":
        {
            "endSeq": 'some random end sequence',
            "style":
            {
                "font-weight":"bold",
                "font-style":"none",
                "text-decoration":"underline",
                "font-family": "Times New Roman",
                "font-size":"Small"
            }

        },

        "container":
        {
           "style":
           {
                "background-color":'inherit',
                "text-align":'center'
            }
        }
    };

   
    // rules.push(rule2);
    // rules.push(rule1);
    // rules.push(rule3);

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
        console.log("length:    " + rules.length);
        for(var i = 0; i < rules.length; i++) {
          
            var rule = rules[i];

            var rulename = rule.name;
            // alert(rule);
            var rulename_id = rulename.replace(/^[^A-Z0-9]+|[^A-Z0-9]+$/ig, '').replace(/\s+/g, '').replace('\'', '');
            console.log("RULENAME PARSED: " + rulename_id);
            var folder_id = rule.associated_folder_id;
            var folder_name = rule.associated_folder_name;
            var inner_div = document.getElementById('inner_style_div_' + folder_id);
            console.log(inner_div);
            // console.log(createRuleForm(folder_id, rulename));
            $(inner_div).prepend('<span class="circle arrow-right existing-styles-collapse" id="existing-styles-collapse_' + folder_id + rulename_id + '"></span>' +
                '<span class="new-style-header">' + rulename + '</span>' + 
            '<div class="rule_div" id="rule_div_' + folder_id + rulename_id + '">' +
                'Rule <input type="text" class="rulename" placeholder="Name" id="rulename_' + folder_id + rulename_id + '"></input><br>    \
                should start with <input type="text" class="rulestart" id="rulestart_' + folder_id + rulename_id + '" placeholder="Character String"></input><br>  \
                and have these styles: <br>' + 
                createStyleToolbar('start-style-bar', folder_id, rulename_id) + 
                '<span class="extra_styles_title" id="extra_styles_title_' + folder_id + rulename_id + '">' + 
                '<span class="circle additional-style-collapse arrow-right" id="additional-style-collapse_' + folder_id + rulename_id + '">' +
                '<span class="arrow-down"></span></span>' +
                '  Additional Styles</span><br>' +
                '<div class="extra_styles_div" id="extra_styles_div_' + folder_id + rulename_id + '"><span>' + 
                'Extend these styles until<br>'   
                + '<input type="text" class="trigger-end-sequence" id="trigger-end-sequence_' + folder_id + rulename_id + '" placeholder = "Character String"></input>  OR \
                <input type="checkbox" class="newline-trigger" id="' + folder_id + rulename_id + '"></input>  Newline<br><br>' + 
                'Style text after this rule until<br>'
                + '<input type="text" class="text-after-end-sequence" id="text-after-end-sequence_' + folder_id + rulename_id + '" placeholder = "Character String"></input>  OR \
                <input type="checkbox" class="newline-text-after" id="newline-text-after_' + folder_id + rulename_id + '"></input>  Newline<br>' + 
                '<span>with these styles </span><br>' 
                + createStyleToolbar('text-after-style-bar', folder_id, rulename_id) +
                '<input type="checkbox" name="boxed" value="box" class="box" id="box_' + folder_id + rulename_id+ '"></input>  Box this rule<br>' +
                '<input type="checkbox" name="centered" value="center" class="center" id="center_' + folder_id + rulename_id + '"></input>   Center this rule<br><br></div>' +
                '<div class="submit-button" id="submit_' + folder_id + rulename_id + '">SAVE</div>' + 
            '</div><br>');
            
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

            var ruleform = $(inner_div).find('#rule_div_' + folder_id + rulename_id);
            console.log(document.getElementById('rulename_' + folder_id + rulename_id));
            // populate rulename
            document.getElementById('rulename_' + folder_id + rulename_id).value = rulename ? rulename: "";

            // populate rule 'starts with word'
            document.getElementById('rulestart_' + folder_id + rulename_id).value = rule.trigger.word ? rule.trigger.word : "";
            var start_style_bar = document.getElementById('#start-style-bar' + folder_id + rulename_id);

            // populate start (trigger word) style bar
            // <div class="boldButton" id="' + style + id + rulename + '_font-weight" value="none" name="bold">B</div> \
            
            if(rule.trigger.style["font-weight"] === 'bold') {
                document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-weight').value = 'bold';
                $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-weight')).css('background-color','rgba(0,0,0,0.3)');
                
            }

            if(rule.trigger.style["font-style"] === 'italic') {
               document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-style').value = 'italic';
               $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-style')).css('background-color','rgba(0,0,0,0.3)');
            } 

            if(rule.trigger.style["text-decoration"] === 'underline') {
               document.getElementById('start-style-bar' + folder_id + rulename_id + '_text-decoration').value = 'underline';
               $(document.getElementById('start-style-bar' + folder_id + rulename_id + '_text-decoration')).css("background-color", "rgba(0,0,0,0.3)");
            }

            document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-family').value = rule.trigger.style["font-family"];
            document.getElementById('start-style-bar' + folder_id + rulename_id + '_font-size').value = rule.trigger.style["font-size"];

            // extend these styles until ...
            if(rule.trigger.endSeq != '<br>\u200b') {
                document.getElementById('trigger-end-sequence_' + folder_id + rulename_id).value  = rule.trigger.endSeq ? rule.trigger.endSeq : "";
            } else {
                document.getElementById('newline-trigger_' + folder_id + rulename_id).checked = true;
            }

            // style text after this rule until
            if(rule.after.endSeq != '<br>\u200b') {
                document.getElementById('text-after-end-sequence_' + folder_id + rulename_id).value = rule.after.endSeq ? rule.after.endSeq : "";
            } else {
                document.getElementById('newline-text-after_' + folder_id + rulename_id).checked = true;
            }

            // with these styles...
            var after_style_toolbar = document.getElementById('text-after-style-bar' + folder_id + rulename_id);

            if(rule.after.style["font-weight"] === 'bold') {
                document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-weight').value = 'bold';
                $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-weight')).css("background-color", "rgba(0,0,0,0.3)");
            }

            if(rule.after.style["font-style"] === 'italic') {
                document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-style').value = 'italic';
                $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-style')).css("background-color", "rgba(0,0,0,0.3)");
            }

            if(rule.after.style["text-decoration"] === 'underline') {
                document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_text-decoration').value = 'underline';
                $(document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-style')).css("background-color", "rgba(0,0,0,0.3)");
            }

            document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-family').value = rule.after.style["font-family"];
            document.getElementById('text-after-style-bar' + folder_id + rulename_id + '_font-size').value = rule.after.style["font-size"];
            

            // box this rule... 
            console.log("CONTAINER: " + rule.container.style);
            if(rule.container.style["background-color"] != 'inherit') {
                document.getElementById('box_' + folder_id + rulename_id).checked = true;
            }

            // center this rule ...
            if(rule.container.style["text-align"] === 'center') {
               document.getElementById('center_' + folder_id + rulename_id).checked = true;
            }


            setTextStyleToggle('start-style-bar', folder_id, rulename_id, 'font-weight');
            setTextStyleToggle('start-style-bar', folder_id, rulename_id, 'font-style');
            setTextStyleToggle('start-style-bar', folder_id, rulename_id, 'text-decoration');

            setTextStyleToggle('text-after-style-bar', folder_id, rulename_id, 'font-weight');
            setTextStyleToggle('text-after-style-bar', folder_id, rulename_id, 'font-style');
            setTextStyleToggle('text-after-style-bar', folder_id, rulename_id, 'text-decoration');

        }
    }

    /** 
     * create rule form
     */
    function createRuleForm(folderID, rulename) {
        return '<span class="circle arrow-right existing-styles-collapse" id="existing-styles-collapse_' + folder_id + rulename + '"></span>' +
                '<span class="new-style-header">' + rulename + '</span>' + 
            '<div class="rule_div" id="rule_div_' + folder_id + rulename + '">' +
                'Rule <input type="text" class="rulename" placeholder="Name" id="rulename_' + folder_id + rulename + '"></input><br>    \
                should start with <input type="text" class="rulestart" id="rulestart_' + folder_id + rulename + '" placeholder="Character String"></input><br>  \
                and have these styles: <br>' + 
                createStyleToolbar('start-style-bar', folder_id, rulename) + 
                'Extend these styles until<br>'   
                + '<input type="text" class="trigger-end-sequence" id="trigger-end-sequence_' + folder_id + rulename + '" placeholder = "Character String"></input>  OR \
                <input type="checkbox" class="newline-trigger"></input>  Newline<br><br>' + 
                'Style text after this rule until<br>'
                + '<input type="text" class="text-after-end-sequence" id="text-after-end-sequence_' + folder_id + rulename + '" placeholder = "Character String"></input>  OR \
                <input type="checkbox" class="newline-text-after"></input>  Newline<br>' + 
                '<span>with these styles </span><br>' 
                + createStyleToolbar('text-after-style-bar', folder_id, rulename) +
                '<input type="checkbox" name="boxed" value="box" class="box"></input>  Box this rule<br>' +
                '<input type="checkbox" name="centered" value="center" class="center"></input>   Center this rule<br><br>' +
                '<div class="submit-button" id="submit_' + folder_id + rulename + '">SAVE</div>' + 
            '</div><br>'
    }

/***********************


'<div class="inner_style_div" id="inner_style_div_' + fList[i].folder_id + '">' + 
    'Rule <input type="text" class="rulename" placeholder="Name" id="rulename_' + fList[i].folder_id + '"></input><br>    \
    should start with <input type="text" class="rulestart" id="rulestart_' + fList[i].folder_id + '" placeholder="Character String"></input><br>  \
    and have these styles: <br>' + 
    createStyleToolbar('start-style-bar', fList[i].folder_id) + 
    'Extend these styles until<br>'   
    + '<input type="text" class="trigger-end-sequence" id="trigger-end-sequence_' + fList[i].folder_id + '" placeholder = "Character String"></input>  OR \
    <input type="checkbox" class="newline-trigger"></input>  Newline<br><br>' + 
    'Style text after this rule until<br>'
    + '<input type="text" class="text-after-end-sequence" id="text-after-end-sequence_' + fList[i].folderID + '" placeholder = "Character String"></input>  OR \
    <input type="checkbox" class="newline-text-after"></input>  Newline<br>' + 
    'with these styles <br>' 
    + createStyleToolbar('text-after-style-bar', fList[i].folder_id) +
    '<input type="checkbox" name="boxed" value="box" class="box"></input>  Box this rule<br>' +
    '<input type="checkbox" name="centered" value="center" class="center"></input>   Center this rule<br><br>' +
    '<div class="submit-button" id="submit_' + fList[i].folder_id + '">SUBMIT</div>' + 
'</div>'





************************/



});




