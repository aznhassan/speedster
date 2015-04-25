/**
 * Handles flashcard pages
 * associated with flashcard.ftl file 
 */

$(document).ready(function() {

    // TODO: Surbhi, the next button is slated for destruction.
    var nextButton = document.getElementById("next-button");
    var correctButton = document.getElementById("correct-button");
    var wrongButton = document.getElementById("wrong-button");

    // TODO: Surbhi, I am adding a new object as a placeholder for current card :)
    var currCard = { 
      'q': "Demo",
      'a': "Demo",
      'id': 1  
    }; 


    // Note from Tushar @Surbhi: The sessionIDCounter now works! (TODO: remove).
    var sessionIDCounter = $('#session_div')[0].innerHTML;
    

      // TODO: Use different trigger to avoid  
      $('.flashcard_div_front').hover(function(){
          $(this).addClass('flip-front');
          $('.flashcard_div_back').addClass('flip-back');
      },function(){
          $(this).removeClass('flip-front');
          $('.flashcard_div_back').removeClass('flip-back');
      });

     


    /**
     * click handler for 'wrong' flashcard button.
     * When you get a card wrong the session remains unaffected, 
     * but the global card stats change.
     */
    $(wrongButton).click(function() {
        sendFlashcardUpdates(false);
    });

    /**
     * click handler for answered button
     */
    $(correctButton).click(function() {
        sendFlashcardUpdates(true);
    }) 

  
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
        // TODO: Change from 'getParams' to postParams.
        var getParams = {
            session_number: sessionIDCounter
        }
        $.post("/getNextFlashcard", getParams, function(responseJSON) {
            // Tushar to Surbhi: This works too now :P [ TODO, please remove this comment after reading.]
            var responseObject = JSON.parse(responseJSON);
            currCard.q = responseObject.q;
            currCard.a = responseObject.a;
            currCard.id = responseObject.card_id;
            displayFlashcard(currCard);
        });
    }

    /* 
    * Gets the next flashcard and displays it. Also updates back-end with user's performance
    * on the card. 
    * @param ansCorrect true if the user got the answer right, false otherwise. 
    */ 
    function sendFlashcardUpdates(ansStatus) {
        /**
         * Update server on flashcard status.
         */
         var postParams = { 
            session_no: sessionIDCounter,
            cardID: currCard.id,
            ansCorrect: ansStatus
        }; 

        $.post("/finishedCard", postParams, function(responseJSON) {
            // We don't need to do anything, as the primarily role 
            // of is function was to update the back-end.
        }); 

        /* 
        * Display next flashcard.
        */ 
        getNextFlashcard();
        
    }
    

    /**
     * get card info as JSON
     */
    function getCurrCard() {
        return currCard;
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


