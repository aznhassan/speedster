package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

import org.json.JSONArray;
import org.json.JSONObject;

/** Writes changes to custom user css to file given
 * JSON of the changes.
 * @author hsufi
 *
 */
public class CSSSheetMaker {

  private CSSSheetMaker() {}

  /**
   * @param cssJson - The CSS JSON that will replace the current custom user
   * style sheet of the given subject.
   * @return - Boolean specifying whether or not writing operation was
   * successful.
   * @throws IOException - When an error writing to file occurs
   */
  public static boolean
  writeJsonToFile(String cssJson) throws IOException {
    if (cssJson == null) {
      System.err.println("No JSON");
      return false;
    }
    boolean toReturn = true;
    JSONArray array = new JSONArray(cssJson);
    int length = array.length();
    for (int i = 0; i < length; i++) {
      JSONObject obj = array.getJSONObject(i);
      String folder = obj.getString("associatedFolder");
      JSONArray styleArray = obj.getJSONArray("styleClasses");
      int styleLength = styleArray.length();
      StringBuilder css = new StringBuilder();
      for (int j = 0; j < styleLength; j++) {
        JSONObject style = styleArray.getJSONObject(j);
        String[] noteName = JSONObject.getNames(style);
        String name = noteName[0];
        JSONObject styleValues = style.getJSONObject(name);
        String[] styleNames = JSONObject.getNames(styleValues);
        int nameLength = styleNames.length;
        if (nameLength > 0) {
          css.append(name).append("{");
        }
        for (int k = 0; k < nameLength; k++) {
          String cssValue = styleNames[k];
          css.append(cssValue).append(":");
          if (cssValue.equals("font-family")) {
            css.append("\"").append(styleValues.get(cssValue)).append("\"")
            .append(";");
          } else {
            css.append(styleValues.get(cssValue)).append(";");
          }
        }
        css.deleteCharAt(css.length() - 1); //deleting the extra ";"
        if (nameLength > 0) {
          css.append("}");
        }
      }
      toReturn = toReturn && writeCss(css.toString(), folder);
    }
    return toReturn;
  }

  /** Given the subject will write the css for said subject onto disk.
   * @param css - The css to write to disk.
   * @param subject - The subject of the custom css.
   * @return - Boolean indicating a successfull operation.
   */
  private static boolean writeCss(String css, String subject) {
    File file = new File("./customCSS/" + subject);
    file.getParentFile().mkdirs();
    try (BufferedWriter writer =
        new BufferedWriter(new OutputStreamWriter(
            new FileOutputStream(file), "UTF-8"));) {
      writer.write(css);
    } catch (IOException e) {
      return false;
    }
    return true;
  }

  /*
   *  String[] styleNames = JSONObject.getNames(styleValues);
        int nameLength = styleNames.length;
        if (nameLength > 0) {
          css.append(name).append("{");
        }
        for (int k = 0; k < nameLength; k++) {
          css.append(styleValues.get(styleNames[k]));
        }
        if (nameLength > 0) {
          css.append("}");
        }*/
}
