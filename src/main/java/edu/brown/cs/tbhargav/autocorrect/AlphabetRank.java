/**
 * Part of autocorrect package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * Ranks words alphabetically.
 *
 * @author tbhargav
 *
 */
public final class AlphabetRank implements RankInterface {
  @Override
  public List<Word> rankedSuggestions(final String word, final String prevWord,
          final Collection<Word> words) {
    ArrayList<Word> sortedWords = new ArrayList<Word>();
    sortedWords.addAll(words);
    Collections.sort(sortedWords, new AlphabetComparator());
    assert (sortedWords.size() == words.size());
    return sortedWords;
  }

  @Override
  public boolean areEqual(final Word o1, final Word o2, final String prevWord,
          final String word) {
    AlphabetComparator comp = new AlphabetComparator();
    if (comp.compare(o1, o2) == 0) {
      return true;
    }
    return false;
  }

}
