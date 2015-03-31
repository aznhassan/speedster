/**
 * Part of autocorrect pckg.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.util.List;

import edu.brown.cs.tbhargav.tries.Trie;
import edu.brown.cs.tbhargav.tries.Word;

/**
 * Interface to enforce certain minimums on suggestion gen. mechanisms.
 *
 * @author tbhargav
 *
 */
public interface SuggestionGenInterface {
  /**
   * Gets the suggestions based on generation mechanism.
   *
   * @param trie
   * @param typedWord
   * @return list of suggested words
   */
  List<Word> getSuggestions(Trie<Word> trie, String typedWord);
}
