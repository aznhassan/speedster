package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

/** Writes changes to custom user css to file given
 * JSON of the changes.
 * @author hsufi
 *
 */
public class CSSSheetMaker {

  private CSSSheetMaker() {}

  /**
   * @param cssFile - The CSS that will replace the current custom user
   * style sheet of the given subject.
   * @param subject - The subject who's custom style is being changed.
   * @return - Boolean specifying whether or not writing operation was
   * successful.
   * @throws IOException - When an error writing to file occurs
   */
  public static boolean
  writeCSSToFile(String cssFile, String subject) throws IOException {
    File file = new File("./customCSS/" + subject);
    file.getParentFile().mkdirs();
    try (BufferedWriter writer =
        new BufferedWriter(new OutputStreamWriter(
            new FileOutputStream(file), "UTF-8"));) {
      writer.write(cssFile);
    } catch (IOException e) {
      return false;
    }
    return true;
  }

}
