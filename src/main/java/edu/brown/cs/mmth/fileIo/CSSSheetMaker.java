package edu.brown.cs.mmth.fileIo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;

import org.json.JSONArray;
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

    String folder = obj.getString("associated_folder_name");
    writeRule(obj, folder);
    JSONObject trigger = obj.getJSONObject("trigger");
    JSONObject after = obj.getJSONObject("after");
    JSONObject container = obj.getJSONObject("container");
    List<String> cssList =
        Lists.newArrayList(getCssFromObject(trigger, folder),
            getCssFromObject(after, folder),
            getCssFromObject(container, folder));
    return writeCss(cssList, folder);
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
    String path = Main.getBasePath() + "/.data/" + folder + "/rules/" + name;
    try (
        BufferedWriter writer =
            new BufferedWriter(new OutputStreamWriter(new FileOutputStream(
                new File(path)), "UTF-8"))) {
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
  private static String getCssFromObject(JSONObject obj, String folder) {
    JSONArray styleArray = obj.getJSONArray("style");
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
        css.append(".").append(name).append("{");
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
      css.deleteCharAt(css.length() - 1); // deleting the extra ";"
      if (nameLength > 0) {
        css.append("}");
      }
    }
    return css.toString();
    // toReturn = toReturn && writeCss(css.toString(), folder);
    // return toReturn;
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
    for (String css: cssList) {
      Long id = NoteReader.getNoteSubjectId(subject);
      String path = CSSPATH + "/" + id + ".css";
      File file = new File(path);
      file.getParentFile().mkdirs();
      try (
          BufferedWriter writer =
              new BufferedWriter(new OutputStreamWriter(
                  new FileOutputStream(file), "UTF-8"))) {
        writer.write(css);
      } catch (IOException e) {
        return false;
      }
    }
    return true;
  }
}
