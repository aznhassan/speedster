/**
 *
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * Ranks words on their bigram probability.
 *
 * @author tbhargav
 *
 */
public final class BigramRank implements RankInterface {

  @Override
  public List<Word> rankedSuggestions(final String word, final String prevWord,
          final Collection<Word> words) {
    ArrayList<Word> wordsL = new ArrayList<Word>();
    wordsL.addAll(words);
    Collections.sort(wordsL, new BigramComparator(prevWord));
    return wordsL;
  }

  @Override
  public boolean areEqual(final Word o1, final Word o2, final String prevWord,
          final String word) {
    BigramComparator comp = new BigramComparator(prevWord);
    if (comp.compare(o1, o2) == 0) {
      return true;
    }
    return false;
  }

}
