package edu.brown.cs.mmth.speedster;

import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Route;

/** Handles the ajax requests sent by the front end.
 * @author hassan
 *
 */
public final class ApiHandler {

  /**
   * Private Constructor.
   */
  private ApiHandler() {}


  private static class NoteMetaHandler implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      //Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }

  private static class SuggestionsHandler implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      //Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }

  private static class GetNote implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      //Grab request specifics from the map, grab the
      //request page as json.
      String toReturn = "";
      return toReturn;
    }
  }

  private static class UpdateCSS implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      //Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }

  private static class GetNextFlashCard implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      //Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }

  private static class UpdateFlashCard implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      //Grab request specifics from the map
      String toReturn = "";
      return toReturn;
    }
  }
}
