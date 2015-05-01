/**
 * Part of autocorrect package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import edu.brown.cs.tbhargav.tries.Word;

/**
 * Aggregates all our ranking methods and ranks given suggestions according to
 * order of ranking methods.
 *
 * @author tbhargav
 *
 */
public final class SuggestionRanker {
  private List<RankInterface> rules;

  /**
   * <pre>
   * List of ordered rules to follow while ranking.
   * 
   * @param rulesL - List of RankInterfaces.
   * </pre>
   */
  public SuggestionRanker(final List<RankInterface> rulesL) {
    rules = rulesL;
  }

  /**
   * Accessor method.
   *
   * @return the rules
   */
  public List<RankInterface> getRules() {
    return rules;
  }

  /**
   * Mutator method.
   *
   * @param rulesL
   *          the rules to set
   */
  public void setRules(final List<RankInterface> rulesL) {
    this.rules = rulesL;
  }

  private List<Word> collisionSort(final String word, final String prevWord,
      final int ruleIndex, final List<Word> toSort1) {
    List<Word> rankedWords = new ArrayList<Word>();
    List<Word> tRanks = new ArrayList<Word>();
    RankInterface rule = rules.get(ruleIndex);
    tRanks = rule.rankedSuggestions(word, prevWord, toSort1);

    for (int i = 0; i < tRanks.size() - 1; i++) {
      if (rule.areEqual(tRanks.get(i), tRanks.get(i + 1), prevWord, word)) {
        ArrayList<Word> toSort = new ArrayList<Word>();
        toSort.add(tRanks.get(i));
        int j = i + 1;
        boolean firstPair = true;
        boolean collision = false;
        while (j < tRanks.size() - 1) {
          if (rule.areEqual(tRanks.get(j), tRanks.get(j + 1), prevWord, word)) {
            firstPair = false;
            toSort.add(tRanks.get(j));
            collision = true;
          } else if (collision) {
            toSort.add(tRanks.get(j));
            collision = false;
            break;
          } else {
            break;
          }
          j++;
        }
        if (collision) {
          toSort.add(tRanks.get(j));
        }

        if (firstPair) {
          toSort.add(tRanks.get(i + 1));
        }

        // Updating i over here!
        i += toSort.size() - 1;

        // Calling collision sorter!
        if (ruleIndex + 1 >= rules.size()) {
          rankedWords.addAll(toSort);
        } else {
          rankedWords.addAll(collisionSort(word, prevWord, ruleIndex + 1,
              toSort));
        }

      } else {
        rankedWords.add(tRanks.get(i));
        if (i == tRanks.size() - 1 - 1) {
          rankedWords.add(tRanks.get(i + 1));
        }
      }
    }
    return rankedWords;
  }

  /**
   * <pre>
   * Ranks suggestions provided following the set of rules. (in order of the
   * list).
   * @param word - The word.
   * @param prevWord - The previous word.
   * @param suggestions - The given suggestions.
   * @param numSuggestions - The number of suggestions.
   * @return - Returns a list of ranked suggestions.
   * </pre>
   */
  public List<Word> rankSuggestions(final String word, final String prevWord,
      final Collection<Word> suggestions, final int numSuggestions) {
    ArrayList<Word> rankedWords = new ArrayList<Word>();
    ArrayList<Word> wordsToSort = new ArrayList<Word>();
    wordsToSort.addAll(suggestions);
    if (suggestions.size() <= 1 || rules.size() == 0) {
      return wordsToSort;
    }
    // We iterate through the rules, check for collisions,
    // put the words without collisions into 'ranked'

    RankInterface rule = rules.get(0);
    List<Word> tRanks = new ArrayList<Word>();
    tRanks = rule.rankedSuggestions(word, prevWord, wordsToSort);

    for (int i = 0; i < tRanks.size() - 1; i++) {
      if (rule.areEqual(tRanks.get(i), tRanks.get(i + 1), prevWord, word)) {
        ArrayList<Word> toSort = new ArrayList<Word>();
        toSort.add(tRanks.get(i));
        int j = i + 1;
        boolean firstPair = true;
        boolean collision = false;
        while (j < tRanks.size() - 1) {
          if (rule.areEqual(tRanks.get(j), tRanks.get(j + 1), prevWord, word)) {
            firstPair = false;
            toSort.add(tRanks.get(j));
            collision = true;
          } else if (collision) {
            toSort.add(tRanks.get(j));
            collision = false;
            break;
          } else {
            break;
          }
          j++;
        }
        if (collision) {
          toSort.add(tRanks.get(j));
        }

        if (firstPair) {
          toSort.add(tRanks.get(i + 1));
        }

        // Updating i over here!
        i += toSort.size() - 1;

        // Calling collision sorter!
        if (rules.size() == 1) {
          rankedWords.addAll(toSort);
        } else {
          rankedWords.addAll(collisionSort(word, prevWord, 1, toSort));
        }

      } else {
        rankedWords.add(tRanks.get(i));
        if (i == tRanks.size() - 1 - 1) {
          rankedWords.add(tRanks.get(i + 1));
        }
      }
    }

    ArrayList<Word> answers = new ArrayList<Word>();
    for (int i = 0; i < rankedWords.size() && i < numSuggestions; i++) {
      answers.add(rankedWords.get(i));
    }

    return answers;
  }

}
