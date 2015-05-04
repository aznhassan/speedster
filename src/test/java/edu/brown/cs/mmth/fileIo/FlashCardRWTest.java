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
    String subject = "The Age of the Vikings";
    String question =
        "Name one thing from Dorestad that \n can be found in Scandinavia";
    String answer = "Lava Querns";
    Flashcard card = new Flashcard(answer, question);
    card.setId(1);
    card.setSubjectName(subject);
    card.setRank(100);
    card.setNoteId(33);
    card.setNumberTimesCorrect(10);
    card.setNumberTimesWrong(45);

    List<Flashcard> cardList = Lists.newArrayList(card);
    assertTrue (FlashCardWriter.writeCards(cardList));

    Collection<Flashcard> cards = FlashCardReader.readCards(subject);
    assertTrue(cards != null && !cards.isEmpty());
    for (Flashcard testCard : cards) {
      int rank = Flashcard.computeFlashcardRank((int)testCard.getElapsedDays(), testCard.getNumberTimesCorrect(), testCard.getNumberTimesWrong());
      assertTrue (testCard.getRank() == rank);
      assertTrue (testCard.getSubject().equals(subject));
      assertTrue (testCard.getId() == 1);
      assertTrue (testCard.getNumberTimesCorrect() == 10);
      assertTrue (testCard.getNumberTimesWrong() == 45);
      assertTrue (testCard.getAnswer().equals(answer));
      assertTrue(testCard.getQuestion().equals(question));
    }
  }
}
