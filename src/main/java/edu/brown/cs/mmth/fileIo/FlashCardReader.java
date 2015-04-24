package edu.brown.cs.mmth.fileIo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
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
   * @param pathToCards
   *          - The subject of the flashCard
   * @return A list of Flashcard objects.
   */
  public static Collection<Flashcard> readCards(String subject) {
    String pathToCards = Main.getBasePath() + subject;
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
        Long id;
        try {
          id = Long.parseLong(file.getName().substring(1));
        } catch (NumberFormatException e) {
          continue;
        }
        card.setId(id);
        flashCards.add(card);
      } catch (IOException e) {
        return null;
      }
    }
    return flashCards;
  }

}
