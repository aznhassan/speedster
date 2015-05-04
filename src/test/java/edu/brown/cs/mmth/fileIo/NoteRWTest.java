/**
 * See package-info.java file.
 */
package edu.brown.cs.mmth.fileIo;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.junit.Test;

import edu.brown.cs.mmth.speedster.Note;

/**
 * Tests note reading and writing.
 * @author tbhargav
 *
 */
public class NoteRWTest {
  @Test
  /**
   * Tests whether text gets written to file and is
   * read from file accurately.
   */
  public void basicNoteRWTest() {
    String subject = "Italiano 150";
    String data = "Come stai?";
    // Creating the dummy note object we will write to file.
    Note dummy = new Note(data, subject, "Una prova");
    // Adding dummy note to a collection (singleton collection).
    Collection<Note> notes = new ArrayList<>();
    notes.add(dummy);
    // Writing the note to file.
    boolean write = NoteWriter.writeNotes(notes);

    // Checks whether writing operation was successful.
    assertTrue(write);

    // We now read the note to ensure that its data is accurate.
    List<Note> rNotes = new ArrayList<>();
    rNotes.addAll(NoteReader.readNotes(subject));
    assertTrue(!rNotes.isEmpty());

    // Checking data for integrity.
    assertTrue(rNotes.get(0).getSubject().equals(subject));
    assertTrue(rNotes.get(0).getTextData().equals(data));
  }

  @Test
  /**
   * Tests for multiple line reading and writing.
   */
  public void multipleLineNoteRWTest() {
    String subject = "Italiano 150";
    String message = "Ciao tutti\n questo è la mia terra ora";
    // Creating the dummy note object we will write to file.
    Note dummy =
        new Note(message, subject, "test");
    // Adding dummy note to a collection (singleton collection).
    Collection<Note> notes = new ArrayList<>();
    notes.add(dummy);
    // Writing the note to file.
    boolean write = NoteWriter.writeNotes(notes);

    // Checks whether writing operation was successful.
    assertTrue(write);

    // We now read the note to ensure that its data is accurate.
    List<Note> rNotes = new ArrayList<>();
    rNotes.addAll(NoteReader.readNotes(subject));
    assertTrue(!rNotes.isEmpty());

    // Checking data for integrity.
    assertTrue(rNotes.get(0).getSubject().equals(subject));
    assertTrue(rNotes.get(0).getTextData()
        .equals(message));
  }

}
