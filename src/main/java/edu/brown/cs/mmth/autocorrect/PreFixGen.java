/**
 * Part of the autocorrect pacakge.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.util.ArrayList;
import java.util.List;

import edu.brown.cs.tbhargav.tries.Trie;
import edu.brown.cs.tbhargav.tries.Word;

/**
 * Generates suggestions using prefix matching.
 *
 * @author tbhargav
 *
 */
public final class PreFixGen implements SuggestionGenInterface {

  @Override
  public List<Word> getSuggestions(final Trie<Word> trie, final String word) {
    ArrayList<Word> words = trie.wordsBasedOnPrefix(word);
    return words;
  }

}
