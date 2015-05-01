/**
 * Part of autocorrect package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.io.Serializable;
import java.util.Comparator;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * Helps sorting words according to their unigram freq.
 *
 * @author tbhargav
 *
 */
final class UnigramComparator implements Comparator<Word>, Serializable {

  /**
   * Serial ID.
   */
  private static final long serialVersionUID = -3449705456913677293L;

  @Override
  public int compare(final Word o1, final Word o2) {
    int o1Freq = o1.getFrequency();
    int o2Freq = o2.getFrequency();
    if (o1Freq > o2Freq) {
      return -1;
    } else if (o1Freq < o2Freq) {
      return 1;
    }
    return 0;
  }

}
