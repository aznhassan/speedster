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
   * <pre>
   * Gets the suggestions based on generation mechanism.
   *
   * @param trie - The trie of words.
   * @param typedWord - The word that was typed.
   * @return list of suggested words.
   * </pre>
   */
  List<Word> getSuggestions(Trie<Word> trie, String typedWord);
}
