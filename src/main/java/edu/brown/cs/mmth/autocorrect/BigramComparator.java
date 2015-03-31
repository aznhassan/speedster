/**
 * Part of autocorrect package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.util.Comparator;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * Compares two words based on their bigram probability with respect to 'prev'
 * word.
 *
 * @author tbhargav
 *
 */
final class BigramComparator implements Comparator<Word> {

  private final String prevWord;

  /**
   * Constructor for BigramComp.
   *
   * @param prevWord1
   */
  BigramComparator(final String prevWord1) {
    prevWord = prevWord1;
  }

  @Override
  public int compare(final Word o1, final Word o2) {
    int o1bigram = o1.getBigramFreq(prevWord);
    int o2bigram = o2.getBigramFreq(prevWord);
    if (o1bigram > o2bigram) {
      return -1;
    } else if (o1bigram < o2bigram) {
      return 1;
    }
    return 0;
  }

}
