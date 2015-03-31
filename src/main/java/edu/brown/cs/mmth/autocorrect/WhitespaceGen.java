/**
 * Part of autocorrect package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.util.ArrayList;
import java.util.List;

import edu.brown.cs.tbhargav.tries.Trie;
import edu.brown.cs.tbhargav.tries.TrieNode;
import edu.brown.cs.tbhargav.tries.Word;

/**
 * Generates suggestions by splitting on whitespace.
 *
 * @author tbhargav
 *
 */
public final class WhitespaceGen implements SuggestionGenInterface {

  @Override
  public List<Word> getSuggestions(final Trie<Word> trie, final String word) {
    ArrayList<Word> wordPairs = new ArrayList<Word>();

    for (int i = 1; i < word.length(); i++) {
      String[] possibleWords = new String[2];

      possibleWords[0] = word.substring(0, i).toLowerCase();
      possibleWords[1] = word.substring(i, word.length()).toLowerCase();

      TrieNode<Word> word1 = trie.getNodeFromString(possibleWords[0]);
      TrieNode<Word> word2 = trie.getNodeFromString(possibleWords[1]);
      if (word1 != null && word2 != null) {
        if (word1.isWord() && word2.isWord()) {
          wordPairs.add(word1.getStoredValue());
          wordPairs.add(word2.getStoredValue());
        }
      }
    }

    // There should be even no. of words
    // because each consecutive word
    // will be the suggestion presented.
    if (wordPairs.size() % 2 != 0) {
      return null;
    }
    return wordPairs;
  }

}
