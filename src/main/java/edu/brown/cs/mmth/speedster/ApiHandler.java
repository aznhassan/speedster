package edu.brown.cs.mmth.speedster;

import java.util.Map;

import spark.ModelAndView;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.TemplateViewRoute;

import com.google.common.collect.ImmutableMap;

/**
 * Handles the ajax requests sent by the front end.
 *
 * @author hsufi
 *
 */
public final class ApiHandler {

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
      QueryParamsMap qm = req.queryMap();
      // Grab request specifics from the map
      String toReturn = "";
      return toReturn;
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
