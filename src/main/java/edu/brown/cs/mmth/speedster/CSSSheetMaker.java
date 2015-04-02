package edu.brown.cs.mmth.speedster;

import java.io.IOException;

/** Writes changes to custom user css to file given
 * JSON of the changes.
 * @author hsufi
 *
 */
public class CSSSheetMaker {

  private CSSSheetMaker() {}

  /**
   * @param cssJson - The CSS that will replace the current custom user
   * style sheet of the given subject.
   * @throws IOException - When an error writing to file occurs
   */
  public static void writeJSONToFile(String cssJson) throws IOException {
    //Once we decide on file structure given the subject we would
    //then just replace the custom user style sheet located in that folder.
  }

}
