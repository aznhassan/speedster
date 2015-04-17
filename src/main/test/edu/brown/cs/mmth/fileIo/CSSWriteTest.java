package edu.brown.cs.mmth.fileIo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import org.junit.Test;

public class CSSWriteTest {

  @Test
  public void cssTest() {
    boolean worked = false;
    String css = ".important {font-size: 1.5em}";
    try {
      worked = CSSSheetMaker.writeCSSToFile(css
          , "history");
    } catch (IOException e) {
      e.printStackTrace();
    }
    assert(worked);
    File file = new File("./customCSS/history");
    try (
        BufferedReader reader =
            new BufferedReader(new InputStreamReader(
                new FileInputStream(file), "UTF-8"))) {
        String line = reader.readLine();
        assert(line != null && line.equals(css));
      } catch (IOException e) {
        e.printStackTrace();
    }
  }
}
