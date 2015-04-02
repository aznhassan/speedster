package edu.brown.cs.mmth.speedster;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Map;

import joptsimple.OptionParser;
import joptsimple.OptionSet;
import joptsimple.OptionSpec;
import spark.ExceptionHandler;
import spark.ModelAndView;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Spark;
import spark.TemplateViewRoute;
import spark.template.freemarker.FreeMarkerEngine;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;

import freemarker.template.Configuration;

/**
 * This is the main class that co-ordinates GUI with the back-end.
 *
 * @author tbhargav
 *
 */
public final class Main {
  /**
   * The arguments given to the program.
   */
  private final String[] args;
  /**
   * Gson object to make things into JSON.
   */
  private static final Gson GSON = new Gson();

  /** Creates a main object.
   * @param args - The arguments passed to the program.
   */
  public static void main(String[] args) {
    new Main(args).run();
  }

  /**
   * HTML server exception number.
   */
  private static final int EXCEPTIONSTATUS = 500;

  /** Constructs a Main object.
   * @param argsM - The array of argument
   */
  private Main(final String[] argsM) {
    args = argsM;
  }

  /**
   * Starts the Options parsing, launches the gui or stars the
   * REPL.
   */
  private void run() {
    OptionParser parser = new OptionParser();
    parser.accepts("gui");
    /*OptionSpec<Integer> portSpec = parser.accepts("port")
            .withRequiredArg().ofType(Integer.class);*/
    OptionSpec<File> fileSpec = parser.nonOptions().ofType(File.class);
    OptionSet options = null;
    try {
      options = parser.parse(args);
    } catch (joptsimple.OptionException e) {
      System.out.println("ERROR: jopt exception " + e.getMessage());
      System.exit(1);
    }

    int length = args.length;
    if (length > 2 || length == 0) {
      System.err.println("ERROR: Must match pattern");
      System.exit(1);
    }

    File db = options.valueOf(fileSpec);

    if (options.has("gui")) {
      runSparkServer();
    }
  }


  /**
   * Runs the spark server.
   */
  private void runSparkServer() {
    Spark.externalStaticFileLocation("src/main/resources/static");
    Spark.exception(Exception.class, new ExceptionPrinter());

    FreeMarkerEngine freeMarker = createEngine();

    // Setup Spark Routes
    Spark.get("/home", new FrontHandler(), freeMarker);
    Spark.get("/allNotes", new ApiHandler.NoteMetaHandler());
    Spark.post("/words", new ApiHandler.SuggestionsHandler());
    Spark.post("/updateStyle", new ApiHandler.UpdateCSS() );
    Spark.get("/getNote/:id", new ApiHandler.GetNote(), freeMarker);
    Spark.post("/getNextFlashcard", new ApiHandler.GetNextFlashCard());
    Spark.post("/finishedCard", new ApiHandler.UpdateFlashCard());
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

  /** Launches a site where you can query the baconGraph.
   * @author hsufi
   *
   */
  private static class FrontHandler implements TemplateViewRoute {
    @Override
    public ModelAndView handle(final Request req, final Response res) {
      Map<String, Object> variables =
              ImmutableMap.of(
                      "title", "Maps");
      return new ModelAndView(variables, "map.ftl");
    }
  }

  /** Handles map requests.
   * @author hsufi
   *
   */
  private static class ResultsHandler implements TemplateViewRoute {
    @Override
    public ModelAndView handle(final Request req, final Response res) {
      QueryParamsMap qm = req.queryMap();
      Map<String, Object> variables =
              ImmutableMap.of(
                      "title", "C32: Maps");
      return new ModelAndView(variables, "results.ftl");
    }
  }

  /** Prints out exceptions to the page.
   * @author hsufi
   *
   */
  private static class ExceptionPrinter implements ExceptionHandler {
    @Override
    public void handle(final Exception e, final Request req,
            final Response res) {
      res.status(EXCEPTIONSTATUS);
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

