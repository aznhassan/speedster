/**
 * See pckg-info.
 */
package edu.brown.cs.mmth.speedster;

import java.util.List;

import edu.brown.cs.mmth.fileIo.Readable;
import edu.brown.cs.mmth.fileIo.Writeable;

/**
 * This card models a flashcard. It stores all associated data and allows direct
 * file IO. It also has the method
 *
 * @author tbhargav
 *
 */
public class Flashcard implements Readable, Writeable {

  /**
   * The rank of the flash card.
   */
  private int _rank;

  /**
   * The subject that Flashcard belongs to.
   */
  private String subjectName;

  /**
   * The id of the Flashcard.
   */
  private long id;
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
   * Flash cards should only be displayed once per session.
   */
  private boolean displayForThisSession;


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
  public long getId() {
    return id;
  }

  @Override
  public void setId(long idL) {
    id = idL;
  }

  @Override
  public List<String> getDataToStore() {
    //Folder structure can still change.

    return null;
  }

  /**
   * Accessor method for rank. TODO: Updates
   * rank based on other fields of flashcard.
   * @return the _rank
   */
  public int getRank() {
    return _rank;
  }

  @Override
  public void updateFields(List<String> fields) {
    // TODO Auto-generated method stub

  }

  /**
   * Grabs the subject of the Flashcard.
   */
  public String getSubject() {
    return subjectName;
  }

  /**
   * Computes a universal flashcard rank based on given data.
   * @param numDays -
   * @param noCorrect - (no. of times user got card right)
   * @param noWrong - (no. of times user got card wrong)
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
