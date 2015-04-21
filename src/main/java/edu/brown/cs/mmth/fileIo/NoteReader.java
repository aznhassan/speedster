/**
 * See package-info.java file.
 */
package edu.brown.cs.mmth.fileIo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;

import edu.brown.cs.mmth.speedster.Main;
import edu.brown.cs.mmth.speedster.Note;

/**
 * Reads all the notes within a given directory into Note objects.
 * 
 * @author tbhargav
 *
 */
public class NoteReader {

  protected NoteReader() {
    throw new UnsupportedOperationException();
  }

  /**
   * Reads note files in a given path into our 'Note' object.
   * 
   * @param subject
   *          whose notes you want.
   * @return collection of note. In case of error return null.
   */
  public static Collection<Note> readNotes(String subject) {
    // Creating a file with the given path.
    String basePath = Main.getBasePath();
    File folder = new File(basePath + "/" + subject);

    // Reading all notes in path.
    Collection<Note> notes = new ArrayList<Note>();
    for (File fileEntry : folder.listFiles()) {
      // Making sure we're only reading notes and not flashcards/directories.
      if (fileEntry.isFile() && (fileEntry.getName().charAt(0) == 'N')) {

        // Reading data from this file into string.
        StringBuilder text = new StringBuilder();
        try (
            BufferedReader br =
                new BufferedReader(new InputStreamReader(new FileInputStream(
                    fileEntry), "UTF-8"))) {
          String s;
          while ((s = br.readLine()) != null) {
            text.append(s + "\n");
          }
        } catch (Exception e) {
          return null;
        }
        // Converting retrieved data into note object.
        Note note = new Note(text.toString(), subject);
        note.setId(Long.parseLong(fileEntry.getName().substring(1)));
        notes.add(note);
      }
    }
    return notes;
  }

}
