/**
 * Part of the tries project package.
 */
package edu.brown.cs.tbhargav.tries;

import java.util.HashMap;
import java.util.List;

/**
 * This class stores a 'word' and associated data.
 *
 * @author tbhargav
 */

public final class Word implements TrieStorable {

  // Instance variables
  private String wordText;
  private int frequency;
  /**
   * Stores the words before any occurrence of curr word and the no. of times
   * those words occurred before this one.
   *
   * @param String
   *          -- that is the before word text
   * @param Integer
   *          -- no. of times before_word came up.
   */
  private HashMap<String, Integer> adjacentWords;

  /**
   * Unparameterized constructor, that initializes to default values.
   */
  public Word() {
    wordText = null;
    frequency = 0;
    adjacentWords = new HashMap<String, Integer>();
  }

  /**
   * Parameterized constructor for Word data structure.
   *
   * @param wordTextL
   */
  public Word(final String wordTextL) {
    wordText = wordTextL;
    frequency = 0;
    adjacentWords = new HashMap<String, Integer>();
  }

  /**
   * Converts a series of words into our 'word' data model.
   *
   * @param wordText
   *          (in order list of words).
   * @return list of 'Word' objects
   */
  public static HashMap<String, Word> makeWordsFromStrings(
      final List<String> wordText) {
    HashMap<String, Word> words = new HashMap<String, Word>();

    for (int i = 0; i < wordText.size(); i++) {
      String s = wordText.get(i);
      if (s.isEmpty()) {
        continue;
      }

      if (!words.containsKey(s)) {
        words.put(s, new Word(s));
      }

      // Updating word's frequency.
      Word w = words.get(s);
      w.updateFrequency();
      if (i >= 1) {
        // Updating before word frequency.
        w.updateAdjWordFreq(wordText.get(i - 1));
      }
    }

    return words;
  }

  /**
   * Accessor for adjacent words hashmap.
   *
   * @return the adjacentWords
   */
  public HashMap<String, Integer> getAdjacentWords() {
    return adjacentWords;
  }

  @Override
  /**
   * Accessor for word text.
   * @return the wordText
   */
  public String getStringText() {
    return wordText;
  }

  /**
   * Mutator for word text.
   *
   * @param wordText1
   *          the wordText to set
   */
  public void setWordText(final String wordText1) {
    this.wordText = wordText1;
  }

  /**
   * Mutator method.
   *
   * @param frequency1
   *          the frequency to set
   */
  public void setFrequency(final int frequency1) {
    this.frequency = frequency1;
  }

  /**
   * Mutator method.
   *
   * @param adjacentWords1
   *          the adjacentWords to set
   */
  public void setAdjacentWords(final HashMap<String, Integer> adjacentWords1) {
    this.adjacentWords = adjacentWords1;
  }

  /**
   * Accessor for frequency.
   *
   * @return the frequency
   */
  public int getFrequency() {
    return frequency;
  }

  /**
   * Mutator for frequency.
   */
  public void updateFrequency() {
    this.frequency += 1;
  }

  /**
   * Returns the bigram freq. of curr word w.r.t to prevWord.
   *
   * @param prevWord
   * @return bigram freq int.
   */
  public int getBigramFreq(final String prevWord) {
    if (prevWord.equalsIgnoreCase("")) {
      return 0;
    }
    if (adjacentWords.containsKey(prevWord)) {
      return adjacentWords.get(prevWord);
    } else {
      return 0;
    }
  }

  /**
   * Updates a given 'before' words frequency. That is how many times it
   * appeared before current word.
   *
   * @param wordText1
   */
  public void updateAdjWordFreq(final String wordText1) {
    if (adjacentWords.containsKey(wordText1.toLowerCase())) {
      int prevFreq = adjacentWords.get(wordText1);
      prevFreq += 1;
      adjacentWords.replace(wordText1, prevFreq);
    } else {
      adjacentWords.put(wordText1, 1);
    }
  }

}
