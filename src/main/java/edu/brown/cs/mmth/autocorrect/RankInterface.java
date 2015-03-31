/**
 * Part of the autocorrect package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.util.Collection;
import java.util.List;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * This interface provides a contract that all ranking algorithms should adhere
 * to. This makes it easy to change suggestion ranking techniques.
 *
 * @author tbhargav
 *
 */
public interface RankInterface {
  /**
   * Takes in a list of 'Word's and returns them in order of their ranking
   * (according to criteria unique to the specific algorithm). (List because
   * order matters).
   *
   * @param word
   * @param prevWord
   * @param words
   * @return top suggestions
   */
  List<Word> rankedSuggestions(String word, String prevWord,
      Collection<Word> words);

  /**
   * Checks whether given words are equal (in accordance with specific ranking)
   * or not.
   *
   * @param o1
   * @param o2
   * @param prevWord
   * @return true or false
   */
  boolean areEqual(Word o1, Word o2, String prevWord, String word);
}
