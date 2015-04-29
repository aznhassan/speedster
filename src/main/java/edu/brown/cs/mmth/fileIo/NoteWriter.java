/**
 * See package-info.java
 */
package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Collection;
import java.util.List;

import edu.brown.cs.mmth.speedster.Main;
import edu.brown.cs.mmth.speedster.Note;

import org.json.JSONObject;

/**
 * Given a list of note objects writes them to file.
 *
 * @author tbhargav
 *
 */
public final class NoteWriter {

  /**
   * Given a list of note objects writes them to file using our pre-determined
   * file structure.
   *
   * @param notes
   * @return true if operation successful, false if error occurred.
   */
  public static boolean writeNotes(final Collection<Note> notes) {
    // We iterate through each note and write it in a directory that
    // corresponds to its subject name. (Base path is decided by user.)
    for (Note note : notes) {
      List<String> dataToWrite = note.getDataToStore();

      // If a given note has no data we go to next iteration.
      if (dataToWrite.isEmpty()) {
        continue;
      }

      // We now create the file path where we want to write the note.
      String basePath = Main.getBasePath();

      String suffixPath =
          "/" + note.getSubjectId() + "/N" + note.getId()
          + "/" + "/N" + note.getId();
      String finalPath = basePath + suffixPath;

      File file = new File(finalPath);
      // Creates directories in case they don't exist.
      file.getParentFile().mkdirs();

      try (
          BufferedWriter br =
          new BufferedWriter(new OutputStreamWriter(new FileOutputStream(
              file), "UTF-8"))) {
        // We will only get a single string to write.
        JSONObject obj = new JSONObject();
        int length = dataToWrite.size();
        for (int i = 0; i < length; i++) {
          String data = dataToWrite.get(i);
          String[] splitArray = data.split(":", 2);
          obj.put(splitArray[0], splitArray[1]);
          // writer.write(dataToWrite.get(i) + ",");
        }
        br.write(obj.toString());
        br.write("\n");

      } catch (IOException e) {
        return false;
      }
    }
    return true;
  }

  protected NoteWriter() {
    throw new UnsupportedOperationException();
  }

}
