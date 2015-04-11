/**
 * Handles the particular full note page
 * associated with note.ftl file
 */


///////////////////////////////////////////////////////////////
// GLOBAL VARIABLES ///////////////////////////////////////////
///////////////////////////////////////////////////////////////

// each suggestion's height in the dropdown
var SUGGESTION_CELL_HEIGHT = 30;

var rules = [];


/* GAME PLAN

1. On keyUp, detect key and get selection
	• if  space, get prior word
	• if letter, get current word*
	• if delete, get current word*

* = may not have time; low initial priority

2. Check if current selection matches a rule
	• if letter and ambiguous match such as overlapping rules 'ru' and 'rule', do nothing (wait for space)
	• if yes, remove current rule if exists and apply new rule
	• if  no, do nothing

----------

On sudden change of selection (user clicks somewhere else in text) || On sudden loss of focus,
	• use previous selection and call 1. with space character (enforce prediction)

*/

/* Rule Notation

Rule:
{
  trigger:
  {
    keyword: "string" // currently: "[a-zA-Z0-9]+[^\s]*" // future?: "[^\s]+"
    style: { ... }
  }

  After:
  {
    style: { ... }
    terminator: "string" // default/enforced?: "\n"
  }

  EntireSection:
  {
  
  }
}

*/


(function($){
  $.fn.outside = function(ename, cb){
      return this.each(function(){
          var $this = $(this),
              self = this;

          $(document).bind(ename, function tempo(e){
              if(e.target !== self && !$.contains(self, e.target)){
                  cb.apply(self, [e]);
                  if(!self.parentNode) $(document.body).unbind(ename, tempo);
              }
          });
      });
  };
}(jQuery));

function getSelectionParentElement() {
    var parentEl = null, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    return parentEl;
}

function surroundSelection(sel, elt) {
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0).cloneRange();
        range.surroundContents(elt);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

// Mozilla's regular expression escape-ifier (not sure if needed)
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

var savedRange;
var isInFocus;
function saveSelection() {
    if (window.getSelection) { //non IE Browsers
        savedRange = window.getSelection().getRangeAt(0);
        //console.log(savedRange);
    } else if (document.selection) { //IE
        savedRange = document.selection.createRange();  
    }
}

function restoreSelection(offset) {
    isInFocus = true;
    $("#noteArea").focus();
    if (savedRange != null) {
        if (window.getSelection) { //non IE and there is already a selection 
            var s = window.getSelection();
            if (s.rangeCount > 0) {
                s.removeAllRanges();
            }
            //console.log(savedRange.endContainer);
            savedRange.setEnd(savedRange.endContainer, savedRange.endOffset + offset);
            s.addRange(savedRange);
        } else if (document.createRange) { //non IE and no selection
            window.getSelection().addRange(savedRange);
        } else if (document.selection) { //IE
            savedRange.select();
        }
    }
}

// Gets the word written just prior to the cursor.
// NOTE: omits trailing special characters.
function getPrevSelection() {
    var sel, word = "";
    if (window.getSelection && (sel = window.getSelection()).modify) {
        var selectedRange = sel.getRangeAt(0);
        sel.collapseToStart();
        sel.modify("move", "backward", "word");
        sel.modify("extend", "forward", "word");
        return sel;
    }
}

// Gets the word written just prior to the cursor.
// Note: does not omit special characters; only call on space!
function getPrevWord() {
    var sel;
    if (window.getSelection && (sel = window.getSelection()).modify) {
        //sel = sel.getRangeAt(0);

        sel.collapseToStart();
        sel.modify("move", "backward", "word");
        sel.modify("extend", "forward", "word");
        console.log(sel);

        var counter = 0;

        while (/^[^\s]+$/.test(sel.toString())) {
          sel.modify("extend", "forward", "character");
          
          // Selections cannot detect end of selectable text on addition of a character--have to (for now?) break out jankily
          counter++;
          if (counter > 100) {
            console.log("--- E-brake! ---");
            break;
          }
        }

        sel.modify("extend", "backward", "character");

        return sel;
    }
}


///////////////////////////////////////////////////////////////
///////////////////////   MAIN   //////////////////////////////
///////////////////////////////////////////////////////////////


$(document).ready(function() {

	$("#noteArea").focus();

	$("#noteArea").keyup(function(event) {
    // Save caret location
		saveSelection();

		var caller = $(event.target);
		var input = caller[0].value;
		var vars = {"text": input};

		var code = event.keyCode || event.which;
		if (code == 9) {
   			// Tab
   		} else if (code == 38) {
   			// Up   Arrow
   		} else if (code == 40) {
   			// Down Arrow
   		} else if (code == 32) {
   			// Space
   			
        	var sel = getPrevWord();
        	console.log("[" + sel.toString() + "]");

        	var note = false;
        	if (sel.toString() === "note:") {
            	note = true;
            	var span = document.createElement("span");
            	span.style.fontWeight = "bold";
            	span.style.color = "#FF0000";
            	surroundSelection(sel, span);
        	}
        
        	// Restore caret location
        	restoreSelection(0);

        	if (note) {
            	console.log("uurg");
            	sel = window.getSelection();
            	var range = sel.getRangeAt(0);

            	var span = document.createElement("span");
            	span.style.fontStyle = "italic";
            	span.style.color = "#FFFF00";
            	span.innerHTML = "&#8203;"; // Zero-width space code

            	range.insertNode(span);
            	range.setStart(span, 0);
            	range.setEnd(span, 1);
            	sel.removeAllRanges();
            	sel.addRange(range);
        	}
   		} else if (code == 13) {
        	// newline (?)
        	sel = window.getSelection();
        	var parent = getSelectionParentElement(sel); 
        	//sel.modify("extend", "forward", "character");
        } else {
        	// Regular character?
        	
        	// TODO: if not styling
        	if (false) {
				// load autocomplete suggestions on every keyup
 				var postParams = {

 				}
 				$.post("/words", postParams, function(responseList) {
 					// #TODO: populate a drop-down with words from the responseList
 				});
        	}
        }
	});
});
