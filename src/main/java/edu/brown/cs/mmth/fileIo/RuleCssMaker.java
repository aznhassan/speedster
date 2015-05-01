package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import edu.brown.cs.mmth.speedster.Main;

/**
 * Writes changes to custom rules and css to disk.
 *
 * @author hsufi
 */
public final class RuleCssMaker {

  private RuleCssMaker() {
  }

  private static final String CSSPATH = "./src/main/resources/static/customCss";

  /**
   * Returns the path on disk to the custom css folder.
   *
   * @return - The CSS Path.
   */
  public static String getCssPath() {
    return CSSPATH;
  }

  /**
   * @param jsonRules
   *          - The CSS JSON that will replace the current custom user style
   *          sheet of the given subject.
   * @param excludeRule
   *          - The rule to exclude from being written.
   * @return - Boolean specifying whether or not writing operation was
   *         successful.
   * @throws IOException
   *           - When an error writing to file occurs
   */
  public static boolean writeJsonToFile(String jsonRules,
      String excludeRule) throws IOException {
    if (jsonRules == null) {
      System.err.println("No JSON");
      return false;
    }
    List<String> cssList = new ArrayList<>();
    boolean worked = false;
    JSONArray rules = new JSONArray(jsonRules);
    String folder = "";
    int length = rules.length();
    boolean deleteRules = true;
    for (int i = 0; i < length; i++) {
      JSONObject obj;
      try {
        obj = rules.getJSONObject(i);
      } catch (JSONException e) {
        System.err.println("ERROR: Not in JSON object format");
        return false;
      }

      folder = obj.getString("associated_folder_name");

      String name = obj.getString("name");
      if (name.isEmpty() || name.equals(excludeRule)) {
        continue;
      }
      name = name.toLowerCase().replace(" ", "_");
      // obj.remove("name");
      // obj.put("name", name);
      boolean containerExists = true;
      boolean afterExists = true;
      try {
        obj.getJSONObject("container");
      } catch (JSONException e) {
        containerExists = false;
      }
      try {
        obj.getJSONObject("after");
      } catch (JSONException e) {
        afterExists = false;
      }
      // Adding the class value to internal JSON objects
      JSONObject trigger = obj.getJSONObject("trigger");
      addClassToJsonObject(name, "trigger", trigger);
      String triggerRuleName = trigger.getString("word");
      if (triggerRuleName.isEmpty()) {
        continue;
      }
      JSONObject after = new JSONObject();
      if (afterExists) {
        after = obj.getJSONObject("after");
        addClassToJsonObject(name, "after", after);
      }
      JSONObject container = new JSONObject();
      if (containerExists) {
        container = obj.getJSONObject("container");
        addClassToJsonObject(name, "container", container);
      }

      // Reading internal JSON objects.
      obj.remove("trigger");
      obj.put("trigger", trigger);
      if (afterExists) {
        obj.remove("after");
        obj.put("after", after);
      }
      if (containerExists) {
        obj.remove("container");
        obj.put("container", container);
      }

      worked = writeRule(obj, folder, deleteRules);
      if (deleteRules) {
        deleteRules = false;
      }
      cssList.add(getCssFromObject(trigger, "trigger", name, folder));
      if (afterExists) {
        cssList.add(getCssFromObject(after, "after", name, folder));
      }
      if (containerExists) {
        cssList.add(getCssFromObject(container, "container", name, folder));
      }
    }

    if (deleteRules) {
      // No rules to write to disk so rules were not deleted.
      worked = true;
      File file = new File(Main.getBasePath() + "/" + folder + "/rules/");
      if (file.isDirectory() && deleteRules) {
        try {
          FileUtils.deleteDirectory(file);
        } catch (IOException e1) {
          System.err.println("ERROR:" + e1.getMessage());
          return false;
        }
      }
    }
    if (cssList.isEmpty()) {
      cssList.add("");
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
   * @param deleteRules
   *          - Whether or not to delete the rules folder.
   * @return - A boolean indicating if the operation worked.
   */
  private static boolean writeRule(JSONObject rule, String folder,
      boolean deleteRules) {
    boolean toReturn = false;
    String name = rule.getString("name");
    String path = Main.getBasePath() + "/" + folder + "/rules/" + name;
    File file = new File(path);
    if (file.getParentFile().isDirectory() && deleteRules) {
      try {
        FileUtils.deleteDirectory(file.getParentFile());
      } catch (IOException e1) {
        System.err.println("ERROR:" + e1.getMessage());
        return false;
      }
    }
    file.getParentFile().mkdirs();
    try (
        BufferedWriter writer =
        new BufferedWriter(new OutputStreamWriter(
            new FileOutputStream(file), "UTF-8"))) {
      writer.write(rule.toString());
      toReturn = true;
    } catch (IOException e) {
      System.err.println("ERROR:" + e.getMessage());
      return false;
    }
    return toReturn;
  }

  /**
   * Pulls custom css from the object and writes the rules to disk.
   *
   * @param obj
   *          The JSON object containing the css rules.
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
        css.append(style).append(";");
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
