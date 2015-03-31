/**
 * See pckg-info.
 */
package edu.brown.cs.mmth.speedster;

import java.io.IOException;
import java.nio.CharBuffer;
import java.util.List;

import edu.brown.cs.mmth.fileIo.Writeable;

/**
 * This card models a flashcard. It stores all associated 
 * data and allows direct file IO. It also has the method 
 * @author tbhargav
 *
 */
public class Flashcard implements Readable, Writeable {

  @Override
  public List<String> getDataToStore() {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public int getId() {
    // TODO Auto-generated method stub
    return 0;
  }

  @Override
  public int read(CharBuffer cb) throws IOException {
    // TODO Auto-generated method stub
    return 0;
  }

  /**
   * Computes a universal flashcard rank based on given data.
   * @param numDays
   * @param noCorrect (no. of times user got card right)
   * @param noWrong (no. of times user got card wrong) 
   * @return integer rank of flashcard 
   */
  public static int computeFlashcardRank(int numDays,int noCorrect,int noWrong) {
    int dayWeight=numDays*10;
    double ratio=noWrong/noCorrect*100;
    int rank=(int)(dayWeight+ratio);
    return rank;
  }
  
}
