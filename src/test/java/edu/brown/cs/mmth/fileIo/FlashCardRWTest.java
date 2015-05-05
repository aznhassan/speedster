package edu.brown.cs.mmth.fileIo;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.AfterClass;
import org.junit.Test;

import com.google.common.collect.Lists;

import edu.brown.cs.mmth.speedster.Flashcard;
import edu.brown.cs.mmth.speedster.Main;

public class FlashCardRWTest {

  private static String SUBJECT = "The Age of the Vikings";

  @Test
  public void rwSingleCardTest() {
    String question =
        "Name one thing from Dorestad that \n can be found in Scandinavia";
    String answer = "Lava Querns";
    Flashcard card = new Flashcard(answer, question);
    card.setId(1);
    card.setSubjectName(SUBJECT);
    card.setRank(100);
    card.setNoteId(33);
    card.setNumberTimesCorrect(10);
    card.setNumberTimesWrong(45);

    List<Flashcard> cardList = Lists.newArrayList(card);
    assertTrue (FlashCardWriter.writeCards(cardList));

    Collection<Flashcard> cards = FlashCardReader.readCards(SUBJECT);
    assertTrue(cards != null && !cards.isEmpty());
    for (Flashcard testCard : cards) {
      int rank = Flashcard.computeFlashcardRank((int)testCard.getElapsedDays(), testCard.getNumberTimesCorrect(), testCard.getNumberTimesWrong());
      assertTrue (testCard.getRank() == rank);
      assertTrue (testCard.getSubject().equals(SUBJECT));
      assertTrue (testCard.getId() == 1);
      assertTrue (testCard.getNumberTimesCorrect() == 10);
      assertTrue (testCard.getNumberTimesWrong() == 45);
      assertTrue (testCard.getAnswer().equals(answer));
      assertTrue(testCard.getQuestion().equals(question));
    }
  }

  @AfterClass
  public static void deleteFiles() {
    File testFile = new File(Main.getBasePath() + "/" + SUBJECT);
    try {
      FileUtils.deleteDirectory(testFile);
    } catch (IOException e) {
      System.err.println("ERROR: Couldn't delete the folder");
      System.exit(1);
    }
  }
}
