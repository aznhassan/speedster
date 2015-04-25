package edu.brown.cs.mmth.speedster;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;

import edu.brown.cs.mmth.fileIo.CSSSheetMaker;
import edu.brown.cs.mmth.fileIo.FlashCardReader;
import edu.brown.cs.mmth.fileIo.NoteReader;
import edu.brown.cs.tbhargav.tries.Word;
import spark.ModelAndView;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.TemplateViewRoute;

/**
 * Handles the ajax requests sent by the front end.
 *
 * @author hsufi
 *
 */
public final class ApiHandler {

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
          ImmutableMap.of("title", "Welcome home", "folderJSON", emptyJSON);
      if (subjects == null || subjects.length == 0) {
        return new ModelAndView(empty, "main.ftl");
      }
      JSONArray array = new JSONArray();
      for (File subject : subjects) {
        Collection<Note> noteList = NoteReader.readNotes(subject.getName());
        if (noteList == null) {
          return new ModelAndView(empty, "main.ftl");
        }
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
   * Handles updating notes per folder when new notes are added by the user on
   * the main page.
   * 
   * @author sm15
   */
  public static class UpdateNotes implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      String folderJson = qm.value("folders");
      String noteJson = qm.value("notes");
      Map<String, Object> variables = ImmutableMap.of("title", "Welcome home");
      return new ModelAndView(variables, "main.ftl");
    }
  }

  /**
   * Generates autocorrect suggestions for the given word.
   * 
   * @author tbhargav
   *
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
   * Updates the stylesheet of the current subject with the given rules.
   * 
   * @author hsufi
   */
  public static class UpdateCSS implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      String cssJson = qm.value("styles_on_save");
      Boolean success = false;
      try {
        success = CSSSheetMaker.writeJsonToFile(cssJson);
      } catch (IOException e) {
        System.err.println("ERROR: CSS error " + e.getMessage());
      }
      String toReturn = "";
      return toReturn;
    }
  }

  /**
   * Grabs the next flashcard to display to the user based on the data from each
   * flashcard. 
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
      String subject = qm.value("subject");

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
      if(next==null) {
        variables = ImmutableMap.of("q", "You are done reviewing!", "a", "Yes, you heard it right the first time!",
            "session_number", sessionID, "card_id", "-1"); 
      } else {
        variables =
            ImmutableMap.of("q", next.getQuestion(), "a", next.getAnswer(),
                "session_number", sessionID, "card_id", next.getId()); 
      }
        return gson.toJson(variables);
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
  }