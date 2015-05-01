/**
 * Part of autocorrect testing package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.junit.Test;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * Tests the word data structure for integrity.
 *
 * @author tbhargav
 *
 */
public class WordTest {
  @Test
  /**
   * Ensures that a list of strings
   * is converted into the 'word'
   * data structure correctly!
   */
  public void stringsToWordTest() {
    List<String> text = new ArrayList<String>();
    text.add("the");
    text.add("boat");
    text.add("is");
    text.add("just");
    text.add("a");
    text.add("boat");
    text.add("but");
    text.add("the");
    text.add("river");
    text.add("is");
    text.add("more");
    text.add("than");
    text.add("just");
    text.add("the");
    text.add("river");
    HashMap<String, Word> words = Word.makeWordsFromStrings(text);
    assertTrue(words.get("river").getBigramFreq("the") == 2);
    assertTrue(words.get("boat").getBigramFreq("the") == 1);
    assertTrue(words.get("the").getFrequency() == 3);

  }

  @Test
  /**
   * Checks that each word retains the
   * information that has been given to
   * it (frequency, bigram data, text) and
   * that accessor function calls don't
   * change it; and mutator calls don't
   * corrupt the data.
   */
  public void wordDataIntegrityCheck() {
    Word w = new Word("Tushar");
    w.updateFrequency();
    w.updateAdjWordFreq("the");
    w.updateFrequency();
    w.updateFrequency();
    w.updateFrequency();
    w.updateAdjWordFreq("great");
    w.updateFrequency();
    w.updateFrequency();
    w.updateFrequency();
    w.updateAdjWordFreq("narcissist");
    w.updateFrequency();
    w.updateAdjWordFreq("the");
    assertTrue(w.getFrequency() == 8);
    assertTrue(w.getBigramFreq("the") == 2);
    assertTrue(w.getBigramFreq("great") == 1);
  }

}
