package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import edu.brown.cs.mmth.speedster.Flashcard;

/** Writes FlashCards to their appropriate place in the file system.
 * @author hsufi
 *
 */
public final class FlashCardWritter {

  /**
   * Private Constructor.
   */
  private FlashCardWritter() {}

  /** Given a list of Flashcards in JSON format will
   *  make and return a list of said cards as Flashcards.
   * @param jsonCards - The list of Flashcards given as a JSON array.
   * @return - A list of Flashcards.
   */
  public List<Flashcard> makeCards (String jsonCards) {
    //TODO: Everything
    return new ArrayList<>();
  }

  /** Writes a collection of Flashcards to the given path.
   * @param flashCards - The list of FlashCards to write to file
   * @return - Boolean indicating whether or not there was an error in the
   * operation.
   */
  public boolean writeCards(Collection<Flashcard> flashCards){
    String path = "/speedster"; // Will grab the working directory later from a file.
    StringBuilder bd = new StringBuilder();
    for (Flashcard card : flashCards) {
      BufferedWriter writer = null;
      try {
        File file = new File("./data/" + card.getSubject()
                + "/f" + card.getId());
        file.getParentFile().mkdirs();
        writer = new BufferedWriter(new FileWriter(file));
      } catch (IOException e) {
        return false;
      } finally {
        try {
          writer.close();
        } catch (IOException e) {
           return false;
        }
      }
    }
    return true;
  }
}
