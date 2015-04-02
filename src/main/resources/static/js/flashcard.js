/**
 * Handles flashcard pages
 * associated with flashcard.ftl file 
 */

$(document).ready(function() {

	var nextButton = document.getElementById("");
	var answeredButton = document.getElementById("");

	/**
	 * click handler to next flashcard button
	 */
	$(nextButton).click(function() {
		getNextFlashcard();
	});

	/**
	 * click handler for answered button
	 */
	$(answeredButton).click(function() {
		sendFlashcardUpdates();
	}) 

	/**
	 * request the next flascard from the server
	 */
	function getNextFlashcard() {
		$.get("/getNextFlashcard", function(responseJSON) {
			var responseObject = JSON.parse(responseJSON);

			// #TODO: display flashcard
		});
	}

	/**
	 * send flashcard updates to server
	 */
	var postParams = {
		currCard: getCurrCard();
	}

	$.post("/finishedCard", postParams, function() {
		// #TODO: unsure what ?
	});

	/**
	 * get card info as JSON
	 */
	function getCurrCard() {
		return {
			"card_id": /* somehow grab card id */,
			"result" : "correct"
		}
	}
});


