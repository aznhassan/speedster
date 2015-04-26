package edu.brown.cs.mmth.fileIo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import edu.brown.cs.mmth.speedster.Flashcard;
import edu.brown.cs.mmth.speedster.Main;

/**
 * Reads Flashcards from disk.
 *
 * @author hsufi
 *
 */
public final class FlashCardReader {

  private static Map<Long, Flashcard> cache = new HashMap<>();
  
  /**
   * Private constructor.
   */
  private FlashCardReader() {
  }

  /** 
   * Returns flashcard from cache. Null if flashcard with given ID is not
   * present.
   * @param id the unique identifier for the flashcard
   * @return the flashcard object corresponding to that ID. Null if not found.
   */
  public static Flashcard getFlashcardFromCache(long id) {
    if(cache.containsKey(id)) {
      return cache.get(id);
    } else {
      return null;
    }
  }
  
  /**
   * Accessor for all the cards in cache, that are the only ones
   * that could have been potentially updated (with correct/wrong stats).
   * @return collection of 'Flashcard'.
   */
  public static Collection<Flashcard> getUpdatedCards() {
    return cache.values();
  }
  
  /**
   * Reads in a list of Flashcards from memory and creates a list of Flashcards.
   * @param pathToCards
   *          - The subject of the flashCard
   * @return A list of Flashcard objects.
   */
  public static Collection<Flashcard> readCards(String subject) {
    String pathToCards = Main.getBasePath() + "/" + subject;
    File directory = new File(pathToCards);
    File[] files = directory.listFiles();
    List<Flashcard> flashCards = new ArrayList<>();
    if (files == null || files.length == 0) {
      return null;
    }
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
        StringBuilder object = new StringBuilder();
        String line = "";
        while ((line = reader.readLine()) != null) {
          object.append(line);
        }
        Flashcard card = new Flashcard("", "");
        card.updateFields(object.toString());
        Long id;
        try {
          id = Long.parseLong(file.getName().substring(1));
        } catch (NumberFormatException e) {
          continue; //Skipping invalid file
        }
        card.setId(id);
        
        // Updating flashcard cache.
        cache.put(id, card);
        
        flashCards.add(card);
      } catch (IOException e) {
        return null;
      }
    }
    return flashCards;
  }

}
