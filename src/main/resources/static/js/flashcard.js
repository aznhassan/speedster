/**
 * Handles flashcard pages
 * associated with flashcard.ftl file 
 */

$(document).ready(function() {

    var nextButton = document.getElementById("next-button");
    var correctButton = document.getElementById("correct-button");
    var wrongButton = document.getElementById("wrong-button");



    var sessionIDCounter = $('#session_id')[0].innerHTML;

      $('.flashcard_div_front').hover(function(){
          $(this).addClass('flip-front');
          $('.flashcard_div_back').addClass('flip-back');
      },function(){
          $(this).removeClass('flip-front');
          $('.flashcard_div_back').removeClass('flip-back');
      });

     


    /**
     * click handler to next flashcard button
     */
    $(nextButton).click(function() {
        getNextFlashcard();
    });

    /**
     * click handler for answered button
     */
    $(correctButton).click(function() {
        sendFlashcardUpdates();
    }) 

    /**
     * click handler for show answer button
     */
     $(wrongButton).click(function(event) {
        sendFlashcardUpdates();
     });


/*Format to recieve the next flashcard 

{
    "associated_folder":folder_name
    "session_number": sessionID
    "card_id": some id
    "q": some question
    "a": some answer
}




*/
    /**
     * request the next flascard from the server
     */
    function getNextFlashcard() {
        var getParams = {
            sessionId: sessionIDCounter
        }
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
        $('.flashcard_div_front').html(flashcardHTML(card));
        $('.flashcard_div_back').html('<p><b>A: </b>' + card.a + '</p>');
     }


     function flashcardHTML(card) {
        return '<p><b>Q: </b>' + card.q + '</p>';
     }

      

     displayFlashcard(cardOne);
});


