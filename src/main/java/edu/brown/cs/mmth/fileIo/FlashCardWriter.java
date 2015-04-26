package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.json.JSONObject;

import edu.brown.cs.mmth.speedster.Flashcard;
import edu.brown.cs.mmth.speedster.Main;

/**
 * Writes FlashCards to their appropriate place in the file system.
 *
 * @author hsufi
 *
 */
public final class FlashCardWriter {

  /**
   * Private Constructor.
   */
  private FlashCardWriter() {
  }

  /**
   * Given a list of Flashcards in JSON format will make and return a list of
   * said cards as Flashcards.
   *
   * @param jsonCards
   *          - The list of Flashcards given as a JSON array.
   * @return - A list of Flashcards.
   */
  public List<Flashcard> makeCards(String jsonCards) {
    // TODO: Everything
    return new ArrayList<>();
  }

  /**
   * Writes a collection of Flashcards.
   * @param flashCards - The list of FlashCards to write to file
   * @return - Boolean indicating whether or not there was an error in the
   *         operation.
   */
  public static boolean writeCards(Collection<Flashcard> flashCards) {
    String basePath = Main.getBasePath();
    for (Flashcard card : flashCards) {
      File file =
          new File(basePath + "/" + card.getSubject() 
              + "/N" + card.getNoteId() + "/f" + card.getId());
      file.getParentFile().mkdirs();
      try (BufferedWriter writer =
          new BufferedWriter(new OutputStreamWriter(
              new FileOutputStream(file), "UTF-8"));) {

        List<String> dataToWrite = card.getDataToStore();
        int length = dataToWrite.size();
        JSONObject obj = new JSONObject();
        for (int i = 0; i < length; i++) {
          String data = dataToWrite.get(i);
          String[] splitArray = data.split(":", 2);
          obj.put(splitArray[0], splitArray[1]);
          //writer.write(dataToWrite.get(i) + ",");
        }
        writer.write(obj.toString());
        writer.write("\n");
      } catch (IOException e) {
        return false;
      }
    }
    return true;
  }
}
