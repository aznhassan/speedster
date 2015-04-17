package edu.brown.cs.mmth.fileIo;

import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import org.junit.Test;

public class CSSWriteTest {

  private static String testJson =
      "["
     + "{"
     + "\"associatedFolder\":\"history\","
     + "\"styleClasses\":"
     + "[{\".note\": "
     +  "{"
     +   "\"font-weight\":\"bold\","
     +   "\"font-style\":\"italic\","
     +   "\"text_decoration\":\"underline\","
     +   "\"font-family\":\"Arrial Narrow\""
     +  "}"
     + "},"
     + "{\".q\": "
     +  "{"
     +    "\"font-weight\":\"bold\","
     +    "\"font-style\":\"italic\","
     +    "\"font-family\":\"Arial\""
     +  "}"
     +  "}],"
     + "}"
    + "]";

  private static String testCss = ".note{text_decoration:underline;font-weight:bold;"
      + "font-family:\"Arrial Narrow\";font-style:italic}"
      + ".q{font-weight:bold;font-family:\"Arial\";font-style:italic}";


  @Test
  public void cssTest() {
    boolean worked = false;
    try {
      worked = CSSSheetMaker.writeJsonToFile(testJson);
    } catch (IOException e) {
      e.printStackTrace();
    }
    assertTrue(worked);
    File file = new File("./customCSS/history");
    try (
        BufferedReader reader =
            new BufferedReader(new InputStreamReader(
                new FileInputStream(file), "UTF-8"))) {
        StringBuilder bd = new StringBuilder();
        String line = "";
        while ((line = reader.readLine()) != null) {
          bd.append(line);
        }
        assertTrue(bd.toString().trim().equals(testCss));
    } catch (IOException e) {
        e.printStackTrace();
    }
  }
}
