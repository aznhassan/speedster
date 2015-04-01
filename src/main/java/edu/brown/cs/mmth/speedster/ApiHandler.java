package edu.brown.cs.mmth.speedster;

import java.util.List;
import java.util.Map;

import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Route;

import com.google.common.collect.ImmutableMap;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * Handles the ajax requests sent by the front end.
 * 
 * @author hassan
 *
 */
public final class ApiHandler {

  /**
   * Private Constructor.
   */
  private ApiHandler() {
  }

  private static class NoteMetaHandler implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      // Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }

  private static class SuggestionsHandler implements Route {
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

  private static class GetNote implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      // Grab request specifics from the map, grab the
      // request page as json.
      String toReturn = "";
      return toReturn;
    }
  }

  private static class UpdateCSS implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      // Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }

  private static class GetNextFlashCard implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      // Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }

  private static class UpdateFlashCard implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      // Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }
}
