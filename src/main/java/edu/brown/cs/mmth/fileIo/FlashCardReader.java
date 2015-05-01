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

import org.json.JSONException;
import org.json.JSONObject;

import edu.brown.cs.mmth.speedster.Flashcard;
import edu.brown.cs.mmth.speedster.Main;
import edu.brown.cs.mmth.speedster.Note;

/**
 * Reads Flashcards from disk.
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
   * @param id
   *          the unique identifier for the flashcard
   * @return the flashcard object corresponding to that ID. Null if not found.
   */
  public static Flashcard getFlashcardFromCache(long id) {
    if (cache.containsKey(id)) {
      return cache.get(id);
    } else {
      return null;
    }
  }

  /**
   * Accessor for all the cards in cache, that are the only ones that could have
   * been potentially updated (with correct/wrong stats).
   * @return collection of 'Flashcard'.
   */
  public static Collection<Flashcard> getUpdatedCards() {
    return cache.values();
  }

  /**
   * Returns all flashcards linked with given note.
   * @param note
   *          note object whose associated cards we want.
   * @return collection of flashcard objects.
   */
  public static Collection<Flashcard> getCardsLinkedWithNote(Note note) {
    String path =
        Main.getBasePath() + "/" + note.getSubject() + "/N" + note.getId();
    File folder = new File(path);
    return readCardsInFolder(folder, note.getSubject());
  }

  /**
   * Reads flashcards (if any) from within folder.
   * @param folder
   *          to look into.
   * @param subject
   *          the subject to look into
   * @return collection of flashcards read from given folder.
   */
  private static Collection<Flashcard> readCardsInFolder(File folder,
      String subject) {
    List<Flashcard> flashCards = new ArrayList<>();
    // Looking into the files in the given folder.
    for (File file : folder.listFiles()) {
      if (!file.isFile()) {
        continue;
      }
      String name = file.getName();
      if (!(Character.toLowerCase(name.charAt(0)) == 'f')) {
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
        String jsonData = object.toString();
        if (jsonData.isEmpty()) {
          continue; // File has no data
        } else {
          try {
            new JSONObject(jsonData);
          } catch (JSONException e) {
            continue; // File isn't a proper JSON object.
          }
        }
        Flashcard card = new Flashcard("", "");
        card.updateFields(object.toString());
        Long id;
        try {
          id = Long.parseLong(file.getName().substring(1));
        } catch (NumberFormatException e) {
          continue; // Skipping invalid file
        }

        card.setId(id);
        card.setNoteId(Long.parseLong(folder.getName().substring(1)));

        // Updating flashcard cache.
        cache.put(id, card);

        flashCards.add(card);
      } catch (IOException e) {
        return null;
      }
    }
    return flashCards;
  }

  /**
   * Reads in a list of Flashcards from memory and creates a list of Flashcards.
   * @param subject
   *          - The subject of the flashCard.
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
      // All flashcards are one level deep in folders!
      if (!file.isFile()) {
        flashCards.addAll(readCardsInFolder(file, subject));
      }
    }
    return flashCards;
  }

}
