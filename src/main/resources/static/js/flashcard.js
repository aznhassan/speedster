
/*
Format to recieve the next flashcard 

{
    "associated_folder":folder_name
    "session_number": sessionID
    "card_id": some id
    "q": some question
    "a": some answer
}

Format for sending back the current flashcard

{
  ansCorrect: bool,
  session_no: num,
  card_id: num
}
*/

/* Flashcard format 
{
    "associated_folder": name,
    "card_id": card identifier
    "q": question
    "a": answer
}
*/

var session_no = -1;
var current_card_id = -1;


$(document).ready(function() {
    // Session ID retrieved from variables map ftl was initiated with.
    session_no = $('#session_div')[0].innerHTML;
    
     // Show the first card
    getNextFlashcard();
});

function finishFlashcard(ansCorrect) {
    var postParams = {
        session_no: session_no,
        card_id: current_card_id,
        ansCorrect: ansCorrect
    };

    // Avoid sending an update for the 'dummy' card that marks end of session.
    if(current_card_id != -1) {
        $.post("/finishedCard", postParams, function(responseJSON) {
            swapCards();
        });
    }
}

function swapCards() {
    $('#flashcard').fadeOut('fast', 'swing', function() {
        $(this).remove();
        getNextFlashcard;
    });
}

function getNextFlashcard() {
    var params = {session_number: session_no};
    $.post("/getNextFlashcard", params, function(responseJSON) {
        var responseObject = JSON.parse(responseJSON);
        current_card_id.card_id;
        displayFlashcard(responseObject);
    });
}

function displayFlashcard(card) {
    // create and insert insert new flashcard
    var newcard = makeCard(card);
    $('#flashcard_holder').append(newcard);

    // set up callbacks
    $('#flashcard').flip({
        axis: 'x',
        trigger: 'hover',
        speed: 300
    });

    $('#correct').click(function() {
        disableButtons();
        finishFlashcard(true);
    });
    $('#incorrect').click(function() {
        disableButtons();
        finishFlashcard(false);
    });
}

function disableButtons() {
    $('#correct')[0].disabled = true;
    $('#incorrect')[0].disabled = true;
}

function makeCard(card) {
  return '<div id="flashcard">' +
            '<div class="front">' +
              '<div class="box">' +
                '<p>Q: ' + card.q + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="back">' +
              '<div class="box">' +
                '<p>Q: ' + card.q + '</p><br>' +
                '<p>A: ' + card.a + '</p>' +
                '<div class="finish_buttons">' +
                  '<input type="button" id="correct" value="Got it!"/>' +
                  '<input type="button" id="incorrect" value="Maybe next time"/>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
}






