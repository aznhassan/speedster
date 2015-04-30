package edu.brown.cs.mmth.speedster;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import spark.ModelAndView;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.TemplateViewRoute;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.gson.Gson;

import edu.brown.cs.mmth.fileIo.CSSSheetMaker;
import edu.brown.cs.mmth.fileIo.FlashCardReader;
import edu.brown.cs.mmth.fileIo.FlashCardWriter;
import edu.brown.cs.mmth.fileIo.NoteReader;
import edu.brown.cs.mmth.fileIo.NoteWriter;
import edu.brown.cs.tbhargav.tries.Word;

/**
 * Handles the Ajax requests sent by the front end.
 *
 * @author hsufi
 *
 */
public final class ApiHandler {

  /**
   * Loads the note given by the id and then runs that note on it's own page.
   *
   * @author hsufi
   *
   */
  public static class FlashCardView implements TemplateViewRoute {
    @Override
    public ModelAndView handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      int id = Integer.parseInt(req.params(":id"));
      // Grab the note with this id from the db
      Map<String, Object> variables = ImmutableMap.of("title", "Flashcards");
      return new ModelAndView(variables, "flashcard.ftl");
    }
  }

  /**
   * Generates a new session with a new session ID. Needs to be provided
   * subject.
   *
   * @author tbhargav
   *
   */
  public static class GetNewSession implements TemplateViewRoute {
    @Override
    public ModelAndView handle(final Request req, final Response res) {
      String subjectE = req.params("subject");
      String subject = "";
      try {
        subject = URLDecoder.decode(subjectE, "UTF-8");
      } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
      }
      Map<String, Object> variables =
          ImmutableMap.of("title", "Speedster", "session_id", sessionID);
      // Getting all flashcards within specified subject.
      Collection<Flashcard> subjectCards = FlashCardReader.readCards(subject);
      FlashcardShuffler currSession = new FlashcardShuffler(subjectCards);
      // Putting session with ID in cache.
      FlashcardShuffler.addSession(sessionID, currSession);
      sessionID++;
      return new ModelAndView(variables, "flashcard.ftl");
    }
  }

  /**
   * Creates a new folder, gives it a unique ID and returns the data to server.
   *
   * @author tbhargav
   */
  public static class CreateFolder implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      String subjectName="";
      try {
        subjectName = URLDecoder.decode(qm.value("title"),"UTF-8");
      } catch (UnsupportedEncodingException e1) {
        // TODO: better error handling.
        e1.printStackTrace();
      }

      // Creating a new folder in memory, along with its ID file.
      File folder = new File(Main.getBasePath() + "/" + subjectName);
      folder.mkdirs();

      boolean success = true;

      long id = Main.getAndIncrementId();
      File idFile = new File(Main.getBasePath() + "/" + subjectName + "/id");
      FileWriter idWriter;
      try {
        idWriter = new FileWriter(idFile);
        idWriter.write(Long.toString(id));
        idWriter.close();
      } catch (IOException e) {
        success = false;
      }

      Map<String, Object> variables =
          ImmutableMap.of("title", subjectName, "id", id, "error", success);
      return gson.toJson(variables);
    }
  }

  /**
   * Grabs the next flashcard to display to the user based on the data from each
   * flashcard.
   *
   * @author tbhargav
   */
  public static class GetNextFlashCard implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();

      String sessionNo = qm.value("session_number");
      int sessionID = 0;
      try {
        sessionID = Integer.parseInt(sessionNo);
      } catch (NumberFormatException e) {
        return "Invalid session ID provided.";
      }

      // Locating the FlashcardShuffler associated with current session. Or
      // creating
      // a new one if none is found.
      FlashcardShuffler currSession;
      if (FlashcardShuffler.hasSession(sessionID)) {
        currSession = FlashcardShuffler.getSession(sessionID);
      } else {
        return null;
      }

      // Getting next card (shuffler object handles this decision).
      Flashcard next = currSession.nextCard();

      Map<String, Object> variables;

      // Session is over! Indicated by -1.
      if (next == null) {
        variables =
            ImmutableMap
                .of("q",
                    "You are done reviewing!",
                    "a",
                    "Yes, you heard it right the first time! Close tab to end session.",
                    "session_number", sessionID, "card_id", "-1");
      } else {
        variables =
            ImmutableMap.of("q", next.getQuestion(), "a", next.getAnswer(),
                "session_number", sessionID, "card_id", next.getId());
      }
      return gson.toJson(variables);
    }
  }

  /**
   * Loads the note given by the id and then runs that note on it's own page.
   *
   * @author hsufi
   *
   */
  public static class GetNote implements TemplateViewRoute {
    @Override
    public ModelAndView handle(final Request req, final Response res) {
      int id;
      try {
        id = Integer.parseInt(req.params(":id"));
      } catch (NumberFormatException e) {
        Map<String, Object> problem =
            ImmutableMap
                .of("title", "Speedster", "content", "Improper note id");
        return new ModelAndView(problem, "error.ftl");
      }
      String subject = req.params(":folder");
      try {
        subject = URLDecoder.decode(subject, "UTF-8");
      } catch (UnsupportedEncodingException e) {
        Map<String, Object> problem =
            ImmutableMap.of("title", "Speedster", "content",
                "Decoding exception");
        return new ModelAndView(problem, "error.ftl");
      }
      Collection<Note> notes = NoteReader.readNotes(subject);
      Long subjectId = NoteReader.getNoteSubjectId(subject);
      if (notes == null) {
        Map<String, Object> problem =
            ImmutableMap.of("title", "Speedster", "content",
                "No notes in subject");
        return new ModelAndView(problem, "error.ftl");
      }
      Note returnNote = null;
      for (Note note : notes) {
        if (note.getId() == id) {
          returnNote = note;
          break;
        }
      }
      Map<String, Object> variables;
      if (returnNote != null) {
        variables =
            ImmutableMap.of("title", "Speedster", "note",
                returnNote.getTextData(), "customCss", "../../customCss/"
                    + subjectId + ".css");
      } else {
        variables =
            ImmutableMap.of("title", "Speedster", "note",
                "Note doesn't exist!", "customCss", "../../customCss/"
                    + subjectId + ".css");
      }
      return new ModelAndView(variables, "note.ftl");
    }
  }

  /**
   * Loads metadata associated with all notes.
   *
   * @author hsufi
   *
   */
  public static class NoteMetaHandler implements TemplateViewRoute {
    @Override
    public ModelAndView handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      /*
       * [ { "folder_id":id, "folder_name":name, "notes": [{ "note_id":id,
       * "note_name":name }, { "note_id":id, "note_name":name }] }" ]
       */
      File baseDirectory = new File(Main.getBasePath());
      File[] subjects = baseDirectory.listFiles();
      String emptyJSON = "{}";
      Map<String, Object> empty =
          ImmutableMap.of("title", "Welcome home", "data", emptyJSON);
      if (subjects == null || subjects.length == 0) {
        return new ModelAndView(empty, "main.ftl");
      }
      List<File> subjectList = Arrays.asList(subjects);
      Collections.sort(subjectList, new Comparator<File>() {
        public int compare(File o1, File o2) {
          return o1.getName().compareTo(o2.getName());
        }
      });

      JSONArray array = new JSONArray();
      for (File subject : subjects) {
        Collection<Note> noteCollection =
            NoteReader.readNotes(subject.getName());
        if (noteCollection == null) {
          return new ModelAndView(empty, "main.ftl");
        }

        List<Note> noteList = new ArrayList<>();
        noteList.addAll(noteCollection);
        Collections.sort(noteList, new Comparator<Note>() {
          public int compare(Note n1, Note n2) {
            return n1.getName().compareTo(n2.getName());
          }
        });
        JSONObject folder = new JSONObject();
        folder.put("folder_name", subject.getName());
        Long id = NoteReader.getNoteSubjectId(subject.getName());
        if (id == -1) {
          continue; // Improper ID file.
        }
        folder.put("folder_id", id);
        JSONArray noteArray = new JSONArray();
        for (Note note : noteList) {
          JSONObject obj = new JSONObject();
          obj.put("note_id", note.getId());
          obj.put("note_name", note.getName());
          noteArray.put(obj);
        }
        folder.put("notes", noteArray);
        array.put(folder);
      }
      // Grab the note with this id from the db
      Map<String, Object> variables =
          ImmutableMap.of("title", "Welcome home", "data", array.toString());
      return new ModelAndView(variables, "main.ftl");
    }
  }

  /**
   * Generates autocorrect suggestions for the given word.
   * 
   * @author tbhargav
   */
  public static class SuggestionsHandler implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      // Helps get content from 'form'
      QueryParamsMap qm = req.queryMap();
      String inputText = qm.value("text_box");

      // String parsing to get neat suggestions.
      String sansPunct =
          edu.brown.cs.tbhargav.autocorrect.Main.stripPunctuation(inputText);
      String[] arr = sansPunct.split(" ");
      String word = arr[arr.length - 1];
      String prevWord = "";
      StringBuilder withoutWord = new StringBuilder();
      for (int i = 0; i < arr.length - 1; i++) {
        if (!arr[i].trim().equalsIgnoreCase("")) {
          withoutWord.append(arr[i].trim() + " ");
        }
      }

      if (!withoutWord.toString().isEmpty()) {
        prevWord =
            withoutWord.toString().split(" ")[withoutWord.toString().split(" ").length - 1];
      }

      List<Word> suggs =
          edu.brown.cs.tbhargav.autocorrect.Main.suggGenAndRanker(
              edu.brown.cs.tbhargav.autocorrect.Main.getGlobalTrie(), word,
              prevWord);

      // Combining the 5 (punctuation free suggestions
      // into a big '.' separated string
      StringBuilder sb = new StringBuilder("");
      for (int i = 0; i < suggs.size(); i++) {
        Word w = suggs.get(i);
        sb.append(withoutWord + w.getStringText());
        if (i == suggs.size() - 1) {
          continue;
        }
        sb.append('.');
      }

      // Adding suggestions in manually!
      Map<String, Object> variables;

      variables =
          ImmutableMap.of("title", "Hollywood Connections", "message", " ",
              "orig", inputText, "suggs", sb.toString());
      return gson.toJson(variables);
    }
  }

  /**
   * Deletes the note with the given ID. Returns boolean with success status.
   * (True if note was deleted, false if not.)
   *
   * @author tbhargav
   */
  public static class DeleteNote implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      String noteID = qm.value("note_id");
      String subject = qm.value("subject");
      boolean success = false;
      File noteFolder =
          new File(Main.getBasePath() + "/" + subject + "/N" + noteID);

      // Deleting the note folder.
      try {
        FileUtils.deleteDirectory(noteFolder);
      } catch (IOException e) {
        return success;
      }
      return success;
    }
  }

  /**
   * Updates the notes and flashcards with data from front-end.
   *
   * @author tbhargav
   */
  public static class UpdateNotes implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      String noteData = qm.value("data");
      String noteID = qm.value("noteid");
      String subject = qm.value("subject");
      String title = qm.value("title");

      // Writing note to memory (overwriting old edition).
      Note note = new Note(noteData, subject, title);
      note.setId(Long.parseLong(noteID));

      // Write flashcards to file if there are any
      // (rawJSONCards will be null if no flashcards are sent)
      String rawJSONCards = qm.value("flashcards");

      if (rawJSONCards == null) {
        return "";
      }

      JSONArray jsonCards = new JSONArray(rawJSONCards);

      Collection<Flashcard> cardsToWrite = new ArrayList<>();

      // Creating new flashcards (or merging pre-existing ones).
      for (int i = 0; i < jsonCards.length(); i++) {
        JSONObject currCard = jsonCards.getJSONObject(i);
        // Reading all flashcards from associated note.
        Collection<Flashcard> cards =
            FlashCardReader.getCardsLinkedWithNote(note);
        // Iterating through cards to see if we want to update an old one or
        // create a new one.
        boolean cardExisted = false;

        // TODO: Duplicate being created here maybe.
        
        for (Flashcard card : cards) {
          // If card with same question exists, update answer.
          if (card.getQuestion().equals(currCard.getString("q"))) {
            card.setAnswer(currCard.getString("a"));
            cardsToWrite.add(card);
            cardExisted = true;
          }
        }

        // We need to make a new card.
        if (!cardExisted) {
          Flashcard toAdd =
              new Flashcard(currCard.getString("a"), currCard.getString("q"));
          toAdd.setId(Main.getAndIncrementId());
          toAdd.setSubjectName(subject);
          toAdd.setNoteId(note.getId());
          cardsToWrite.add(toAdd);
        }
      }

      // Clearing the note directory as we now have everything we need to write!
      File noteFolder =
          new File(Main.getBasePath() + "/" + subject + "/N" + note.getId());
      try {
        FileUtils.deleteDirectory(noteFolder);
      } catch (IOException e) {
        // TODO: Better error handling!
        return "";
      }

      // Writing note to disk.
      NoteWriter.writeNotes(Lists.newArrayList(note));
      // Writing these cards to disk.
      FlashCardWriter.writeCards(cardsToWrite);
      return "";
    }
  }

  /**
   * Updates the stylesheet of the current subject with the given rules, as well
   * as the rules for the current subject.
   * 
   * @author hsufi
   */
  public static class UpdateRules implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      String cssJson = qm.value("rule");
      boolean success = false;
      try {
        success = CSSSheetMaker.writeJsonToFile(cssJson);
      } catch (IOException | JSONException e) {
        System.err.println("ERROR: CSS error " + e.getMessage());
        return makeExceptionJSON(e.getMessage());
      }
      return success;
    }
  }

  /**
   * Grabs all the rules from every class
   * 
   * @author hsufi
   *
   */
  public static class GetRules implements Route {
    @Override
    public Object handle(Request req, Response res) {
      File file = new File(Main.getBasePath());
      File[] subjects = file.listFiles();
      if (subjects == null || subjects.length == 0) {
        return makeExceptionJSON("No subjects found");
      }
      StringBuilder bd = new StringBuilder("[");
      for (File subject : subjects) {
        String rules = getRulesInSubject(subject);
        if (rules.equals("[]")) {
          continue;
        } else {
          rules = rules.substring(1);
          rules = rules.substring(0, rules.length() - 1);
          bd.append(rules);
          bd.append(",");
        }
      }
      if (bd.length() > 1) {
        bd.deleteCharAt(bd.length() - 1); // deleting the extra ","
      }

      bd.append("]");
      return bd.toString();
    }
  }

  /**
   * Grabs all the rules in a given subject.
   * 
   * @param subject
   *          - The file that points to the subject directory.
   * @return The JSON array of all the rules in the subject.
   */
  private static String getRulesInSubject(File subject) {
    StringBuilder bd = new StringBuilder("[");
    File ruleDirectory = new File(subject, "/rules");
    File[] rules = ruleDirectory.listFiles();
    if (rules == null || rules.length == 0) {
      return "[]";
    }
    for (File rule : rules) {
      try (
          BufferedReader br =
              new BufferedReader(new InputStreamReader(
                  new FileInputStream(rule), "UTF-8"))) {
        String line = "";
        while ((line = br.readLine()) != null) {
          bd.append(line);
        }
        bd.append(",");
      } catch (IOException e) {
        return makeExceptionJSON(e.getMessage());
      }
    }
    if (bd.length() > 1) {
      bd.deleteCharAt(bd.length() - 1); // deleting the extra ","
    }
    bd.append("]");
    return bd.toString();
  }

  /**
   * Grabs all the rules of a subject
   * 
   * @author hsufi
   */
  public static class GetRule implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      String subject = qm.value("subject");
      File subjectFile = new File(Main.getBasePath() + "/" + subject);
      String toReturn = getRulesInSubject(subjectFile);
      return toReturn;
    }
  }

  /**
   * Deletes the given folder and all the contents.
   * 
   * @author hsufi
   *
   */
  public static class DeleteSubject implements Route {
    @Override
    public Object handle(Request req, Response res) {
      QueryParamsMap qm = req.queryMap();
      String folder = qm.value("folder");
      if (folder == null || folder.isEmpty()) {
        return makeExceptionJSON("No folder given");
      }
      File file = new File(Main.getBasePath() + "/" + folder);
      if (!file.isDirectory()) {
        return makeExceptionJSON("Folder doesn't exist");
      }

      try {
        FileUtils.deleteDirectory(file);
        long subjectId = NoteReader.getNoteSubjectId(folder);
        File customCss =
            new File("src/main/resources/static/customCss/" + subjectId
                + ".css");
        customCss.delete();
      } catch (IOException e) {
        return makeExceptionJSON("Folder couldn't be deleted");
      }

      return true;
    }
  }

  /*
   * Updates the meta-data of the given flashcard in simpler terms tells us
   * whether the user got the flashcard wrong or right and for which session
   * (and which flashcard).
   * 
   * @author tbhargav
   */
  public static class UpdateFlashCard implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      // Grab boolean status of card, as well as card ID and session number.
      try {
        String ansCorrect = qm.value("ansCorrect");
        boolean isAnsCorrect = Boolean.parseBoolean(ansCorrect);
        String sessionNo = qm.value("session_no");
        int sNo = Integer.parseInt(sessionNo);
        String cardIDStr = qm.value("cardID");
        long cardID = Long.parseLong(cardIDStr);

        // Getting card with given ID (we know it is in memory
        // as cards are loaded for flashcard shuffling).
        Flashcard currCard = FlashCardReader.getFlashcardFromCache(cardID);

        // Updating the date of the card to today (its last review).
        currCard.updateLastUse();
        
        // Finding session and removing card if it was correct.
        // Updating card stats as well.
        if (isAnsCorrect) {
          FlashcardShuffler session = FlashcardShuffler.getSession(sNo);
          session.markCardCorrect(currCard);
          currCard.setNumberTimesCorrect(currCard.getNumberTimesCorrect() + 1);
        } else {
          currCard.setNumberTimesWrong(currCard.getNumberTimesWrong() + 1);
        }
      } catch (Exception e) {
        // TODO: Better error handling rules!
        return null;
      }

      // Nothing to return.
      return "";
    }
  }

  /**
   * Handles creating notes per folder when new notes are added by the user on
   * the main page. (One time creator.)
   *
   * @author tbhargav
   */
  public static class NotesCreator implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      String folder_name = qm.value("folder_name");
      String note_name = qm.value("note_name");

      Note note = new Note("", folder_name, note_name);
      note.setId(Main.getAndIncrementId());
      // Writing note to file.
      NoteWriter.writeNotes(Lists.newArrayList(note));
      JSONObject noteJson = new JSONObject();
      noteJson.put("note_id", note.getId());
      return noteJson.toString();
    }
  }

  /**
   * Gson object to make things into JSON.
   */
  private static final Gson gson = new Gson();

  private static int sessionID = 0;

  /**
   * Private Constructor.
   */
  private ApiHandler() {
  }

  /**
   * Wraps an exception message into an error JSON object.
   * 
   * @param exceptionMSG
   *          - The exception message to send
   * @return exceptionMSG wrapped in a JSON object with an error field.
   */
  private static String makeExceptionJSON(String exceptionMSG) {
    return "{\"error\":" + exceptionMSG + "}";
  }
}
