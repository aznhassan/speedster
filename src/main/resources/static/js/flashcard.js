/**
 * Handles flashcard pages
 * associated with flashcard.ftl file 
 */

$(document).ready(function() {

	var nextButton = document.getElementById("next-button");
	var answeredButton = document.getElementById("answer-button");
	var showAnswerButton = document.getElementById("show-answer");

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
	 * click handler for show answer button
	 */
	 $(showAnswerButton).click(function(event) {
	 	var currHTML = flashcardHTML(cardOne);
	 	currHTML = currHTML + '<p><b>A:  </b>' + cardOne.a + '</p>';
	 	$('.flashcard_div').html(currHTML);
	 });


/*Format to recieve the next flashcard 

{
	"associated_folder":folder_name
	"card_id": some id
	"q": some question
	"a": some answer
}




*/
	/**
	 * request the next flascard from the server
	 */
	function getNextFlashcard() {
		$.get("/getNextFlashcard", function(responseJSON) {
			var responseObject = JSON.parse(responseJSON);

			// #TODO: display flashcard
		});
	}

	function sendFlashcardUpdates() {
		/**
		 * send flashcard updates to server
		 */
		var postParams = {
			currCard: getCurrCard()
		}

		$.post("/finishedCard", postParams, function() {
			// #TODO: unsure what ?
		});
	}
	

	/**
	 * get card info as JSON
	 */
	function getCurrCard() {
		return {
			"card_id": 1 /* somehow grab card id */,
			"result" : "correct"
		}
	}

/* Flashcard format 
{
	"associated_folder": name,
	"card_id": card identifier
	"q": question
	"a": answer
}

*/

/**************************************
 * SAMPLE FLASHCARD
 **************************************/
 var cardOne = {
 	"associated_folder": "CS 22: Discrete Structures And Probability",
 	"card_id": 1,
 	"q": "What is life , why do I even CS ?",
 	"a": "I don't know why I even CS :("
 }

	/**
	 * Displaying a flashcard
	 */
	 function displayFlashcard(card) {
	 	$('.flashcard_div').html(flashcardHTML(card));
	 }


	 function flashcardHTML(card) {
	 	return '<p><b>Q: </b>' + card.q + '<p>';
	 }

	 displayFlashcard(cardOne);
});


