/**
 * In tries package.
 */
package edu.brown.cs.tbhargav.tries;

import java.util.ArrayList;

/**
 * Defines a generic Trie data structure.
 *
 * @author tbhargav.
 * @param <E> a trie storable class in which to store the data.
 */
public final class Trie<E extends TrieStorable> {
  private final TrieNode<E> root;

  /**
   * Default constructor.
   */
  public Trie() {
    root = new TrieNode<E>();
    root.setCurrText("");
  }

  /**
   * Parameterized constructor.
   *
   * @param initialVals
   *          - The initial values.
   */
  public Trie(final Iterable<E> initialVals) {
    root = new TrieNode<E>();
    root.setCurrText("");
    this.addValues(initialVals);
  }

  /**
   * Accessor method.
   *
   * @return the root.
   */
  public TrieNode<E> getRoot() {
    return root;
  }

  /**
   * <pre>
   * Adds new value to Trie in the proper sorted order, recursively.
   * @param root1 - The node to add the value to.
   * @param val - The val to add.
   * @param toStore - The String to add.
   * </pre>
   */
  private void addValue(final TrieNode<E> root1, final E val,
      final String toStore) {
    char[] toStoreArr = toStore.toLowerCase().toCharArray();

    // Base case.
    if (toStoreArr.length == 1) {
      if (root1.hasCharEdge(toStoreArr[0])) {
        TrieNode<E> nodeToAdd = root1.getCharNode(toStoreArr[0]);
        nodeToAdd.setStoredValue(val);
      } else {
        root1.addCharEdge(toStoreArr[0], new TrieNode<E>(root1.getCurrText()
            + toStoreArr[0], root1.getDepth() + 1));
        TrieNode<E> nodeToAdd = root1.getCharNode(toStoreArr[0]);
        nodeToAdd.setStoredValue(val);
      }
      return;
    }

    if (root1.hasCharEdge(toStoreArr[0])) {
      addValue(root1.getCharNode(toStoreArr[0]), val,
          toStore.substring(1, toStore.length()));
    } else {
      root1.addCharEdge(toStoreArr[0], new TrieNode<E>(root1.getCurrText()
          + toStoreArr[0], root1.getDepth() + 1));
      addValue(root1.getCharNode(toStoreArr[0]), val,
          toStore.substring(1, toStore.length()));
    }

  }

  /**
   * <pre>
   * Goes through tree to locate the node from a particular string.
   *
   * @param text - The text to find.
   * @return the node if found, null otherwise.
   * </pre>
   */
  public TrieNode<E> getNodeFromString(final String text) {
    char[] charArray = text.toCharArray();
    int i = 0;
    TrieNode<E> currNode = root;
    while (i < text.length()) {

      if (currNode.getCharNode(charArray[i]) == null) {
        return null;
      } else {
        currNode = currNode.getCharNode(charArray[i]);
      }

      if (currNode.getCurrText().equalsIgnoreCase(text)) {
        return currNode;
      }
      i++;
    }
    return null;
  }

  /**
   * Prints trie to CLI.
   */
  public void printTree() {
    printTreeHelper(root);
  }

  /**
   * <pre>
   * Helps to print the tree.
   * @param root1 - The root to print.
   * </pre>
   */
  private void printTreeHelper(final TrieNode<E> root1) {
    for (TrieNode<E> node : root1.getChildrenNodes()) {
      System.out.print(node.getCurrText() + " ");
    }
    System.out.println(" ");
    for (TrieNode<E> node : root1.getChildrenNodes()) {
      printTreeHelper(node);
    }
  }

  /**
   * <pre>
   * Returns the words that given prefix can lead to.
   *
   * @param prefix - The prefix.
   * @return list of words (vals).
   * </pre>
   */
  public ArrayList<E> wordsBasedOnPrefix(final String prefix) {
    TrieNode<E> rootL = getNodeFromString(prefix);
    ArrayList<E> values = new ArrayList<E>();

    if (rootL == null) {
      return new ArrayList<E>();
    }

    if (rootL.isWord()) {
      values.add(rootL.getStoredValue());
    }

    for (TrieNode<E> child : rootL.getChildrenNodes()) {
      values.addAll(wordsBasedOnPrefix(child.getCurrText()));
    }
    return values;
  }

  /**
   * <pre>
   * Adds given values to trie.
   *
   * @param valuesToAdd - The values to add.
   * </pre>
   */
  public void addValues(final Iterable<E> valuesToAdd) {
    for (E val : valuesToAdd) {
      if (val != null) {
        addValue(root, val, val.getStringText());
      }
    }
  }

}
