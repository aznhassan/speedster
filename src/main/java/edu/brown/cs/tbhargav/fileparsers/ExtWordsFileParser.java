/**
 * In file parsers package.
 */
package edu.brown.cs.tbhargav.fileparsers;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

/**
 * This class accepts a file, strips all punctuation and reads the stored text
 * into a 'word' data format. (ext - extreme file parser).
 *
 * @author tbhargav
 *
 */
public final class ExtWordsFileParser {

  // Instance variables.
  private String fileName;
  private BufferedReader br;

  /**
   * Constructor, stores file to parse.
   *
   * @param fileToRead
   *          - The file to read.
   */
  public ExtWordsFileParser(final String fileToRead) {
    fileName = fileToRead;
    br = null;
  }

  /**
   * Mutator method.
   *
   * @param fileName1
   *          the fileName to set
   */
  public void setFileName(final String fileName1) {
    this.fileName = fileName1;
  }

  /**
   * Closes the buffered reader. Only to be called when handling IOException as
   * readWords on normal execution, closes the BufferedReader.
   */
  public void closeReader() {
    if (br != null) {
      try {
        br.close();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  /**
   * Reads given file and returns list of words, lowercase, all punctuation
   * stripped.
   *
   * @return a list that stores the words
   * @throws IOException
   *           (no matter what the exception handling please also invoke
   *           closeReader)
   */
  public ArrayList<String> readWords() throws IOException {
    FileReader fileReader = new FileReader(fileName);
    br = new BufferedReader(fileReader);
    String lineInput = br.readLine();
    ArrayList<String> words = new ArrayList<String>();

    while (lineInput != null) {
      String[] wordsInLine = lineInput.split(" ");
      for (String w : wordsInLine) {
        // Replaces all characters that are not letters
        // with spaces.
        String word = w.toLowerCase().replaceAll("\\P{L}", " ").trim();
        String[] smallerArr = word.split(" ");
        for (String sw : smallerArr) {
          if (!sw.trim().equalsIgnoreCase("")) {
            words.add(sw.trim());
          }
        }
      }
      lineInput = br.readLine();
    }

    br.close();
    return words;
  }

}
