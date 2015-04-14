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
        "Name one thing from Dorestad that" + "can be found in Scandinavia";
    String answer = "The bane of";
    Flashcard card = new Flashcard(question, answer);
    card.setId(1);
    card.setSubjectName("History");
    card.set_rank(100);
    card.setNumberTimesCorrect(10);
    card.setNumberTimesWrong(45);

    List<Flashcard> cardList = Lists.newArrayList(card);
    assert (FlashCardWriter.writeCards(cardList));

    Collection<Flashcard> cards = FlashCardReader.readCards("History");
    assertTrue(!cards.isEmpty());
    for (Flashcard testCard : cards) {
      assert (testCard.get_rank() == 100);
      assert (testCard.getSubject().equals("History"));
      assert (testCard.getId() == 1);
      assert (testCard.getNumberTimesCorrect() == 10);
      assert (testCard.getNumberTimesWrong() == 45);
      assert (testCard.getAnswer().equals(answer));
      assert (testCard.getQuestion().equals(question));
    }
  }
}
