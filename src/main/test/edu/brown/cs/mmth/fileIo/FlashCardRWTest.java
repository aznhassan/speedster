package edu.brown.cs.mmth.fileIo;

import static org.junit.Assert.assertTrue;

import java.util.Collection;
import java.util.List;

import org.junit.Test;

import com.google.common.collect.Lists;

import edu.brown.cs.mmth.speedster.Flashcard;

public class FlashCardRWTest {

  @Test
  public void rwSingleCardTest() {
    String question =
        "Name one thing from Dorestad that \n can be found in Scandinavia";
    String answer = "Lava Querns";
    Flashcard card = new Flashcard(answer, question);
    card.setId(1);
    card.setSubjectName("History");
    card.set_rank(100);
    card.setNoteId(33);
    card.setNumberTimesCorrect(10);
    card.setNumberTimesWrong(45);

    List<Flashcard> cardList = Lists.newArrayList(card);
    assertTrue (FlashCardWriter.writeCards(cardList));

    Collection<Flashcard> cards = FlashCardReader.readCards("History");
    assertTrue(cards != null && !cards.isEmpty());
    for (Flashcard testCard : cards) {
      //assertTrue (testCard.getRank() == 100);
      assertTrue (testCard.getSubject().equals("History"));
      assertTrue (testCard.getId() == 1 || testCard.getId() == 3);
      assertTrue (testCard.getNumberTimesCorrect() == 10);
      assertTrue (testCard.getNumberTimesWrong() == 45);
      assertTrue (testCard.getAnswer().equals(answer));
      assertTrue(testCard.getQuestion().equals(question));
    }
  }
}
