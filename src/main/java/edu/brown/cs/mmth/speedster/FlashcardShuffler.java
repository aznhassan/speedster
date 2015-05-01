/**
 * See package-info.java file.
 */
package edu.brown.cs.mmth.speedster;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Determines which flashcard to display next (in session). Uses difficulty,
 * randomness and contextual performance to determine the flashcard to show
 * next. Each object of this class represents one flashcard viewing session.
 *
 * @author tbhargav
 */
public class FlashcardShuffler {

  private final Collection<Flashcard> cards;
  private List<Flashcard> rankedCards;
  private static Map<Integer, FlashcardShuffler> cache = new HashMap<>();
  /**
   * The shuffling relies on the value of this counter. 0 means using the
   * difficulty rank, 1 means random choice and 2 means easier card. Ranks are
   * recomputed after every 3 cards.
   */
  private int techniqueCounter;

  /**
   * Parameterized constructor. Accepts flashcards to shuffle and display in
   * given session.
   *
   * @param lCards
   *          the cards to display in given session.
   */
  public FlashcardShuffler(final Collection<Flashcard> lCards) {
    cards = new ArrayList<>();
    cards.addAll(lCards);
    techniqueCounter = 0;
    rankedCards = new ArrayList<>();
    rankedCards.addAll(cards);
  }

  /**
   * Checks whether cache has FlashcardShuffler object for given session.
   *
   * @param sessionID
   *          the unique identifier of given session.
   * @return boolean true if session number is contained, false otherwise.
   */
  public static boolean hasSession(int sessionID) {
    if (cache.containsKey(sessionID)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets FlashcardShuffler associated with session ID. Returns null if ID not
   * contained.
   *
   * @param sessionID
   *          a unique session identifier.
   * @return FlashcardShuffler linked with session ID.
   */
  public static FlashcardShuffler getSession(int sessionID) {
    return cache.get(sessionID);
  }

  /**
   * Adds a new session to cache.
   *
   * @param sessionID
   *          unique session identifier (must not exist already).
   * @param obj
   *          FlashcardShuffler object linked with ID.
   */
  public static void addSession(int sessionID, FlashcardShuffler obj) {
    cache.put(sessionID, obj);
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
    if (rankedCards.contains(card)) {
      rankedCards.remove(card);
    }
  }

  /**
   * Determines which card will be displayed next based on technique counter
   * value and shuffling logic.
   *
   * @return flashcard object to display next. Null if session is over.
   */
  public Flashcard nextCard() {
    // Session over.
    if (rankedCards.isEmpty() || cards.isEmpty()) {
      return null;
    }
    // We recompute rank every 3 cards.
    if (techniqueCounter % 3 == 0) {
      calcRankOfCards();
      techniqueCounter++;
      // Returns most difficult/urgent card.
      return rankedCards.get(0);
    } else if (techniqueCounter % 3 == 1) {
      techniqueCounter++;
      int random = (int) (Math.random() * (rankedCards.size() - 2) + 1);
      // Displays random card but avoids 'hardest' card if possible.
      if (rankedCards.size() == 1) {
        return rankedCards.get(0);
      }
      return rankedCards.get(random);
    } else {
      // Returns easiest card.
      techniqueCounter++;
      return rankedCards.get(rankedCards.size() - 1);
    }
  }

}
