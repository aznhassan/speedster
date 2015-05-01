/**
 * In tries package.
 */
package edu.brown.cs.tbhargav.tries;

import java.util.Collection;
import java.util.HashMap;

/**
 * This class models a TrieNode.
 *
 * @author tbhargav
 * @param E
 *          -- the type of value to store
 *
 */
public final class TrieNode<E> {
  // Instance variables
  private String currText;
  private HashMap<Character, TrieNode<E>> edges;
  private E storedValue;
  private int depth;

  /**
   * Constructor that makes node with given text.
   *
   * @param text
   *          - The text to make.
   * @param depthL
   *          - The depth.
   */
  public TrieNode(final String text, final int depthL) {
    currText = text;
    edges = new HashMap<Character, TrieNode<E>>();
    storedValue = null;
    depth = depthL;
  }

  /**
   * Constructor that makes empty node with default values.
   */
  public TrieNode() {
    currText = null;
    edges = new HashMap<Character, TrieNode<E>>();
    storedValue = null;
    depth = 0;
  }

  /**
   * Accessor method.
   *
   * @return the currText
   */
  public String getCurrText() {
    return currText;
  }

  /**
   * Mutator method.
   *
   * @param currText1
   *          the currText to set
   */
  public void setCurrText(final String currText1) {
    this.currText = currText1;
  }

  /**
   * Accessor method.
   * 
   * @return the edges.
   */
  public HashMap<Character, TrieNode<E>> getEdges() {
    return edges;
  }

  /**
   * Accessor method.
   *
   * @return the depth
   */
  public int getDepth() {
    return depth;
  }

  /**
   * Predicate method for checking whether stored value is word.
   * 
   * @return true or false
   */
  public boolean isWord() {
    return (storedValue != null);
  }

  /**
   * Accessor method.
   *
   * @return the storedWord
   */
  public E getStoredValue() {
    return storedValue;
  }

  /**
   * <pre>
   * Returns node that is pointed to by the specified character edge.
   * @param c - The char to find.
   * @return the node or null if it doesn't exist
   * </pre>
   */
  public TrieNode<E> getCharNode(final char c) {
    return edges.get(c);
  }

  /**
   * <pre>
   * Returns all the children nodes.
   * @return children nodes.
   * </pre>
   */
  public Collection<TrieNode<E>> getChildrenNodes() {
    return edges.values();
  }

  /**
   * <pre>
   * Returns whether edge of specified char exists.
   * @param c - The char to check for.
   * @return true or false.
   * </pre>
   */
  public boolean hasCharEdge(final char c) {
    return edges.containsKey(c);
  }

  /**
   * <pre>
   * Mutator method.
   * @param edgeChar - the edge character.
   * @param nodeToAdd - the node to add.
   * @return true if added edge, false if edge already in method.
   * </pre>
   */
  public boolean addCharEdge(final char edgeChar, final TrieNode<E> nodeToAdd) {
    if (edges.containsKey(edgeChar)) {
      return false;
    } else {
      edges.put(edgeChar, nodeToAdd);
      return true;
    }
  }

  /**
   * <pre>
   * Mutator method.
   * @param storedWord1  the storedWord to set
   * </pre>
   */
  public void setStoredValue(final E storedWord1) {
    this.storedValue = storedWord1;
  }

}
