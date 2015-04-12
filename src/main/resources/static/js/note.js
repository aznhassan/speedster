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

String.prototype.capitalizeFirstLetter = function() {
	if (this.length > 0) {
		return this.charAt(0).toUpperCase() + this.slice(1);
	} else {
		return '';
	}
}


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


function moveCursor(savedSelection, offset) {
	savedSelection.start += offset;
	savedSelection.end += offset;
}

function stylize(offset) {
	var savedSelection = saveSelection($("#noteArea")[0]);
	var res = $("#noteArea").text();

	// Invariants:
	//	1) Extra visible characters are never added (maybe \u200b doesn't count?)
	//	2) No <br> tags are inserted at the end of a replacement (these newlines will appear after the cursor)
	
	// &nbsp; -> <br>
	res = res.replace(/\u200b/g, '<br>\u200b');

	// TITLE
	res = res.replace(/^(.*?)(<br>\u200b|$)/, function(x, a, b) {
        return '<div class="title">' + a + '</div>' + b;
    });

    // Sections
    res = res.replace(/(<br>\u200b<br>\u200b)(.*?)(<br>\u200b|$)/gi, function(x, a, b, c) {
        return a + '<span class="section">' + b + '</span>' + c;
    });

	// NOTE:
	res = res.replace(/(note:)(.*?[\.\!\?]|.*$)/gi, function(x, a, b) {
        return '<div class="box">' + '<span class="notecolon">' + a + '</span>' + '<span class="noteafter">' + b + '</span>' + '</div>';
    });

	// Q/A
	res = res.replace(/\b(Q:)(.*?\?)([^]*?)(A:)(.*?\.)/gim, function(x, a, b, c, d, e) {
        return '<div class="box">' + a + b + c + d + e + '</div>';
    });
	res = res.replace(/\b(Q:)(.*?\?|.*$)/gi, function(x, a, b) {
        return '<span class="qacolon">' + a + '</span>' + '<span class="qaafter">' + b + '</span>';
    });
    res = res.replace(/\b(A:)(.*?\.|.*$)/gi, function(x, a, b) {
        return '<span class="qacolon">' + a + '</span>' + '<span class="qaafter">' + b + '</span>';
    });


	// TExt -> Text
	res = res.replace(/\b([A-Z]{2}[a-z]+)\b/g, function(x, a) {
		return a.toLowerCase().capitalizeFirstLetter();
	});


    $("#noteArea")[0].innerHTML = res;
    console.log(savedSelection);
    //offset = (offset ? offset : 0);
    //moveCursor(savedSelection, offset);
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
        	// Line feed
        	
        	sel = window.getSelection();
        	var parent = getSelectionParentElement(sel);
        	
        	//var elt = document.createElement("div");

        	var elt = document.createTextNode("\u200b");
        	//var elt = document.createTextNode("&#13;");

        	parent.parentNode.insertBefore(elt, parent);
        	
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
