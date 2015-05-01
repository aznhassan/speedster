/**
 * Part of autocorrect package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.io.Serializable;
import java.util.Comparator;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * Compares 'Word's alphabetically.
 *
 * @author tbhargav
 *
 */
final class AlphabetComparator implements Comparator<Word>, Serializable {

  /**
   * Serial ID.
   */
  private static final long serialVersionUID = 8159178490157491114L;

  @Override
  public int compare(final Word o1, final Word o2) {
    String o1Txt = o1.getStringText();
    String o2Txt = o2.getStringText();
    return o1Txt.compareTo(o2Txt);
  }

}
