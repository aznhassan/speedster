/**
 *
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.util.ArrayList;
import java.util.List;

import edu.brown.cs.tbhargav.tries.Trie;
import edu.brown.cs.tbhargav.tries.TrieNode;
import edu.brown.cs.tbhargav.tries.Word;

/**
 * This class uses LED to return the edit distance b/w two words.
 *
 * @author tbhargav
 *
 */
public final class LEDGen implements SuggestionGenInterface {

  /**
   * Modifying this value allows you to run the LED algorithm to find words with
   * varying edit distances.
   */
  private static int ledDist;

  public LEDGen(final int ledDist1) {
    ledDist = ledDist1;
  }

  /**
   * Takes in two strings and returns their edit distance.
   *
   * @param word1
   * @param word2
   * @return LED b/w word1 & word2
   */
  public static int computeEditDist(final String word1, final String word2) {
    int[][] ledMatrix = new int[word1.length() + 1][word2.length() + 1];

    char[] a = word1.toLowerCase().toCharArray();
    char[] b = word2.toLowerCase().toCharArray();

    // Base case/edge values.
    for (int i = 0; i < word1.length() + 1; i++) {
      ledMatrix[i][0] = i;
    }
    for (int j = 0; j < word2.length() + 1; j++) {
      ledMatrix[0][j] = j;
    }

    // Constructing the edit dist. matrix
    for (int i = 1; i < word1.length() + 1; i++) {
      for (int j = 1; j < word2.length() + 1; j++) {
        if (a[i - 1] == b[j - 1]) {
          ledMatrix[i][j] = ledMatrix[i - 1][j - 1];
        } else {
          int minPrev = Math.min(ledMatrix[i - 1][j - 1],
                  Math.min(ledMatrix[i][j - 1], ledMatrix[i - 1][j]));
          ledMatrix[i][j] = 1 + minPrev;
        }
      }
    }
    return ledMatrix[word1.length()][word2.length()];
  }

  /**
   * Accessor method.
   *
   * @return the ledDist
   */
  static int getLedDist() {
    return ledDist;
  }

  @Override
  public List<Word> getSuggestions(final Trie<Word> trie, final String word) {

    assert (ledDist >= 0);

    if (ledDist < 0) {
      throw new IllegalArgumentException();
    }

    if (ledDist == 0) {
      return new ArrayList<Word>();
    }

    // The smallest a word can be and still
    // have an edit dist within range.
    int lowerLimit = word.length() - ledDist - 1;
    int upperLimit = word.length() + ledDist + 1;
    return recursiveLEDTrieNav(trie.getRoot(), lowerLimit, upperLimit, word);
  }

  /**
   * Recursive helper method to generate suggestion, limits based on LED DIST.
   *
   * @param root
   * @param lower
   * @param upper
   * @param word
   * @return
   */
  private List<Word> recursiveLEDTrieNav(final TrieNode<Word> root,
          final int lower, final int upper, final String word) {
    ArrayList<Word> wordsWithinDist = new ArrayList<Word>();
    if ((root.isWord()) && (root.getCurrText().length() > lower)
            && (root.getCurrText().length() < upper)) {
      if (computeEditDist(root.getCurrText(), word) <= ledDist) {
        wordsWithinDist.add(root.getStoredValue());
      }
    }

    for (TrieNode<Word> curr : root.getChildrenNodes()) {
      wordsWithinDist.addAll(recursiveLEDTrieNav(curr, lower, upper, word));
    }

    return wordsWithinDist;
  }

}
