/**
 * Handles the particular full note page
 * associated with note.ftl file
 */


///////////////////////////////////////////////////////////////
// GLOBAL VARIABLES ///////////////////////////////////////////
///////////////////////////////////////////////////////////////

// each suggestion's height in the dropdown
var SUGGESTION_CELL_HEIGHT = 30;

var userRules = [];

var NEWLINE = '<br>\u200b';


/* Config

config is requested on startup of the page. It is loaded once and sets user customization.

config = {
	rules: Rule[] (Rule defined below),
	otherThings??? (let me know if you think user customization can go further!)
}

Rule:
{
  name: "string"
  trigger:
  {
    word: "string",
    endSeq: "string", (charsequence to end the rule with--if not specified then we apply the rule to just the trigger word itself)
    style: "string", (css classname)
  }

  after:
  {
    endSeq: "string", (charsequence to end the rule with--rule will be applied to text between trigger.word up to and including after.endSeq)
    style: "string", (css classname)
  }

  container:
  {
  	style: "string" (css classname)
  }
}

Rules can take the following forms based on what is defined:

<style1> trigger.word </style1>
<style1> trigger.word (stuff) trigger.endSeq </style1>
<style1> trigger.word </style1> <style2> (stuff) after.endSeq </style2>
<style1> trigger.word (stuff) trigger.endSeq </style1> <style2> (stuff) after.endSeq </style2>

... any of the above but inside of a div (if container and container.style are defined). The div can center things/box things/do whatever css can do.

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

function correct(res) {
	// WOrd -> Word
	res = res.replace(/\b([A-Z]{2}[a-z]+)\b/g, function(x, a) {
		return a.toLowerCase().capitalizeFirstLetter();
	});
	
	// word. word -> word. Word
	res = res.replace(/([\.\?\!]|\u200b)([^w]*?)([a-zA-Z])/g, function(x, a, b, c) {
		return a + b + c.toUpperCase();
	});

	// word i word -> word I word
	res = res.replace(/\bi\b/g, 'I');

	return res;
}

function stylize(correcting) {
    var savedSelection = saveSelection($("#noteArea")[0]);
    var res = $("#noteArea").text();

    // Common capitalization errors
    if (correcting) {
      	res = correct(res);
    }

    // Encode HTML special chars for distinction from our own insertions
    res = escapeHTML(res);

    // \u200b -> <br>\u200b
    res = res.replace(/\u200b/g, '<br>\u200b');

    // TITLE
    res = res.replace(/^(.*?)(<br>\u200b|$)/, function(x, a, b) {
        return '<div class="title">' + a + '</div>' + b;
    });

    // NOTE:
    res = res.replace(/(note:)(.*?)(<br>\u200b|$)/gi, function(x, a, b, c) {
        return '<div class="box">' + '<span class="notecolon">' + a + '</span>' 
        + '<span class="noteafter">' + b + '</span>' + '</div>' + maybeUnNewline(c);
    });


    // Q/A
    res = res.replace(/\b(Q:)([^]*?)(A:)(.*?)(<br>\u200b|$)/gi, function(x, a, b, c, d, e) {
        return '<div class="box">' + a + b + c + d  + '</div>' + maybeUnNewline(e);
    });
    res = res.replace(/\b(Q:)(.*?\?|.*$)/gi, function(x, a, b) {
        return '<span class="qacolon">' + a + '</span>' + '<span class="qaafter">' + b + '</span>';
    });
    res = res.replace(/\b(A:)(.*?)(<br>\u200b|$)/gi, function(x, a, b, c) {
        return '<span class="qacolon">' + a + '</span>' + '<span class="qaafter">' + b + '</span>' + c;
    });


    // User-defined Rules
    res = applyUserRules(res);


    // Sections
    // res = res.replace(/(<br>\u200b<br>\u200b)([^<\u200b]+?)(<br>\u200b|$)/gi, function(x, a, b, c) {
    //     return a + '<span class="section">' + b + '</span>' + c;
    // });

    // Decode HTML special chars
    res = unescapeHTML(res);

    $("#noteArea")[0].innerHTML = res;
    restoreSelection($("#noteArea")[0], savedSelection);
}

function maybeUnNewline(captured) {
	return (captured == '<br>\u200b' ? '\u200b' : captured);
}

function applyUserRules(text) {
	var t = text;
	for (var i = 0; i < userRules.length; i++) {
		var rule = userRules[i];
		t = t.replace(rule.find, rule.replace);
	}

	return t;
}

// Mozilla's regular expression escape-ifier
// Takes a regex in the form of a string and adds a \ before special characters so that you can use the regex as a string (i.e. new Regex(...))
// ex. "\s" -> "\\s"
function regEsc(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    //return string.replace(/[-\/\\^$*+?.\(\)|\[\]{}]/g, '\\$&')
}

function escapeHTML(text) {
  	var map = {
    	'&': '&amp;',
    	'<': '&lt;',
    	'>': '&gt;',
    	'"': '&quot;',
    	"'": '&#039;'
  	};

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function unescapeHTML(html) {
	var map = {
		'&amp;': '&',
    	'&lt;': '<',
    	'&gt;': '>',
    	'&quot;': '"',
   		'&#039;': "'"
  	};

  return html.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/gi, function(m) { return map[m]; });
}

function encodeHTML(text) {
  return text.replace(/[&"']/g, function(m) {
    switch (m) {
      case '&':
        return '&amp;';
      // case '<':
      //   return '&lt;';
      case '"':
        return '&#34;';
      case "'":
      	return ''
      default:
        return '_';
    }
  });
}

function decodeHTML(text) {
  return text.replace(/&amp;|&#34;/gi, function(m) {
    switch (m) {
      case '&amp;':
        return '&';
      // case '&lt;':
      //   return '<';
      case '&#34;':
        return '"';
      default:
        return '_';
    }
  });
}

function compileUserRules(rules) {
	return rules.map(compileUserRule);
}

function compileUserRule(rule) {
	var trigger = '(' + regEsc(rule.trigger.word) + ')'
	var triggerEndSeq = (rule.trigger.endSeq ? '(.*?)' + '(' + regEsc(rule.trigger.endSeq) + '|$)' : '');
	var triggerStyle = rule.trigger.style;

	var afterEndSeq = (rule.after && rule.after.endSeq ? '(.*?)' + '(' + regEsc(rule.after.endSeq) + '|$)' : '');
	var afterStyle = (rule.after ? rule.after.style || '' : '');
	var containerStyle = (rule.container ? rule.container.style : '');
	var newline1 = rule.trigger.endSeq && rule.trigger.endSeq == '<br>\u200b' && !rule.after;
  var newline2 = containerStyle && rule.after && rule.after.endSeq == '<br>\u200b';


	var reg = (afterEndSeq ? (trigger + triggerEndSeq + afterEndSeq) + '|' + (trigger + triggerEndSeq) : trigger + triggerEndSeq);


	var rep = function() {
		var a = arguments;

		var res = '';

		if (containerStyle) {
			res += '<div class="' + containerStyle + '">';
		}

		res += '<span class="' + triggerStyle + '">' + a[1];

		if (triggerEndSeq) {
			res += a[2];
      if (!newline1) {
        res += a[3];
      }
		}

		res += '</span>'

		if (afterEndSeq) {
			res += '<span class="' + afterStyle + '">';
			res += (triggerEndSeq ? a[4] : a[2]);
			if (!newline2) {
				res += (triggerEndSeq ? a[5] : a[3]);
			}
      res += '</span>';
		}

		if (containerStyle) {
			res += '</div>';
		}

    if (newline1) {
      res += maybeUnNewline(a[3]);
    }

		if (newline2) {
			res += maybeUnNewline(triggerEndSeq ? a[5] : a[3]);
		}

		return res;
	}


	var regex = new RegExp(reg, 'gi');
	var replace = rep;
		
	console.log(rule.name);
	console.log(regex);
	console.log('------------');

	return {
		'name': rule.name,
		'find': regex,
		'replace': replace
	}
}


function sendNotes() {
    var urlparts = window.location.pathname.split('/');

    var params = {
      'data': $('#noteArea').innerHTML,
      'flashcards': gatherFlashcards(),
      'title': $('.title').innerText;
      'noteid': urlparts[3],
      'subject': urlparts[2]
    }

    $.post("/updateNote", params, function() {
        // merp...
    });
}



///////////////////////////////////////////////////////////////
///////////////////////   MAIN   //////////////////////////////
///////////////////////////////////////////////////////////////


$(document).ready(function() {
	var config = {
		'backgroundColor': 4
	};

	document.body.style.backgroundColor = "#A1E869"; //"#FF8085"; //getBackgroundColorOption(config.backgroundColor);

	var rules = config[rules] || [];

	//////////// Testing ////
	rules.push({
		'name': 'inline quotes',
		'trigger': {
			'word': '"',
			'endSeq': '"',
			'style': 'quotes'
		}
	});

	rules.push({
	 'name': 'figure',
		'trigger': {
			'word': '[',
			'endSeq': ']',
			'style': 'equationcaption'
		},
		'after': {
			'endSeq': '<br>\u200b',
			'style': 'equation'
		},
		'container': {
			'style': 'equationbox'
		}
	});

	rules.push({
		'name': 'large quotes',
		'trigger': {
			'word': "``",
			'style': 'largequote'
		},
		'after': {
			'endSeq': '<br>\u200b',
			'style': 'largequoteafter'
		},
		'container': {
			'style': 'largequotebox'
		}
	});	

  rules.push({
    'name': 'psuedo-sections',
    'trigger': {
      'word': '|',
      'style': 'section',
      'endSeq': '<br>\u200b'
    }
  });

  rules.push({
    'name': 'tab note',
    'trigger': {
      'word': '$',
      'style': 'section',
      'endSeq': '<br>\u200b'
    },
    'after': {
      'endSeq': '<br>\u200b',
      'style': 'noteafter'
    },
    'container': {
      'style': 'box'
    }
  });

  rules.push({
    'name': 'important!',
    'trigger': {
      'word': 'important',
      'style': 'important'
    }
  });

	////////////////////////

  // clean each rule by escaping bad characters
	rules.forEach(function(v, i, arr) {
		v.trigger.word = escapeHTML(v.trigger.word);
		if (v.trigger.endSeq && v.trigger.endSeq != NEWLINE) {
			v.trigger.endSeq = escapeHTML(v.trigger.endSeq);
		}
		if (v.after && v.after.endSeq && v.after.endSeq != NEWLINE) {
			v.after.endSeq = escapeHTML(v.after.endSeq);
		}
	});

	userRules = compileUserRules(rules);

  var sendNotesCounter = 0;

	$("#noteArea").keyup(function(event) {
		var caller = $(event.target)[0];
		var input = caller.value;
		var vars = {"text": input};

		var code = event.keyCode || event.which;
		if (code == 9) {
   			  // Tab
   			  //stylize();
   		} else if (code == 32) {
   			  // Space
   			  stylize(true);
          sendNotesCounter++;
          if (sendNotesCounter % 5 == 0) {
            sendNotes();
            sendNotesCounter = 0;
          }
   		} else if (code == 13) {
        	// Line feed
        	var parent = getSelectionParentElement(window.getSelection());
        	var elt = document.createTextNode("\u200b");
        	parent.parentNode.insertBefore(elt, parent);
        	
        	stylize(true);
      } else {
        stylize();
      }
  });

  $("#noteArea").focus();
});

function getBackgroundColorOption(option) {
	switch(option) {
		case 0: return '#8EFF8E';  // Green
		case 1: return '#8EE8FF';  // Blue
		case 2: return '#BB8EFF';  // Purple
		case 3: return '#FF8EBB';  // Pink
		case 4: return '#FFE88E';  // Yellow
		default: return '#8EE8FF'; // Blue

	}
}

