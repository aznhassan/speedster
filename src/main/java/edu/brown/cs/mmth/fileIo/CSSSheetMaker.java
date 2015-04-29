package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;

import edu.brown.cs.mmth.speedster.Main;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Writes changes to custom user css to file given JSON of the changes.
 * 
 * @author hsufi
 *
 */
public class CSSSheetMaker {

  private CSSSheetMaker() {
  }

  private static final String CSSPATH = "./src/main/resources/static/customCss";

  public static String getCssPath() {
    return CSSPATH;
  }

  /**
   * @param cssJson
   *          - The CSS JSON that will replace the current custom user style
   *          sheet of the given subject.
   * @param jsonRules
   *          - The CSS JSON that will replace the current custom user style
   *          sheet of the given subject.
   * @return - Boolean specifying whether or not writing operation was
   *         successful.
   * @throws IOException
   *           - When an error writing to file occurs
   */
  public static boolean writeJsonToFile(String jsonRules) throws IOException {
    if (jsonRules == null) {
      System.err.println("No JSON");
      return false;
    }
    JSONObject obj;
    try {
      obj = new JSONObject(jsonRules);
    } catch (JSONException e) {
      System.err.println("ERROR: Not in JSON object format");
      return false;
    }
    
    boolean worked = false;
    long id;
    try {
      id = Long.parseLong(obj.getString("associated_folder_id"));
    } catch (NumberFormatException e) {
      System.err.println("ERROR: Non number ID given");
      return false;
    }
    worked = writeRule(obj, id);
    String name = obj.getString("name");
    JSONObject trigger = obj.getJSONObject("trigger");
    JSONObject after = obj.getJSONObject("after");
    JSONObject container = obj.getJSONObject("container");
    /*List<String> cssList =
        Lists.newArrayList(getCssFromObject(trigger, folder),
            getCssFromObject(after, folder),
            getCssFromObject(container, folder));*/
    return worked; 
        //writeCss(cssList, folder, name);
  }

  /**
   * Writes a JSON rule to disk given the subject.
   * 
   * @param rule
   *          - The JSON object representing the rule.
   * @param id
   *          - The folder id of the rule.
   * @return - A boolean indicating if the operation worked.
   */
  private static boolean writeRule(JSONObject rule, long id) {
    boolean toReturn = false;
    String name = rule.getString("name");
    String path = Main.getBasePath() + "/" + id + "/rules/" + name;
    File file = new File(path);
    file.getParentFile().mkdirs();
    try (
        BufferedWriter writer =
            new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(file), "UTF-8"))) {
      writer.write(rule.toString());
    } catch (IOException e) {
      return false;
    }
    return toReturn;
  }

  /**
   * Pulls custom css from the object and writes the rules to disk.
   * 
   * @param obj
   *          - The JSON object containing the css rules.
   * @param folder
   *          - The name of the folder for the custom css.
   * @return - The css to write to disk.
   */
/*  private static String getCssFromObject(JSONObject obj, String folder) {
    JSONObject styleObject = obj.getJSONObject("style");
    String[] styleNames = JSONObject.getNames(styleObject);
    int styleLength = styleNames.length;
    StringBuilder css = new StringBuilder();
    for (int j = 0; j < styleLength; j++) {
      String name = styleNames[j];
      String style = styleObject.getString(name);
      css.append(".").append(name).append("{");
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
      css.deleteCharAt(css.length() - 1); // deleting the extra ";"
      if (nameLength > 0) {
        css.append("}");
      }
    }
    return css.toString();
    // toReturn = toReturn && writeCss(css.toString(), folder);
    // return toReturn;
  }*/

  /**
   * Given the subject will write the css for said subject onto disk.
   * 
   * @param css
   *          - The list of css strings to write to disk.
   * @param id
   *          - The subject id of the subject who's css is being written.
   * @param name - The name of the rule
   * @return - Boolean indicating a successfull operation.
   */
  private static boolean writeCss(List<String> cssList, long id,
      String name) {
    for (String css : cssList) {
      //Long id = NoteReader.getNoteSubjectId(subject);
      String path = CSSPATH + "/" + id + ".css";
      File file = new File(path);
      file.getParentFile().mkdirs();
      try (
          BufferedWriter writer =
              new BufferedWriter(new OutputStreamWriter(new FileOutputStream(
                  file), "UTF-8"))) {
        writer.write(css);
      } catch (IOException e) {
        return false;
      }
    }
    return true;
  }
}
