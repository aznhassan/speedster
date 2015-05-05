package edu.brown.cs.mmth.fileIo;

import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.commons.io.FileUtils;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import edu.brown.cs.mmth.speedster.Main;

public class CSSWriteTest {

  private static String testJson = "";

  private static String testCss = "";

  private static boolean readTestJson() {
    File file = new File("src/test/rule.txt");
    try (
        BufferedReader reader =
        new BufferedReader(new InputStreamReader(new FileInputStream(file),
            "UTF-8"))) {
      StringBuilder bd = new StringBuilder();
      String line = "";
      while ((line = reader.readLine()) != null) {
        bd.append(line);
      }
      testJson = bd.toString();
      return true;
    } catch (IOException e) {
      return false;
    }
  }

  private static boolean readExpectedCss() {
    File file = new File("src/test/css.txt");
    try (
        BufferedReader reader =
        new BufferedReader(new InputStreamReader(new FileInputStream(file),
            "UTF-8"))) {
      StringBuilder bd = new StringBuilder();
      String line = "";
      while ((line = reader.readLine()) != null) {
        bd.append(line);
      }
      testCss = bd.toString();
      return true;
    } catch (IOException e) {
      return false;
    }
  }


  @BeforeClass
  public static void onceExecutedBeforeAll() {
    assertTrue(readTestJson());
    assertTrue(readExpectedCss());
  }

  @AfterClass
  public static void deleteData() {
    File testFile = new File("src/main/resources/static/customCss/-1.css");
    File testFolder = new File(Main.getBasePath() + "/Testing");
    try {
      FileUtils.deleteDirectory(testFolder);
    } catch (IOException e) {
      System.err.println("ERROR: Couldn't delete folder");
      System.exit(1);
    }
    if(!testFile.delete()) {
      System.err.println("ERROR: Couldn't delete file");
    }
  }

  @Test
  public void cssTest() {
    boolean worked = false;
    try {
      worked = RuleCssMaker.writeJsonToFile(testJson, "");
    } catch (IOException e) {
      e.printStackTrace();
    }
    assertTrue(worked);
    File file = new File("src/main/resources/static/customCss/-1.css");
    try (
        BufferedReader reader =
        new BufferedReader(new InputStreamReader(new FileInputStream(file),
            "UTF-8"))) {
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
