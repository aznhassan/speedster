/**
 * Part of the autocorrect project package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import joptsimple.OptionParser;
import joptsimple.OptionSet;
import spark.ModelAndView;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import spark.SparkBase;
import spark.TemplateViewRoute;
import spark.template.freemarker.FreeMarkerEngine;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;

import edu.brown.cs.tbhargav.fileparsers.ExtWordsFileParser;
import edu.brown.cs.tbhargav.tries.Trie;
import edu.brown.cs.tbhargav.tries.Word;

/**
 * This the main class of the project. It handles the CLI and GUI command
 * parsing.
 *
 * @author tbhargav
 *
 */

public class Main {

  // Instance variables
  private static boolean gui = false;
  private static boolean prefix = false;
  private static boolean led = false;
  private static boolean whitespace = false;
  private static boolean smart = false;
  private static int ledNo = 0;
  private static Trie<Word> globalTrie = new Trie<Word>();
  private static Gson gson = new Gson();

  /**
   * Number of suggestions to generate.
   */
  private static final int NUM_SUGG = 5;

  protected Main() {
    throw new UnsupportedOperationException();
  }

  /**
   * <pre>
   * The main method that launches the CLI/GUI.
   * @param args - The arguments given to the program.
   * </pre>
   */
  public static void main(final String[] args) {
    List<String> fileNames = initialCommandParser(args);

    if (fileNames != null && fileNames.size() == 0) {
      System.out.println("ERROR: No corpus provided.");
      System.exit(-1);
    }

    Trie<Word> masterTrie = new Trie<Word>();

    // Loop to read all files and add to one big trie!
    ExtWordsFileParser fReader = new ExtWordsFileParser(fileNames.get(0));
    ArrayList<String> textWords = new ArrayList<String>();

    for (String file : fileNames) {
      fReader.setFileName(file);
      try {
        textWords.addAll(fReader.readWords());
      } catch (IOException e) {
        fReader.closeReader();
        System.out.println("ERROR: Invalid/corrupt file.");
        System.exit(-1);
      }
      // Separator between files (can be made
      // more unique).
      textWords.add("br");
    }
    HashMap<String, Word> dict = Word.makeWordsFromStrings(textWords);

    // Now the master trie has all the words from the corpus.
    masterTrie.addValues(dict.values());
    globalTrie = masterTrie;

    // Triggering the GUI or CLI.
    if (!gui) {
      try {
        cliParser(masterTrie);
      } catch (IOException e) {
        System.out.println("ERROR: " + e.getMessage());
      }
    } else {
      runSparkServer();
    }

  }

  /**
   * Turns on prefix and whitespace suggestions!
   */
  public static void turnBasicGenOn() {
    prefix = true;
    whitespace = true;
  }

  /**
   * <pre>
   * Creates the global trie using given file names.
   * @param fileNames - The list of filenames.
   * </pre>
   */
  public static void createTrie(final List<String> fileNames) {
    turnBasicGenOn();
    // Loop to read all files and add to one big trie!
    ExtWordsFileParser fReader = new ExtWordsFileParser(fileNames.get(0));
    ArrayList<String> textWords = new ArrayList<String>();

    for (String file : fileNames) {
      fReader.setFileName(file);
      try {
        textWords.addAll(fReader.readWords());
      } catch (IOException e) {
        fReader.closeReader();
        System.out.println("ERROR: Invalid/corrupt file.");
        System.exit(-1);
      }
      // Separator between files (can be made
      // more unique).
      textWords.add("br");
    }
    HashMap<String, Word> dict = Word.makeWordsFromStrings(textWords);
    globalTrie.addValues(dict.values());
  }

  /**
   * Accessor method.
   * 
   * @return the globalTrie
   */
  public static Trie<Word> getGlobalTrie() {
    return globalTrie;
  }

  /**
   * Launches Spark.
   */
  private static void runSparkServer() {
    SparkBase.externalStaticFileLocation("src/main/resources/static");
    Spark.get("/autocorrect", new GetHandler(), new FreeMarkerEngine());
    Spark.post("/suggestions", new ShowResultsHandler());
  }

  // Class to handle GET request (custom handler basically)
  private static class GetHandler implements TemplateViewRoute {
    @Override
    public ModelAndView handle(final Request req, final Response res) {
      // Defining the variable 'title'
      Map<String, Object> variables =
          ImmutableMap.of("title", "Mind your language!", "message", " ",
              "orig", "", "suggs", "");
      return new ModelAndView(variables, "main.ftl");
    }
  }

  /**
   * Class to read GUI input string and return suggestions!
   *
   * @author tbhargav
   *
   */
  private static class ShowResultsHandler implements Route {
    @Override
    public Object handle(final Request req, final Response res) {
      // Helps get content from 'form'
      QueryParamsMap qm = req.queryMap();
      String inputText = qm.value("text_box");

      // String parsing to get neat suggestions.
      String sansPunct = stripPunctuation(inputText);
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

      List<Word> suggs = suggGenAndRanker(globalTrie, word, prevWord);

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
          ImmutableMap.of("title", "Mind your language", "message", " ",
              "orig", inputText, "suggs", sb.toString());

      return gson.toJson(variables);

    }
  }

  private static void cliParser(final Trie<Word> trie) throws IOException {
    InputStreamReader ir = new InputStreamReader(System.in);
    BufferedReader br = new BufferedReader(ir);
    String input = " ";
    System.out.println("Ready");
    while (input != null) {
      input = br.readLine();
      if (input == null) {
        break;
      }
      // Exit on empty line
      if (input.length() == 0) {
        System.exit(0);
      }

      // Trailing space edge case
      if (!input.trim().equals(input)) {
        System.out.println("");
        continue;
      }

      String sansPunct = stripPunctuation(input);
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

      List<Word> suggs = suggGenAndRanker(trie, word, prevWord);
      for (Word w : suggs) {
        System.out.println(withoutWord.toString() + w.getStringText());
      }
      System.out.println("");
    }
    br.close();

  }

  /**
   * <pre>
   * Generates sugg. and ranks them based on initial cmd.
   * @param trie - The trie.
   * @param word - The word.
   * @param prevWord - The previous word.
   * @return Returns a list of ranked suggestions.
   * </pre>
   */
  public static List<Word> suggGenAndRanker(final Trie<Word> trie,
      final String word, final String prevWord) {
    List<Word> suggs = new ArrayList<Word>();
    List<SuggestionGenInterface> gens = new ArrayList<SuggestionGenInterface>();

    if (prefix) {
      gens.add(new PreFixGen());
    }

    if (led) {
      LEDGen obj = new LEDGen(ledNo);
      gens.add(obj);
    }

    // Generating suggestions
    for (SuggestionGenInterface currGen : gens) {
      List<Word> temp = new ArrayList<Word>();
      temp.addAll(currGen.getSuggestions(trie, word));

      for (Word w : temp) {
        boolean alreadyIn = false;
        for (Word s : suggs) {
          if (s.getStringText().trim()
              .equalsIgnoreCase(w.getStringText().trim())) {
            alreadyIn = true;
          }
        }
        if (!alreadyIn) {
          suggs.add(w);
        }
      }

    }

    // We need to follow special rules for whitespace splitting
    if (whitespace) {
      ArrayList<Word> temp = new ArrayList<Word>();
      temp.addAll(new WhitespaceGen().getSuggestions(trie, word));
      for (int i = 0; i < temp.size() - 1; i += 2) {
        Word join =
            new Word(temp.get(i).getStringText() + " "
                + temp.get(i + 1).getStringText());
        join.setFrequency(temp.get(i).getFrequency());
        join.setAdjacentWords(temp.get(i).getAdjacentWords());
        // Checking for duplicates!
        boolean notThere = true;
        for (Word w : suggs) {
          if (w.getStringText().equalsIgnoreCase(join.getStringText().trim())) {
            // words already there!
            notThere = false;
          }
        }

        if (notThere) {
          suggs.add(join);
        }
      }
    }

    // Edge (default) case
    if (suggs.size() == 0) {
      if (trie.getNodeFromString(word) != null
          && trie.getNodeFromString(word).isWord()) {
        suggs.add(new Word(word));
      }
      return suggs;
    }

    List<Word> ranked = new ArrayList<Word>();

    // Ranking suggestions.
    if (smart) {
      List<RankInterface> rules = new ArrayList<RankInterface>();
      rules.add(new UnigramRank());
      rules.add(new SmartRank());
      rules.add(new AlphabetRank());
      SuggestionRanker ranker = new SuggestionRanker(rules);
      ranked = ranker.rankSuggestions(word, prevWord, suggs, NUM_SUGG);
    } else {
      List<RankInterface> rules = new ArrayList<RankInterface>();
      rules.add(new ExactMatchRank());
      rules.add(new BigramRank());
      rules.add(new UnigramRank());
      rules.add(new AlphabetRank());
      SuggestionRanker ranker = new SuggestionRanker(rules);
      ranked = ranker.rankSuggestions(word, prevWord, suggs, NUM_SUGG);
    }

    return ranked;
  }

  public static String stripPunctuation(final String s) {
    String word = s.toLowerCase().replaceAll("\\P{L}", " ").trim();
    return word;
  }

  /**
   * Interprets and executes initial run command.
   *
   * @param args
   * @return
   */
  @SuppressWarnings("unchecked")
  private static List<String> initialCommandParser(final String[] args) {
    try {
      OptionParser optParser = new OptionParser();
      optParser.accepts("gui", "Launches GUI interface of program!");
      optParser.accepts("prefix", "Activates prefix suggestions.");
      optParser.accepts("led", "Activate Levenshtein edit distance.")
          .withRequiredArg().ofType(Integer.class);
      optParser.accepts("whitespace", "Activate splitting suggestions.");
      optParser.accepts("smart", "Activates my smart ordering!");
      optParser.accepts("h", "show help").forHelp();
      OptionSet options = optParser.parse(args);

      if (options.has("h")) {
        optParser.printHelpOn(System.out);
        System.exit(0);
      }

      if (options.has("gui")) {
        gui = true;
      }

      if (options.has("prefix")) {
        prefix = true;
      }

      if (options.has("led")) {
        led = true;
        if (options.hasArgument("led")) {
          int num = (Integer) options.valueOf("led");
          if (num < 0) {
            System.out.println("ERROR: Invalid arg for LED.");
            System.exit(-1);
          }
          ledNo = num;
        } else {
          System.out.println("ERROR: LED missing int arg.");
        }
      }

      if (options.has("whitespace")) {
        whitespace = true;
      }

      if (options.has("smart")) {
        smart = true;
      }

      List<String> nonOptionArguments =
          (List<String>) options.nonOptionArguments();
      return nonOptionArguments;

    } catch (Exception e) {
      System.out.println("ERROR: Malformed initial command.");
      System.exit(-1);
      return null;
    }
  }

}
