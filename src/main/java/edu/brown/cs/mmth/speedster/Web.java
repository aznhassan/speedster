package edu.brown.cs.mmth.speedster;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import spark.ExceptionHandler;
import spark.Request;
import spark.Response;
import spark.Spark;
import spark.template.freemarker.FreeMarkerEngine;
import freemarker.template.Configuration;

/**
 * Provides a launching mechanism for a web gui.
 */
public final class Web {

  private static final int INTERNAL_SERVER_ERROR = 500;
  private static final int PORT = 4567;

  private Web() { /* Constructor... defeated! */ }

  /**
   * Runs the spark server.
   */
  public static void runSparkServer() {
    Spark.externalStaticFileLocation("src/main/resources/static");
    Spark.exception(Exception.class, new ExceptionPrinter());

    FreeMarkerEngine freeMarker = createEngine();

    // Setup Spark Routes
    Spark.get("/notes", new ApiHandler.NoteMetaHandler(), freeMarker);
    Spark.post("/words", new ApiHandler.SuggestionsHandler());
    Spark.post("/updateCSS", new ApiHandler.UpdateRules());
    Spark.get("/getNote/:folder/:id", new ApiHandler.GetNote(), freeMarker);
    Spark.post("/getNextFlashcard", new ApiHandler.GetNextFlashCard());
    Spark.get("/getNewSession/:subject", new ApiHandler.GetNewSession(),freeMarker);
    Spark.post("/updateNote", new ApiHandler.UpdateNotes());
    Spark.post("/finishedCard", new ApiHandler.UpdateFlashCard());
    Spark.post("/newNote", new ApiHandler.NotesCreator());
    Spark.get("/flashcard/:id", new ApiHandler.FlashCardView(), freeMarker);
    Spark.get("/getRules", new ApiHandler.GetRules());
    Spark.post("/rulesForSubject", new ApiHandler.GetRule());
    // TODO: Fix delete folder.
    Spark.post("/deleteFolder", new ApiHandler.DeleteSubject());
    Spark.post("/deleteNote", new ApiHandler.DeleteNote());
    Spark.get("/newFolder", new ApiHandler.CreateFolder());
  }

  /** Returns a freeMakerEngine.
   * @return - A freeMakerEngine
   */
  private static FreeMarkerEngine createEngine() {
    Configuration config = new Configuration();
    File templates =
        new File("src/main/resources/spark/template/freemarker");
    try {
      config.setDirectoryForTemplateLoading(templates);
    } catch (IOException ioe) {
      System.out.printf("ERROR: Unable use %s for template loading",
          templates);
      System.exit(1);
    }
    return new FreeMarkerEngine(config);
  }

  /** Prints out exceptions to the page.
   * @author hsufi
   *
   */
  private static class ExceptionPrinter implements ExceptionHandler {
    @Override
    public void handle(final Exception e, final Request req,
                       final Response res) {
      res.status(INTERNAL_SERVER_ERROR);
      StringWriter stacktrace = new StringWriter();
      try (PrintWriter pw = new PrintWriter(stacktrace)) {
        pw.println("<pre>");
        e.printStackTrace(pw);
        pw.println("</pre>");
      }
      res.body(stacktrace.toString());
    }
  }

}
