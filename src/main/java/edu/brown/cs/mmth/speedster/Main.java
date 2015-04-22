package edu.brown.cs.mmth.speedster;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import edu.brown.cs.mmth.fileIo.IdCounter;
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
  /**
   * The base folder path.
   */
  private static String basePath = "./data";
  /**
   * The next id value to be used for either a note or a flashcard.
   */
  private static volatile long id;

  /**
   * Creates a main object.
   * 
   * @param args
   *          - The arguments passed to the program.
   */
  public static void main(String[] args) {
    new Main(args).run();
  }

  /**
   * Constructs a Main object.
   * 
   * @param argsM
   *          - The array of argument
   */
  private Main(final String[] argsM) {
    args = argsM;
  }

  /**
   * Returns base path to data folder of software.
   * 
   * @return string with path structure.
   */
  public static String getBasePath() {
    return basePath;
  }
  
  /**
   * Grabs the current id
   */
  public synchronized static long getCurrentId() {
    return id++;
  }

  /**
   * Grabs the current ID from memory
   */
  private static void getIdFromMemory() {
    File file = new File("./.id");
    if (!file.isFile()) {
      //No id file, either they're running it for the first 
      //time, or someone deleted the file which is a problem 
      //as we could now be in a inconsistent state. 
      File notes = new File(basePath);
      if (notes.isFile()) { //data folder exists, inconsistent state.
        //Grab the highest value of every note or flashcard
        System.err.println("ERROR: Iconsistent state, no ID file but notes exist");
        System.exit(1);
      }
      try (BufferedWriter writer =
          new BufferedWriter(new OutputStreamWriter(
              new FileOutputStream(file), "UTF-8"))) {
        writer.write("0"); //starting the count.
      } catch (IOException e) {
        System.err.println("ERROR: " + e.getMessage());
        System.exit(1);
      }
    }
    try (
        BufferedReader reader =
            new BufferedReader(new InputStreamReader(new FileInputStream(file),
                "UTF-8"))) {
      String line = "";
      line = reader.readLine();
      if (line != null && !line.isEmpty()) {
       try {
         id = Long.parseLong(line);
       } catch (NumberFormatException e) {
         System.err.println("ERROR: Coulnd't formate id in the id"
             + " file as a number");
         System.exit(1);
       }
      }
    } catch (IOException e) {
      System.err.println("ERROR: Problem while getting latest id value");
      System.exit(1);
    }
  }

  /**
   * Starts the Options parsing, launches the gui or stars the REPL.
   */
  private void run() {
    OptionParser parser = new OptionParser();
    parser.accepts("gui");
    /*
     * OptionSpec<Integer> portSpec = parser.accepts("port")
     * .withRequiredArg().ofType(Integer.class);
     */
    OptionSpec<File> fileSpec = parser.nonOptions().ofType(File.class);
    OptionSet options = null;
    try {
      options = parser.parse(args);
    } catch (joptsimple.OptionException e) {
      System.out.println("ERROR: jopt exception " + e.getMessage());
      System.exit(1);
    }

    int length = args.length;
    if (length > 2) {
      System.err.println("ERROR: Must match pattern [--gui]");
      System.exit(1);
    }

    File db = options.valueOf(fileSpec);
    Main.getIdFromMemory();
    Thread thread = new Thread(new IdCounter());
    thread.start();
    if (options.has("gui")) {
      Web.runSparkServer();
    }
  }

}
