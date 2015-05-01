/**
 * Part of the tests package.
 */
package edu.brown.cs.tbhargav.autocorrect;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import org.junit.Test;

import edu.brown.cs.tbhargav.fileparsers.ExtWordsFileParser;
import edu.brown.cs.tbhargav.tries.Trie;
import edu.brown.cs.tbhargav.tries.TrieNode;
import edu.brown.cs.tbhargav.tries.Word;

/**
 * Tests the implementation of the trie for correctness. Also checks prefix
 * matching (which relies heavily on a feature of the trie, hence under the same
 * testing class).
 *
 * @author tbhargav
 *
 */
public class TrieAndPrefixTest {

  @Test
  /**
   * Tests our implementation of a trie vs.
   * a hand-computed example.
   */
  public void testTrieHandDrawn() {
    ArrayList<Word> testWords = new ArrayList<Word>();
    testWords.add(new Word("A"));
    testWords.add(new Word("to"));
    testWords.add(new Word("i"));
    testWords.add(new Word("in"));
    testWords.add(new Word("inn"));
    testWords.add(new Word("tea"));
    testWords.add(new Word("ted"));
    testWords.add(new Word("ten"));

    // Creating the Trie
    Trie<Word> trie = new Trie<Word>();
    trie.addValues(testWords);
    TrieNode<Word> t = trie.getRoot().getCharNode('t');
    assertTrue(t != null);
    TrieNode<Word> a = trie.getRoot().getCharNode('a');
    assertTrue(a != null);
    assertTrue(a.isWord());
    TrieNode<Word> i = trie.getRoot().getCharNode('i');
    assertTrue(i != null);
    assertTrue(i.isWord());
    TrieNode<Word> n1 = i.getCharNode('n');
    assertTrue(n1 != null);
    assertTrue(n1.isWord());
    TrieNode<Word> n2 = n1.getCharNode('n');
    assertTrue(n2 != null);
    assertTrue(n2.isWord());
    TrieNode<Word> o = t.getCharNode('o');
    assertTrue(o != null);
    assertTrue(o.isWord());
    TrieNode<Word> e = t.getCharNode('e');
    assertTrue(e != null);
    TrieNode<Word> tea = e.getCharNode('a');
    TrieNode<Word> ten = e.getCharNode('n');
    TrieNode<Word> ted = e.getCharNode('d');
    assertTrue(ted != null);
    assertTrue(ten != null);
    assertTrue(tea != null);
    assertTrue(ted.isWord());
    assertTrue(ten.isWord());
    assertTrue(tea.isWord());
  }

  @Test
  /**
   * Since we primarily need our trie
   * for storing and retrieving words,
   * this test feeds an entire corpus
   * to the trie and checks whether the
   * given words are retrieved! (Testing
   * oracle.)
   */
  public void testTrieInputRetrieval() {
    ExtWordsFileParser fileReader = new ExtWordsFileParser(
        "great_expectations.txt");
    ArrayList<String> textWords = new ArrayList<String>();
    try {
      textWords = fileReader.readWords();
    } catch (IOException e) {
      fileReader.closeReader();
      e.printStackTrace();
    }
    HashMap<String, Word> words = Word.makeWordsFromStrings(textWords);
    Trie<Word> trie = new Trie<Word>();
    trie.addValues(words.values());

    for (Word w : words.values()) {
      assertTrue(trie.getNodeFromString(w.getStringText()) != null);
    }

  }

  @Test(timeout = 15000)
  /**
   * Checks whether our prefix
   * algorithm works by comparing it
   * against an exhaustive approach. Uses
   * a random 3 letter pre-fix to achieve wide
   * range of inputs.
   * Note: If this test times out it does not
   * mean the test failed; it simply means
   * that the random pre-fixes being generated
   * were not being found in corpus.
   */
  public void prefixMatchingTest() {
    ExtWordsFileParser fReader = new ExtWordsFileParser("sherlock.txt");
    Trie<Word> trie = new Trie<Word>();
    ArrayList<String> wordStrings = null;

    try {
      wordStrings = fReader.readWords();
    } catch (IOException e) {
      fReader.closeReader();
      e.printStackTrace();
    }

    // Converting string of words into our
    // data model. And then into Trie.
    HashMap<String, Word> wordObjs = Word.makeWordsFromStrings(wordStrings);
    trie.addValues(wordObjs.values());

    char[] vowels = { 'a', 'e', 'i', 'o', 'u' };

    // Choosing a 3 letter pre-fix at semi-random
    char c1 = (char) ((int) ((Math.random() * 25) + 97));
    char c2 = vowels[(int) Math.random() * 4];
    char c3 = (char) ((int) ((Math.random() * 25) + 97));

    String prefix = new StringBuilder().append(c1).append(c3)
        .insert((int) Math.random() * 2, c2).toString();

    // Using our trie to find the pre-fixes.
    ArrayList<Word> foundWords = trie.wordsBasedOnPrefix(prefix);

    boolean found_val_in_both = true;

    // Exhaustive approach.
    for (Word w : wordObjs.values()) {
      char[] arr = w.getStringText().toCharArray();

      if (arr.length < 3) {
        continue;
      }

      if ((arr[0] == prefix.toCharArray()[0])
          && (arr[1] == prefix.toCharArray()[1])
          && (arr[2] == prefix.toCharArray()[2])) {
        found_val_in_both = false;
        for (Word l : foundWords) {
          if (l.getStringText().equalsIgnoreCase(w.getStringText())) {
            found_val_in_both = true;
          }
        }
        assertTrue(found_val_in_both);
      }
    }
    // Randomization leads to not
    // so likely prefixes sometimes.
    // So we keep running till we hit a good prefix
    // (I've provided a time-out to avoid to long
    // a run time!
    if (foundWords.size() == 0) {
      prefixMatchingTest();
    }
  }

}
