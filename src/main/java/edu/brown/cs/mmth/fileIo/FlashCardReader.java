package edu.brown.cs.mmth.fileIo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import edu.brown.cs.mmth.speedster.Flashcard;
import edu.brown.cs.mmth.speedster.Main;

/**
 * Reads Flashcards from disk.
 *
 * @author hsufi
 *
 */
public final class FlashCardReader {

  /**
   * Private constructor.
   */
  private FlashCardReader() {
  }

  /**
   * Reads in a list of Flashcards from memory and creates a list of Flashcards.
   *
   * @param pathToCards
   *          - The subject of the flashCard
   * @return A list of Flashcard objects.
   */
  public static Collection<Flashcard> readCards(String subject) {
    String pathToCards = Main.getBasePath() + "/subjects/" + subject;
    File directory = new File(pathToCards);
    File[] files = directory.listFiles();
    List<Flashcard> flashCards = new ArrayList<>();
    for (File file : files) {
      if (!file.isFile()) {
        return null;
      }
      String name = file.getName();
      if (!name.startsWith("f")) {
        continue;
      }
      try (
          BufferedReader reader =
              new BufferedReader(new InputStreamReader(
                  new FileInputStream(file), "UTF-8"))) {
        List<String> fields = new ArrayList<>();
        String line = "";
        while ((line = reader.readLine()) != null) {
          fields.add(line);
        }
        Flashcard card = new Flashcard("", "");
        card.updateFields(fields);
        Long id = Long.parseLong(file.getName().substring(1));
        card.setId(id);
        flashCards.add(card);
      } catch (FileNotFoundException e) {
        return null;
      } catch (UnsupportedEncodingException e) {
        return null;
      } catch (IOException e1) {
        return null;
      }
    }
    return flashCards;
  }

}
