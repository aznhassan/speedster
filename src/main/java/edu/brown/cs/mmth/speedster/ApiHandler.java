package edu.brown.cs.mmth.speedster;


import java.util.List;
import java.util.Map;

import spark.ModelAndView;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.TemplateViewRoute;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * Handles the ajax requests sent by the front end.
 *
 * @author hsufi
 *
 */
public final class ApiHandler {

  // Instance variables.
  private static Gson gson = new Gson();
  
  /**
   * Private Constructor.
   */
  private ApiHandler() {
  }

  public static class NoteMetaHandler implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      // Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }

  public static class SuggestionsHandler implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      // Helps get content from 'form'
      QueryParamsMap qm = req.queryMap();
      String inputText = qm.value("text_box");

      // String parsing to get neat suggestions.
      String sansPunct = edu.brown.cs.tbhargav.autocorrect.Main
          .stripPunctuation(inputText);
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
        prevWord = withoutWord.toString().split(" ")[withoutWord.toString()
                                                     .split(" ").length - 1];
      }

      List<Word> suggs = edu.brown.cs.tbhargav.autocorrect.Main
          .suggGenAndRanker(
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

      variables = ImmutableMap.of("title", "Hollywood Connections", "message",
          " ", "orig", inputText, "suggs", sb.toString());

      return gson.toJson(variables);

    }
  }

  /** Loads the note given by the id and then runs that
   *  note on it's own page.
   * @author hsufi
   *
   */
  public static class GetNote implements TemplateViewRoute  {
    @Override
    public ModelAndView handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      int id = Integer.parseInt(req.params(":id"));
      //Grab the note with this id from the db
      Map<String, Object> variables =
              ImmutableMap.of(
                      "title", "Speedster");
      return new ModelAndView(variables, "note.ftl");
    }
  }

  public static class UpdateCSS implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      // Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }

  public static class GetNextFlashCard implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      // Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }

  public static class UpdateFlashCard implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      // Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }
}
