/**
 * Part of autocorrect package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import edu.brown.cs.tbhargav.fileparsers.ExtWordsFileParser;
import edu.brown.cs.tbhargav.tries.Word;

/**
 * This is my smart ranking algorithm! For my smart ranking algorithm I am
 * comparing the suggested words with the 100 most used words in the English
 * language (these 100 words make up 50% of all English texts). The words are
 * from the Oxford English Corpus project (which consists of over a billion
 * words; the study spanned a wide range of sources: newspapers, magazines,
 * emails etc.) If any of the suggested words are part of the 100 most common
 * words they're sent to the top of the ranking (by probabilistic considerations
 * these words are by far the best auto-correct suggestion).
 *
 * @author tbhargav
 *
 */
public final class SmartRank implements RankInterface {

  @Override
  public List<Word> rankedSuggestions(final String word, final String prevWord,
      final Collection<Word> words) {
    ArrayList<Word> rankedWords = new ArrayList<Word>();
    ArrayList<Word> suggestions = new ArrayList<Word>();
    suggestions.addAll(words);
    ExtWordsFileParser fileReader =
        new ExtWordsFileParser("smartRankCorpus.txt");
    ArrayList<String> commonWordsText = new ArrayList<String>();
    try {
      commonWordsText = fileReader.readWords();
    } catch (IOException e) {
      fileReader.closeReader();
    }
    HashMap<String, Word> commonWords =
        Word.makeWordsFromStrings(commonWordsText);

    for (Word w : suggestions) {
      if (commonWords.containsKey(w.getStringText())) {
        rankedWords.add(w);
      }
    }

    if (rankedWords.size() > 0) {
      suggestions.removeAll(rankedWords);
      rankedWords.addAll(suggestions);
    }

    assert (rankedWords.size() == words.size());

    return rankedWords;
  }

  @Override
  public boolean areEqual(final Word o1, final Word o2, final String prevWord,
      final String word) {
    ExtWordsFileParser fileReader =
        new ExtWordsFileParser("smartRankCorpus.txt");
    ArrayList<String> commonWordsText = new ArrayList<String>();
    try {
      commonWordsText = fileReader.readWords();
    } catch (IOException e) {
      fileReader.closeReader();
    }
    HashMap<String, Word> commonWords =
        Word.makeWordsFromStrings(commonWordsText);
    if (commonWords.containsKey(o1.getStringText())
        && commonWords.containsKey(o2.getStringText())) {
      return true;
    }

    if (commonWords.containsKey(o1.getStringText())) {
      return false;
    } else if (commonWords.containsKey(o2.getStringText())) {
      return false;
    }

    return true;
  }

}
