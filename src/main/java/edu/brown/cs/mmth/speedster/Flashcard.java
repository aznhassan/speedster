/**
 * See pckg-info.
 */
package edu.brown.cs.mmth.speedster;

import java.io.IOException;
import java.nio.CharBuffer;
import java.util.List;

import edu.brown.cs.mmth.fileIo.Writeable;

/**
 * This card models a flashcard. It stores all associated data and allows direct
 * file IO. It also has the method
 *
 * @author tbhargav
 *
 */
public class Flashcard implements Readable, Writeable {

  // Instance variables.
  /**
   * The rank of the flash card.
   */
  private int _rank;
  /**
   * The number of times this user got this flash card correct.
   */
  private int numberTimesCorrect;
  /**
   * The number of times this user got this flash card wrong.
   */
  private int numberTimesWrong;
  /**
   * The question to display.
   */
  private String question;
  /**
   * The answer to the question.
   */
  private String answer;

  /**
   * Constructs a new flash card
   */
  public Flashcard(String answer, String question) {
     numberTimesCorrect = 0;
     numberTimesWrong = 0;
     this.answer = answer;
     this.question = question;

  }

  @Override
  public List<String> getDataToStore() {
    //Folder structure can still change.

    return null;
  }

  @Override
  public int getId() {
    // TODO Auto-generated method stub
    return 0;
  }

  @Override
  public int read(CharBuffer cb) throws IOException {
    // TODO Auto-generated method stub
    return 0;
  }

  /**
   * Accessor method for rank. TODO: Updates
   * rank based on other fields of flashcard.
   * @return the _rank
   */
  public int getRank() {
    return _rank;
  }

  /**
   * Computes a universal flashcard rank based on given data.
   *
   * @param numDays
   * @param noCorrect
   *          (no. of times user got card right)
   * @param noWrong
   *          (no. of times user got card wrong)
   * @return integer rank of flashcard
   */
  public static int computeFlashcardRank(int numDays, int noCorrect,
          int noWrong) {
    int dayWeight = numDays * 10;
    double ratio = (noWrong / noCorrect) * 100.0;
    int rank = (int) (dayWeight + ratio);
    return rank;
  }

}
