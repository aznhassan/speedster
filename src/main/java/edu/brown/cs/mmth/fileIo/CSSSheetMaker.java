package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.common.collect.Lists;

import edu.brown.cs.mmth.speedster.Main;

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
    String folder = obj.getString("associated_folder_name");
    worked = writeRule(obj, folder);
    String name = obj.getString("name");
    // Adding the class value to internal JSON objects
    JSONObject trigger = obj.getJSONObject("trigger");
    addClassToJsonObject(name, "trigger", trigger);
    JSONObject after = obj.getJSONObject("after");
    addClassToJsonObject(name, "after", after);
    JSONObject container = obj.getJSONObject("container");
    addClassToJsonObject(name, "container", container);

    // Reading internal JSON objects.
    obj.remove("trigger");
    obj.put("trigger", trigger);
    obj.remove("after");
    obj.put("after", after);
    obj.remove("container");
    obj.put("container", container);

    List<String> cssList =
        Lists.newArrayList(getCssFromObject(trigger, name, folder),
            getCssFromObject(after, name, folder),
            getCssFromObject(container, name, folder));
    return worked && writeCss(cssList, folder, name);
  }

  private static void addClassToJsonObject(String parentName, String name,
      JSONObject json) {
    json.put("class", name + "-" + name);
  }

  /**
   * Writes a JSON rule to disk given the subject.
   * 
   * @param rule
   *          - The JSON object representing the rule.
   * @param folder
   *          - The folder of the rule.
   * @return - A boolean indicating if the operation worked.
   */
  private static boolean writeRule(JSONObject rule, String folder) {
    boolean toReturn = false;
    String name = rule.getString("name");
    String path = Main.getBasePath() + "/" + folder + "/rules/" + name;
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
   * @param parentName
   *          - The name of the parent object, used for making the css class
   *          name.
   * @param folder
   *          - The name of the folder for the custom css.
   * @return - The css to write to disk.
   */

  private static String getCssFromObject(JSONObject obj, String parentName,
      String folder) {
    /*
     * "style": { "font-weight":"bold", "font-style": "italic",
     * "text-decoration":"underline", "font-family": "Times New Roman",
     * "font-size": "small/medium/big" }
     */

    String objectName = obj.getString("name");
    JSONObject styleObject = obj.getJSONObject("style");
    String[] styleNames = JSONObject.getNames(styleObject);
    int styleLength = styleNames.length;

    StringBuilder css = new StringBuilder();
    css.append(".").append(parentName + "-" + objectName).append("{");
    for (int j = 0; j < styleLength; j++) {
      String name = styleNames[j];
      String style = styleObject.getString(name);
      css.append(name).append(":");
      if (name.equals("font-family")) {
        css.append("\"").append(style).append("\"").append(";");
      } else {
        css.append(name).append(";");
      }
    }
    if (styleLength > 0) {
      css.deleteCharAt(css.length() - 1); // deleting the extra ";"
      css.append("}");
    }
    return css.toString();
  }

  /**
   * Given the subject will write the css for said subject onto disk.
   * 
   * @param css
   *          - The list of css strings to write to disk.
   * @param subject
   *          - The subject of the custom css.
   * @param name
   *          - The name of the rule
   * @return - Boolean indicating a successfull operation.
   */
  private static boolean writeCss(List<String> cssList, String subject,
      String name) {
    for (String css : cssList) {
      Long id = NoteReader.getNoteSubjectId(subject);
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
