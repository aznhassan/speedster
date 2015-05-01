/**
 * Part of the testing package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import edu.brown.cs.tbhargav.fileparsers.ExtWordsFileParser;

/**
 * Tests file parser against file whose contents are known! Also sees how it
 * would take punctuation into account.
 *
 * @author tbhargav
 *
 */
public class FileParserTest {
  @Test
  /**
   * The file parser reads words into strings,
   * these are compared against the hand computed
   * values.
   * The input file is scattered with punctuation
   * and illegal characters for testing purposes.
   */
  public void readWordsFromFileTest() {
    ExtWordsFileParser fReader = new ExtWordsFileParser("sherlock_corrupt.txt");
    List<String> wordsRead = new ArrayList<String>();
    try {
      wordsRead = fReader.readWords();
    } catch (IOException e) {
      fReader.closeReader();
      e.printStackTrace();
    }

    List<String> preCompAnswers = new ArrayList<String>();
    preCompAnswers.add("dventure");
    preCompAnswers.add("i");
    preCompAnswers.add("a");
    preCompAnswers.add("scandal");
    preCompAnswers.add("in");
    preCompAnswers.add("bohemia");
    preCompAnswers.add("i");
    preCompAnswers.add("to");
    preCompAnswers.add("sherlock");
    preCompAnswers.add("holmes");
    preCompAnswers.add("she");
    preCompAnswers.add("is");
    preCompAnswers.add("always");
    preCompAnswers.add("the");
    preCompAnswers.add("woman");
    preCompAnswers.add("i");
    preCompAnswers.add("have");
    preCompAnswers.add("seldom");
    preCompAnswers.add("heard");
    preCompAnswers.add("him");
    preCompAnswers.add("mention");
    preCompAnswers.add("her");
    preCompAnswers.add("under");
    preCompAnswers.add("any");
    preCompAnswers.add("other");
    preCompAnswers.add("name");
    preCompAnswers.add("it");
    preCompAnswers.add("s");

    for (int i = 0; i < preCompAnswers.size() && i < wordsRead.size(); i++) {
      String s = preCompAnswers.get(i);
      String t = wordsRead.get(i);
      assertTrue(s.equalsIgnoreCase(t));
    }
  }

  @Test
  /**
   * Tests how file reader handles a non-existent
   * file!
   */
  public void tryWordsFromNonExistFile() {
    ExtWordsFileParser fReader = new ExtWordsFileParser(
        "a_figmentofimagination.txt");
    boolean caught = false;

    try {
      fReader.readWords();
    } catch (IOException e) {
      fReader.closeReader();
      caught = true;
    }

    assertTrue(caught);

  }

}
