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


// USAGE:
// $("#mySelection").outside("click", function(event) {});
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

jQuery.fn.extend({
insertAtCaret: function(myValue, myValueE){
  return this.each(function(i) {
    if (document.selection) {
      //For browsers like Internet Explorer
      this.focus();
      sel = document.selection.createRange();
      sel.text = myValue + myValueE;
      this.focus();
    }
    else if (this.selectionStart || this.selectionStart == '0') {
      //For browsers like Firefox and Webkit based
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      this.value = this.value.substring(0,     startPos)+myValue+this.value.substring(startPos,endPos)+myValueE+this.value.substring(endPos,this.value.length);
      this.focus();
      this.selectionStart = startPos + myValue.length;
      this.selectionEnd = ((startPos + myValue.length) + this.value.substring(startPos,endPos).length);
      this.scrollTop = scrollTop;
    } else {
      this.value += myValue;
      this.focus();
    }
  })
    }
});

// Gets the parent DOM element of the current caret (cursor) position
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

// Surrounds a selection with a DOM element (may possibly work? I don't remember)
function surroundSelection(sel, elt) {
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0).cloneRange();
        range.surroundContents(elt);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

// Inserts html before the cursor
function insertHTMLAtCursor(html) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            console.log(html);
            range.insertNode(html);
        }
    }
}

// Mozilla's regular expression escape-ifier
// Takes a regex in the form of a string and adds a \ before special characters so that you can use the regex as a string (i.e. new Regex(...))
// ex. "\s" -> "\\s"
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// The following code is used to save and restore the caret position in an HTML tree
// I believe it does so by storing a hidden character in the text and then returning back to that on restore (I think... still have to read it)
var saveSelection, restoreSelection;
if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        var start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        };
    };

    restoreSelection = function(containerEl, savedSel) {
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
} else if (document.selection) {
    saveSelection = function(containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
    };
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
// NOT NECESSARY ANYMORE YAYYYYYYYY
function getPrevWord() {
    var sel;
    if (window.getSelection && (sel = window.getSelection()).modify) {
        //sel = sel.getRangeAt(0);

        sel.collapseToStart();
        sel.modify("move", "backward", "word");
        sel.modify("extend", "forward", "word");
        console.log(sel);

        var counter = 0;
        var countermax = 50;

        // Try characters after word
        while (/^[^\s]+$/.test(sel.toString())) {
          sel.modify("extend", "forward", "character");
          
          // Selections cannot detect end of selectable text on addition of a character--have to (for now?) break out jankily
          counter++;
          if (counter > countermax) {
            console.log("--- E-brake right! ---");
            break;
          }
        }

        sel.modify("extend", "backward", "character");


        counter = 0;

        while (/^[^\s]+$/.test(sel.toString())) {
          sel.modify("move", "backward", "character");
          sel.modify("extend", "forward", "character");
          
          // Selections cannot detect end of selectable text on addition of a character--have to (for now?) break out jankily
          counter++;
          if (counter > countermax) {
            console.log("--- E-brake left! ---");
            break;
          }
        }

        sel.modify("extend", "backward", "character");
        sel.modify("move", "forward", "character");


        return sel;
    }
}

function stylize() {
	var savedSelection = saveSelection($("#noteArea")[0]);
	var res = $("#noteArea").text();
        	
	res = res.replace(/(\bnote:\s*)(.*\.|.*$)/g, function(x, a, b) {
        console.log("it's a match!");
        return a + '<span class="noteafter">' + b + '</span>';
    });

    res = res.replace(/\bnote:/g, function(x) {
        return '<br><span class="notecolon">' + x + '</span>';
    });

    res = res.replace(/\u200b/g, "<br>\u200b");

    $("#noteArea")[0].innerHTML = res;
    restoreSelection($("#noteArea")[0], savedSelection);
}


///////////////////////////////////////////////////////////////
///////////////////////   MAIN   //////////////////////////////
///////////////////////////////////////////////////////////////


$(document).ready(function() {

	$("#noteArea").focus();

	$("#noteArea").keyup(function(event) {
    // Save caret location

		var caller = $(event.target)[0];
		var input = caller.value;
		var vars = {"text": input};

		var code = event.keyCode || event.which;
		if (code == 9) {
   			// Tab
   			//stylize();
   		} else if (code == 38) {
   			// Up   Arrow
   		} else if (code == 40) {
   			// Down Arrow
   		} else if (code == 32) {
   			// Space
   			stylize();
   		} else if (code == 13) {
        	// Line feed? Carriage return?
        	
        	sel = window.getSelection();
        	var parent = getSelectionParentElement(sel);
        	//console.log(parent);
        	
        	//var elt = document.createElement("div");
        	//elt.innerHTML = "&#13;";

        	var elt = document.createTextNode("\u200b");

        	parent.parentNode.insertBefore(elt, parent);
        	//parent.remove();
        	//parent.innerHTML = "&#13";
        	
        	//insertHTMLAtCursor("&#10");
        	stylize();
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

        	stylize();
        }

        
	});
});
