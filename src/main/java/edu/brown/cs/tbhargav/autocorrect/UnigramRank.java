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
 * Ranks words according to the no. of times they occur in the corpus.
 *
 * @author tbhargav
 *
 */
public final class UnigramRank implements RankInterface {

  @Override
  public List<Word> rankedSuggestions(final String word, final String prevWord,
      final Collection<Word> words) {
    ArrayList<Word> sortedWords = new ArrayList<Word>();
    sortedWords.addAll(words);
    Collections.sort(sortedWords, new UnigramComparator());
    assert sortedWords.size() == words.size();
    return sortedWords;
  }

  @Override
  public boolean areEqual(final Word o1, final Word o2, final String prevWord,
      final String word) {
    UnigramComparator comp = new UnigramComparator();
    if (comp.compare(o1, o2) == 0) {
      return true;
    }
    return false;
  }

}
