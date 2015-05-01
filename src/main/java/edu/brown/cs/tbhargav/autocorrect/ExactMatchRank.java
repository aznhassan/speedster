/**
 * Part of autocorrect package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * Ranks a word only if it is an 'exact' match.
 *
 * @author tbhargav
 *
 */
public final class ExactMatchRank implements RankInterface {

  @Override
  public List<Word> rankedSuggestions(final String word, final String prevWord,
      final Collection<Word> words) {
    List<Word> wordsCopy = new ArrayList<Word>();
    wordsCopy.addAll(words);
    for (Word w : words) {
      if (w.getStringText().equalsIgnoreCase(word)) {
        ArrayList<Word> answer = new ArrayList<Word>();
        answer.add(w);
        wordsCopy.remove(w);
        answer.addAll(wordsCopy);
        return answer;
      }
    }
    ArrayList<Word> nothingChanged = new ArrayList<Word>();
    nothingChanged.addAll(wordsCopy);

    assert nothingChanged.size() == words.size();

    return nothingChanged;
  }

  @Override
  public boolean areEqual(final Word o1, final Word o2, final String prevWord,
      final String word) {
    if (o1.getStringText().equalsIgnoreCase(word)) {
      if (o2.getStringText().equalsIgnoreCase(word)) {
        return true;
      }
      return false;
    }
    return true;
  }

}
