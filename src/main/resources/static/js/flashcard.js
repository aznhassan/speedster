/**
 * Handles flashcard pages
 * associated with flashcard.ftl file 
 */

$(document).ready(function() {

    var correctButton = document.getElementById("correct-button");
    var wrongButton = document.getElementById("wrong-button");
    $('#button-div').hide();

    // TODO: Surbhi, I am adding a new object as a placeholder for current card :)
    var currCard = { 
      'q': "Demo",
      'a': "Demo",
      'id': 1  
    }; 

    // Session ID retrieved from variables map ftl was initiated with.
    var sessionIDCounter = $('#session_div')[0].innerHTML;
    
     // Showing the first card!
    getNextFlashcard();
    
      // TODO: Use different trigger to avoid back and forth. 
     /* $('.flashcard_div_front').on("click", function() {
          alert("yes");
          $(this).addClass('flip-front');
          $('.flashcard_div_back').addClass('flip-back');
      }, function() {
          // $(this).removeClass('flip-front');
          //$('.flashcard_div_back').removeClass('flip-back');
      });*/
      $(document).on("click", ".flashcard_div_front", function(){
          $(".flashcard_div_front").addClass('flip-front');
          $('.flashcard_div_back').addClass('flip-back');
          $('#button-div').show();
      });

     


    /**
     * click handler for 'wrong' flashcard button.
     * When you get a card wrong the session remains unaffected, 
     * but the global card stats change.
     */
    $(wrongButton).click(function() {
        $('.flashcard_div_back').removeClass('flip-back');
        $('.flashcard_div_front').removeClass('flip-front');
       
        sendFlashcardUpdates(false);
        $('#button-div').hide();
    });

    /**
     * click handler for answered button
     */
    $(correctButton).click(function() {
        $('.flashcard_div_back').removeClass('flip-back');
        $('.flashcard_div_front').removeClass('flip-front');
        
        sendFlashcardUpdates(true);
        $('#button-div').hide();
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

        // Avoiding updating the 'dummy' card that marks end of session.
        if(currCard.id!=="-1") {
            $.post("/finishedCard", postParams, function(responseJSON) {
            // We don't need to do anything, as the primarily role 
            // of is function was to update the back-end.
        });

        }
        
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
        $('.flashcard_div_front').html('<br><br><br><p class="Q">Q: </b>' + card.q + '</p><br><br><br><p class="hint">(click to reveal)</p>');
        $('.flashcard_div_back').html('<br><br><br><p class="Q">Q: </b>' + card.q +'<hr>'+'</p><p class="A"><b>A: </b>' + card.a + '</p>');
     }
});


