/**
 * See pckg-info.
 */
package edu.brown.cs.mmth.speedster;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import edu.brown.cs.mmth.fileIo.Readable;
import edu.brown.cs.mmth.fileIo.Writeable;

import org.json.JSONObject;

/**
 * This card models a flashcard. It stores all associated data and allows direct
 * file IO. It also has the method
 *
 * @author tbhargav
 *
 */
public class Flashcard implements Readable, Writeable {

  /**
   * Computes a universal flashcard rank based on given data.
   * @param numDays -
   * @param noCorrect - (no. of times user got card right)
   * @param noWrong - (no. of times user got card wrong)
   * @return integer rank of flashcard
   */
  public static int computeFlashcardRank(final int numDays,
      final int noCorrect, final int noWrong) {
    int dayWeight = numDays * 10;
    double ratio;
    
    // Getting one card correct once is the same as getting it correct none (small edge case).
    if(noCorrect==0) {
      ratio=noWrong*100;
    } else {
      ratio = noWrong / noCorrect * 100.0;
    }
    
    int rank = (int) (dayWeight + ratio);
    return rank;
  }

  /**
   * The rank of the flash card.
   */
  private int rank;
  /**
   * The subject that Flashcard belongs to.
   */
  //private String subjectName;
  /**
   * The ID of the associated note.
   */
  private long noteId;
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
   * The day the card was last used
   */
  private Date lastUse;

  /**
   * Flash cards should only be displayed once per session.
   */
  private boolean displayForThisSession;

  /**
   * Constructs a new flash card
   */
  public Flashcard(final String answer, final String question) {
    numberTimesCorrect = 0;
    numberTimesWrong = 0;
    this.answer = answer;
    this.question = question;
    lastUse = new Date(Instant.now().toEpochMilli());
  }

  @Override
  public boolean equals(final Object obj) {
    if (!(obj instanceof Flashcard)) {
      return false;
    }

    Flashcard otherCard = (Flashcard) obj;
    return id == otherCard.id;
  }

  /**
   * Accessor for answer.
   *
   * @return the answer
   */
  public String getAnswer() {
    return answer;
  }

  @Override
  public List<String> getDataToStore() {
    List<String> toReturn = new ArrayList<>();
    toReturn.add("rank:" + new Long(rank).toString());
    //toReturn.add("subjectName:" + subjectName);
    toReturn.add("noteId:" + noteId);
    toReturn.add("ntc:" + new Integer(numberTimesCorrect).toString());
    toReturn.add("ntw:" + new Integer(numberTimesWrong).toString());
    toReturn.add("question:" + question);
    toReturn.add("answer:" + answer);
    toReturn.add("lastUse:" + new Long(lastUse.getTime()).toString());
    return toReturn;
  }

  /** Given a JSON object that has the fields, will update
   * each field of the FlashCard.
   * @param json - The FlashCard as JSON.
   */
  @Override
  public void updateFields(final String json) {
    JSONObject object = new JSONObject(json);
    rank = Integer.parseInt(object.getString("rank"));
    //subjectName = object.getString("subjectName");
    noteId = Long.parseLong(object.getString("noteId"));
    numberTimesCorrect = Integer.parseInt(object.getString("ntc"));
    numberTimesWrong = Integer.parseInt(object.getString("ntw"));
    question = object.getString("question");
    answer = object.getString("answer");
    lastUse = new Date(Long.parseLong(object.getString("lastUse")));
  }

  /**
   * Grabs the number of days since last use.
   * @return - The number of days since last use
   */
  public long getElapsedDays() {
    Date now = new Date(System.currentTimeMillis());
    long diffMili = now.getTime() - lastUse.getTime();
    return TimeUnit.DAYS.convert(diffMili, TimeUnit.MILLISECONDS);
  }

  @Override
  public long getId() {
    return id;
  }

  /**
   * Accessor for lastUse.
   *
   * @return the lastUse
   */
  public Date getLastUse() {
    return lastUse;
  }

  /**
   * Accessor for numberTimesCorrect.
   *
   * @return the numberTimesCorrect
   */
  public int getNumberTimesCorrect() {
    return numberTimesCorrect;
  }

  /**
   * Accessor for numberTimesWrong.
   *
   * @return the numberTimesWrong
   */
  public int getNumberTimesWrong() {
    return numberTimesWrong;
  }

  /**
   * Accessor for question.
   *
   * @return the question
   */
  public String getQuestion() {
    return question;
  }

  /**
   * Accessor and updator method for rank.
   *
   * @return the _rank
   */
  public int getRank() {
    rank =
        computeFlashcardRank((int) this.getElapsedDays(), numberTimesCorrect,
            numberTimesWrong);
    return rank;
  }

  /**
   * Grabs the subject of the Flashcard.
   */
 /* public String getSubject() {
    return subjectName;
  }*/

  /**
   * Accessor for subjectName.
   *
   * @return the subjectName
   */
  /*public String getSubjectName() {
    return subjectName;
  }
*/
  @Override
  public int hashCode() {
    return new Long(id).hashCode();
  }

  /**
   * Accessor for displayForThisSession.
   *
   * @return the displayForThisSession
   */
  public boolean isDisplayForThisSession() {
    return displayForThisSession;
  }

  /**
   * Mutator for _rank.
   *
   * @param _rank
   *          the _rank to set
   */
  public void set_rank(final int _rank) {
    rank = _rank;
  }

  /**
   * Mutator for answer.
   *
   * @param answer
   *          the answer to set
   */
  public void setAnswer(final String answer) {
    this.answer = answer;
  }

  /**
   * Mutator for displayForThisSession.
   *
   * @param displayForThisSession
   *          the displayForThisSession to set
   */
  public void setDisplayForThisSession(final boolean displayForThisSession) {
    this.displayForThisSession = displayForThisSession;
  }

  @Override
  public void setId(final long idL) {
    id = idL;
  }

  /**
   * Mutator for lastUse.
   *
   * @param lastUse
   *          the lastUse to set
   */
  public void setLastUse(final Date lastUse) {
    this.lastUse = lastUse;
  }

  /**
   * Mutator for numberTimesCorrect.
   *
   * @param numberTimesCorrect
   *          the numberTimesCorrect to set
   */
  public void setNumberTimesCorrect(final int numberTimesCorrect) {
    this.numberTimesCorrect = numberTimesCorrect;
  }

  /**
   * Mutator for numberTimesWrong.
   *
   * @param numberTimesWrong
   *          the numberTimesWrong to set
   */
  public void setNumberTimesWrong(final int numberTimesWrong) {
    this.numberTimesWrong = numberTimesWrong;
  }

  /**
   * Mutator for question.
   *
   * @param question
   *          the question to set
   */
  public void setQuestion(final String question) {
    this.question = question;
  }

  /**
   * Mutator for subjectName.
   * @param subjectName
   *          the subjectName to set
   */
  /*public void setSubjectName(final String subjectName) {
    this.subjectName = subjectName;
  }*/

  @Override
  public String toString() {
    return this.getDataToStore().toString();
  }
  
  public long getNoteId() {
    return this.noteId;
  }
  
  public void setNoteId(long id) {
    this.noteId = id;
  }

}
