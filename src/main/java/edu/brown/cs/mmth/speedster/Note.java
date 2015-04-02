package edu.brown.cs.mmth.speedster;

import java.io.IOException;
import java.nio.CharBuffer;
import java.util.List;

import edu.brown.cs.mmth.fileIo.Writeable;


/** Models a singular note with the ability to read
 * and write it's data onto hard-disk.
 * @author hsufi
 *
 */
public class Note implements Readable, Writeable{

  /**
   * The String that holds the written note information
   */
  private String data;

  public Note(){
    // TODO Auto-generated constructor stub
  }

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

}
