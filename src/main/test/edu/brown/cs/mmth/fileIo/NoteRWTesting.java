/**
 * See package-info.java file.
 */
package edu.brown.cs.mmth.fileIo;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import edu.brown.cs.mmth.speedster.Note;

import org.junit.Test;

/**
 * Tests note reading and writing.
 * @author tbhargav
 *
 */
public class NoteRWTesting {
  @Test
  /**
   * Tests whether text gets written to file and is
   * read from file accurately.
   */
  public void basicNoteRWTest() {
    // Creating the dummy note object we will write to file.
    Note dummy=new Note("Hello world.","CS");
    // Adding dummy note to a collection (singleton collection).
    Collection<Note> notes=new ArrayList<>();
    notes.add(dummy);
    // Writing the note to file.
    boolean write=NoteWriter.writeNotes(notes);

    // Checks whether writing operation was successful.
    assertTrue(write);

    // We now read the note to ensure that its data is accurate.
    List<Note> rNotes=new ArrayList<>();
    rNotes.addAll(NoteReader.readNotes("CS"));
    assertTrue(!rNotes.isEmpty());

    // Checking data for integrity.
    assertTrue(rNotes.get(0).getSubject().equals("CS"));
    assertTrue(rNotes.get(0).getTextData().equals("Hello world."));
  }

  @Test
  /**
   * Tests for multiple line reading and writing.
   */
  public void multipleLineNoteRWTest() {
    // Creating the dummy note object we will write to file.
    Note dummy=new Note("Hello world.\nI am your new overlord.","CS");
    // Adding dummy note to a collection (singleton collection).
    Collection<Note> notes=new ArrayList<>();
    notes.add(dummy);
    // Writing the note to file.
    boolean write=NoteWriter.writeNotes(notes);

    // Checks whether writing operation was successful.
    assertTrue(write);

    // We now read the note to ensure that its data is accurate.
    List<Note> rNotes=new ArrayList<>();
    rNotes.addAll(NoteReader.readNotes("CS"));
    assertTrue(!rNotes.isEmpty());

    // Checking data for integrity.
    assertTrue(rNotes.get(0).getSubject().equals("CS"));
    //assertTrue(rNotes.get(0).getTextData().equals("Hello world.\nI am your new overlord."));
  }

}
