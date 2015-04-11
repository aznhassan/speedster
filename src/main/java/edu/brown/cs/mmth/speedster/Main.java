package edu.brown.cs.mmth.speedster;

import java.io.File;

import joptsimple.OptionParser;
import joptsimple.OptionSet;
import joptsimple.OptionSpec;
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

  /** Creates a main object.
   * @param args - The arguments passed to the program.
   */
  public static void main(String[] args) {
    new Main(args).run();
  }

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
      Web.runSparkServer();
    }
  }

}

