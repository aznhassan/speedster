package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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
    List<String> cssList = new ArrayList<>();
    boolean worked = false;
    JSONArray rules = new JSONArray(jsonRules);
    String folder = "";
    int length = rules.length();
    for (int i = 0; i < length; i++) {
      JSONObject obj;
      try {
        obj = new JSONObject(jsonRules);
      } catch (JSONException e) {
        System.err.println("ERROR: Not in JSON object format");
        return false;
      }

      folder = obj.getString("associated_folder_name");
      String name = obj.getString("name");
      name = name.toLowerCase().replace(" ", "_");
      // obj.remove("name");
      // obj.put("name", name);
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

      worked = writeRule(obj, folder);
      cssList.add(getCssFromObject(trigger, "trigger", name, folder));
      cssList.add(getCssFromObject(after, "after", name, folder));
      cssList.add(getCssFromObject(container, "container", name, folder));
    }

    return worked && writeCss(cssList, folder/* , name */);
  }

  /**
   * @param parentName
   *          - The name of the parent JSON object.
   * @param name
   *          - The name of the JSON object.
   * @param json
   *          - The JSON object.
   */
  private static void addClassToJsonObject(String parentName, String name,
      JSONObject json) {
    json.put("class", parentName + "-" + name);
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
      toReturn = true;
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
   * @param objectName
   *          - The name of the object.
   * @param parentName
   *          - The name of the parent object, used for making the css class
   *          name.
   * @param folder
   *          - The name of the folder for the custom css.
   * @return - The css to write to disk.
   */

  private static String getCssFromObject(JSONObject obj, String objectName,
      String parentName, String folder) {
    /*
     * "style": { "font-weight":"bold", "font-style": "italic",
     * "text-decoration":"underline", "font-family": "Times New Roman",
     * "font-size": "small/medium/big" }
     */

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
    }
    css.append("}");
    return css.toString();
  }

  /**
   * Given the subject will write the css for said subject onto disk.
   * 
   * @param css
   *          - The list of css strings to write to disk.
   * @param subject
   *          - The subject of the custom css.
   * @return - Boolean indicating a successfull operation.
   */
  private static boolean writeCss(List<String> cssList, String subject) {
    Long id = NoteReader.getNoteSubjectId(subject);
    String path = CSSPATH + "/" + id + ".css";
    File file = new File(path);
    file.getParentFile().mkdirs();
    try (
        BufferedWriter writer =
            new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(file), "UTF-8"))) {
      for (String css : cssList) {
        writer.write(css);
        writer.write("\n");
      }
    } catch (IOException e) {
      return false;
    }
    return true;
  }
}
