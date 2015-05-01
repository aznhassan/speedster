package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Collection;

import com.google.common.collect.Lists;

import edu.brown.cs.mmth.speedster.Flashcard;
import edu.brown.cs.mmth.speedster.Main;

/**
 * Writes the current value of the Id variable in Main to memory, runs every n
 * seconds.
 * @author hsufi
 *
 */
public class UpdaterThread implements Runnable {

  private static final int SLEEPCOUNT = 1000 * 3; // 30 seconds.

  @Override
  public void run() {
    while (!Thread.currentThread().isInterrupted()) {
      try {
        Thread.sleep(SLEEPCOUNT);
      } catch (InterruptedException e1) {
        System.err.println("ERROR: thread interrupted, " + e1.getMessage());
        return;
      }
      if (!writeId()) {
        return;
      }
    }
  }

  /**
   * Writes the ID counter to disk.
   * @return - Writes the ID counter to disk.
   */
  private boolean writeId() {
    File file = new File("./.id");
    try (
        BufferedWriter writer =
            new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(file), "UTF-8"))) {
      writer.write("" + Main.getId());
    } catch (IOException e) {
      System.out.println("ERROR: " + e.getMessage());
      return false;
    }
    return true;
  }

  /**
   * Writes the updated flashcards to disk.
   * @return - Writes updated flashcard to disk.
   */
  private boolean writeUpdatedFlashCards() {
    Collection<Flashcard> flashcards = FlashCardReader.getUpdatedCards();
    boolean worked = false;
    for (Flashcard card : flashcards) {
      worked = worked & FlashCardWriter.writeCards(Lists.newArrayList(card));
    }
    return worked;
  }

}
