/**
 * See package-info.java.
 */
package edu.brown.cs.mmth.speedster;

/**
 * This is the main class that co-ordinates GUI with the back-end.
 * @author tbhargav
 *
 */
public class Main {

  /**
   * The main function. Simply launches the program.
   * @param args
   */
  public static void main(String[] args) {
    System.out.println(Flashcard.computeFlashcardRank(10, 2, 5));
    System.out.println(Flashcard.computeFlashcardRank(30, 10, 1));
  }

}
