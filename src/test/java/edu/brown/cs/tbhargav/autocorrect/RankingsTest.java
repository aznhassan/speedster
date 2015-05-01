/**
 * Part of the autocorrect tests.
 */
package edu.brown.cs.tbhargav.autocorrect;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.junit.Test;

import edu.brown.cs.tbhargav.autocorrect.AlphabetRank;
import edu.brown.cs.tbhargav.autocorrect.BigramRank;
import edu.brown.cs.tbhargav.autocorrect.ExactMatchRank;
import edu.brown.cs.tbhargav.autocorrect.PreFixGen;
import edu.brown.cs.tbhargav.autocorrect.RankInterface;
import edu.brown.cs.tbhargav.autocorrect.SmartRank;
import edu.brown.cs.tbhargav.autocorrect.SuggestionRanker;
import edu.brown.cs.tbhargav.autocorrect.UnigramRank;
import edu.brown.cs.tbhargav.fileparsers.ExtWordsFileParser;
import edu.brown.cs.tbhargav.tries.Trie;
import edu.brown.cs.tbhargav.tries.Word;

/**
 * Tests all our ranking methods, including the ranker aggregating method.
 *
 * @author tbhargav
 *
 */
public class RankingsTest {

  @Test
  /**
   * Tests my exact match ranking method
   * exhaustively by feeding in the exact
   * word and making sure that is the first
   * output (with other rules present). A
   * form of a testing oracle.
   */
  public void exactMatchTest() {
    ExtWordsFileParser fileReader = new ExtWordsFileParser("sherlock.txt");
    ArrayList<String> textWords = new ArrayList<String>();
    try {
      textWords = fileReader.readWords();
    } catch (IOException e) {
      fileReader.closeReader();
      e.printStackTrace();
    }
    HashMap<String, Word> words = Word.makeWordsFromStrings(textWords);
    ArrayList<RankInterface> rules = new ArrayList<RankInterface>();
    rules.add(new ExactMatchRank());
    rules.add(new UnigramRank());
    SuggestionRanker ranker = new SuggestionRanker(rules);
    Trie<Word> trie = new Trie<Word>();
    trie.addValues(words.values());

    for (Word w : words.values()) {
      ArrayList<Word> suggs = (ArrayList<Word>) new PreFixGen().getSuggestions(
          trie, w.getStringText());

      List<Word> rankedWords = ranker.rankSuggestions(w.getStringText(), "",
          suggs, 4);

      assertTrue(rankedWords.get(0).getStringText()
          .equalsIgnoreCase(w.getStringText()));
    }
  }

  @Test
  /**
   * Tests the alphabet ranking by
   * comparing it against hand computed
   * example. It is not too exhaustive
   * as the alphabet ranker uses Java's
   * implementation (i.e. it is a thin wrapper),
   * which is hopefully correct  :)
   */
  public void alphabetRanker() {
    ArrayList<Word> alphabetWords = new ArrayList<Word>();
    alphabetWords.add(new Word("zagur"));
    alphabetWords.add(new Word("always"));
    alphabetWords.add(new Word("aargh"));
    // #narcissism
    alphabetWords.add(new Word("tushar"));
    alphabetWords.add(new Word("beauty"));
    alphabetWords.add(new Word("aol"));
    alphabetWords.add(new Word("you"));

    ArrayList<RankInterface> rules = new ArrayList<RankInterface>();
    rules.add(new AlphabetRank());
    SuggestionRanker ranker = new SuggestionRanker(rules);
    List<Word> rankedWords = ranker.rankSuggestions("aol", " ", alphabetWords,
        7);
    assertTrue(rankedWords.get(0).getStringText().equalsIgnoreCase("aargh"));
    assertTrue(rankedWords.get(1).getStringText().equalsIgnoreCase("always"));
    assertTrue(rankedWords.get(1 + 1).getStringText().equalsIgnoreCase("aol"));
    assertTrue(rankedWords.get(1 + 1 + 1).getStringText()
        .equalsIgnoreCase("beauty"));
    assertTrue(rankedWords.get(1 + 1 + 1 + 1).getStringText()
        .equalsIgnoreCase("tushar"));
  }

  @Test
  /**
   * Checks unigram ranking by comparing
   * word in a file whose word frequency
   * is known!
   */
  public void unigramRankerTest() {
    ExtWordsFileParser fileReader = new ExtWordsFileParser("unigram_test.txt");
    ArrayList<String> textWords = new ArrayList<String>();
    try {
      textWords = fileReader.readWords();
    } catch (IOException e) {
      fileReader.closeReader();
      e.printStackTrace();
    }
    HashMap<String, Word> words = Word.makeWordsFromStrings(textWords);
    List<Word> ranked = new UnigramRank().rankedSuggestions(" ", " ",
        words.values());

    assertTrue(ranked.get(0).getStringText().equalsIgnoreCase("computer"));
    assertTrue(ranked.get(1).getStringText().equalsIgnoreCase("science"));
    assertTrue(ranked.get(1 + 1).getStringText().equalsIgnoreCase("joys"));
  }

  @Test
  /**
   * Tests whether the bigram ranker is
   * working correctly!
   */
  public void bigramRankerTest() {
    ExtWordsFileParser fReader = new ExtWordsFileParser("bigram_test.txt");
    ArrayList<String> textWords = new ArrayList<String>();
    try {
      textWords = fReader.readWords();
    } catch (IOException e) {
      fReader.closeReader();
      e.printStackTrace();
    }
    HashMap<String, Word> words = Word.makeWordsFromStrings(textWords);
    List<Word> rankedWords = new BigramRank().rankedSuggestions("", "is",
        words.values());
    assertTrue(rankedWords.get(0).getStringText().equals("hard"));
    assertTrue(rankedWords.get(0).getBigramFreq("is") == 1 + 1 + 1 + 1 + 1 + 1);
    assertTrue(rankedWords.get(1).getBigramFreq("is") == 1 + 1 + 1 + 1 + 1);
    assertTrue(rankedWords.get(1 + 1).getBigramFreq("is") == 1 + 1 + 1 + 1 + 1);
    assertTrue(rankedWords.get(1 + 1 + 1).getBigramFreq("is") == 1);
  }

  @Test
  /**
   * Checks that when two words are
   * ranked equally, the suggestion ranker is
   * able to use the next set of rules!
   */
  public void collisionRankerTest() {
    ExtWordsFileParser fReader = new ExtWordsFileParser("bigram_test.txt");
    ArrayList<String> textWords = new ArrayList<String>();
    try {
      textWords = fReader.readWords();
    } catch (IOException e) {
      fReader.closeReader();
      e.printStackTrace();
    }
    HashMap<String, Word> words = Word.makeWordsFromStrings(textWords);
    List<RankInterface> rules = new ArrayList<RankInterface>();
    rules.add(new ExactMatchRank());
    rules.add(new BigramRank());
    rules.add(new UnigramRank());
    rules.add(new AlphabetRank());
    SuggestionRanker ranker = new SuggestionRanker(rules);
    List<Word> ranked = ranker.rankSuggestions("Tushar", "is", words.values(),
        1 + 1 + 1 + 1 + 1);

    assertTrue(ranked.get(0).getStringText().equalsIgnoreCase("Tushar"));
    assertTrue(ranked.get(1).getStringText().equalsIgnoreCase("hard"));
    assertTrue(ranked.get(1 + 1).getStringText().equalsIgnoreCase("very"));
    assertTrue(ranked.get(1 + 1 + 1).getStringText().equalsIgnoreCase("crazy"));
    assertTrue(ranked.get(1 + 1 + 1 + 1).getStringText()
        .equalsIgnoreCase("all"));

  }

  @Test
  /**
   * Checks whether ranking rules hold, despite
   * several ties!
   */
  public void extendedCollisionCheck() {
    ExtWordsFileParser fReader = new ExtWordsFileParser(
        "ext_collision_test.txt");
    ArrayList<String> textWords = new ArrayList<String>();
    try {
      textWords = fReader.readWords();
    } catch (IOException e) {
      fReader.closeReader();
      e.printStackTrace();
    }
    HashMap<String, Word> words = Word.makeWordsFromStrings(textWords);
    List<RankInterface> rules = new ArrayList<RankInterface>();
    rules.add(new ExactMatchRank());
    rules.add(new BigramRank());
    rules.add(new UnigramRank());
    rules.add(new AlphabetRank());
    SuggestionRanker ranker = new SuggestionRanker(rules);
    List<Word> ranked = ranker.rankSuggestions("song", "a", words.values(), 6);
    assertTrue(ranked.get(0).getStringText().equals("song"));
    assertTrue(ranked.get(1).getStringText().equals("great"));
    assertTrue(ranked.get(1 + 1).getStringText().equals("good"));
    assertTrue(ranked.get(1 + 1 + 1).getStringText().equals("chance"));
    assertTrue(ranked.get(1 + 1 + 1 + 1).getStringText().equals("cat"));
    assertTrue(ranked.get(1 + 1 + 1 + 1 + 1).getStringText().equals("rat"));
  }

  @Test
  /**
   * Checks my smart ranking method +
   * a pre-existing ranking rule,
   * using a file, whose values are known.
   */
  public void smartRankCombinedTest() {
    ExtWordsFileParser fReader = new ExtWordsFileParser("sherlock.txt");
    ArrayList<String> textWords = new ArrayList<String>();
    try {
      textWords = fReader.readWords();
    } catch (IOException e) {
      fReader.closeReader();
      e.printStackTrace();
    }
    HashMap<String, Word> words = Word.makeWordsFromStrings(textWords);
    List<RankInterface> rules = new ArrayList<RankInterface>();
    rules.add(new SmartRank());
    rules.add(new UnigramRank());
    SuggestionRanker ranker = new SuggestionRanker(rules);
    List<Word> rankedAns = ranker.rankSuggestions(" ", " ", words.values(), 4);
    assertTrue(rankedAns.get(0).getStringText().equalsIgnoreCase("the"));
    assertTrue(rankedAns.get(1).getStringText().equalsIgnoreCase("i"));
    assertTrue(rankedAns.get(1 + 1).getStringText().equalsIgnoreCase("and"));

  }

}
