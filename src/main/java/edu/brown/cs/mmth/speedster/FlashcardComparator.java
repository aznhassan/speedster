/**
 * See package-info.java.
 */
package edu.brown.cs.mmth.speedster;

import java.io.Serializable;
import java.util.Comparator;

/**
 * Sorts flashcards by rank.
 *
 * @author tbhargav
 *
 */
public class
FlashcardComparator implements Comparator<Flashcard>, Serializable {

  /**
   * Serial id.
   */
  private static final long serialVersionUID = 4057440351286748365L;

  @Override
  public int compare(Flashcard o1, Flashcard o2) {
    if (o1.getRank() > o2.getRank()) {
      return -1;
    } else if (o1.getRank() < o2.getRank()) {
      return 1;
    }
    return 0;
  }

}
