/**
 * See package-info.java file.
 */
package edu.brown.cs.mmth.speedster;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Determines which flashcard to display next (in session). Uses difficulty,
 * randomness and contextual performance to determine the flashcard to show
 * next. Each object of this class represents one flashcard viewing session.
 * @author tbhargav
 */
public class FlashcardShuffler {

  private final Collection<Flashcard> cards;
  private List<Flashcard> rankedCards;
  /**
   * The shuffling relies on the value of this counter. 0 means using the
   * difficulty rank, 1 means random choice and 2 means easier card. Ranks are
   * recomputed after every 3 cards.
   */
  private final int techniqueCounter;

  /**
   * Parameterized constructor. Accepts flashcards to shuffle and display in
   * given session.
   * @param lCards
   *          the cards to display in given session.
   */
  public FlashcardShuffler(final Collection<Flashcard> lCards) {
    cards = lCards;
    techniqueCounter = 0;
    rankedCards = new ArrayList<>();
  }

  private void calcRankOfCards() {
    List<Flashcard> lRankedCards = new ArrayList<>();
    lRankedCards.addAll(cards);
    // Sorting cards by rank.
    Collections.sort(lRankedCards, new FlashcardComparator());
    rankedCards = lRankedCards;
  }

  /**
   * Marks a card as correct for the session and prevents it from being
   * redisplayed.
   *
   * @param card
   *          that user got right in session.
   */
  public void markCardCorrect(final Flashcard card) {
    if (cards.contains(card)) {
      cards.remove(card);
    }
  }

  /**
   * Determines which card will be displayed next based on technique counter
   * value and shuffling logic.
   * @return flashcard object to display next. Null if session is over.
   */
  public Flashcard nextCard() {
    // Session over.
    if (rankedCards.isEmpty()) {
      return null;
    }
    // We recompute rank every 3 cards.
    if (techniqueCounter % 3 == 0) {
      calcRankOfCards();
      // Returns most difficult/urgent card.
      return rankedCards.get(0);
    } else if (techniqueCounter % 3 == 1) {
      int random = (int) (Math.random() * (rankedCards.size() - 1));
      // Displays random card.
      return rankedCards.get(random);
    } else {
      // Returns easiest card.
      rankedCards.get(rankedCards.size() - 1);
    }
    return null;
  }

}
