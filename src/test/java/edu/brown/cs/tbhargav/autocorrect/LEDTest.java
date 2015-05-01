/**
 * Part of the autocorrect testing pckg.
 */
package edu.brown.cs.tbhargav.autocorrect;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import edu.brown.cs.tbhargav.autocorrect.LEDGen;
import edu.brown.cs.tbhargav.tries.Trie;
import edu.brown.cs.tbhargav.tries.Word;

/**
 * Tests the LED algorithm for correctness by comparing it with hand computed
 * examples.
 *
 * @author tbhargav
 *
 */
public class LEDTest {
  @Test
  /**
   * Ibid.
   */
  public void testEditDistance() {
    assertTrue(LEDGen.computeEditDist("", "") == 0);
    assertTrue(LEDGen.computeEditDist("", "a") == 1);
    assertTrue(LEDGen.computeEditDist(" ", "a") == 1);
    assertTrue(LEDGen.computeEditDist("kitten", "sitting") == 3);
    assertTrue(LEDGen.computeEditDist("sitting", "kitten") == 3);
    assertTrue(LEDGen.computeEditDist("Saturday", "sunday") == 3);
    assertTrue(LEDGen.computeEditDist("Tushar", "Tushar") == 0);
  }

  @Test
  /**
   * Tests the output of words, and whether
   * words that are within the appropriate
   * LED distance are included.
   */
  public void testLEDGenOutput() {
    LEDGen gen = new LEDGen(1 + 1 + 1);
    Trie<Word> trie = new Trie<Word>();
    List<Word> words = new ArrayList<Word>();
    words.add(new Word("kitten"));
    words.add(new Word("sitting"));
    // Few nonsensical words for more fine grain dist testing
    words.add(new Word("sitted"));
    words.add(new Word("ballad"));
    words.add(new Word("I"));
    trie.addValues(words);
    // We now perform the LED search and
    // see whether we retrieve the correct words.
    List<Word> genWords = gen.getSuggestions(trie, "kitten");

    // Each of these values is associated with
    // a word that either should or should not
    // be present in generated words.
    boolean sittingF = false;
    boolean sittedF = false;
    boolean kittenF = false;
    boolean iF = false;
    boolean balladF = false;

    for (Word w : genWords) {
      if (w.getStringText().equals("kitten")) {
        kittenF = true;
      } else if (w.getStringText().equals("sitting")) {
        sittingF = true;
      } else if (w.getStringText().equals("sitted")) {
        sittedF = true;
      } else if (w.getStringText().equalsIgnoreCase("I")) {
        iF = true;
      } else if (w.getStringText().equals("ballad")) {
        balladF = true;
      }
    }
    assertTrue(sittingF);
    assertTrue(kittenF);
    assertTrue(sittedF);
    assertTrue(!iF);
    assertTrue(!balladF);
  }

}
