package edu.brown.cs.mmth.speedster;

import java.util.ArrayList;
import java.util.List;

import edu.brown.cs.mmth.fileIo.Readable;
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
  private String textData;
  private String subject;
  private long id;

  /**
   * Constructs a new note object with a unique ID.
   * @param d -- data to store
   * @param s -- subject to which note belongs
   */
  public Note(String d, String s){
    textData=d;
    subject=s;
  }

  /**
   * Gets the subject to which the note belongs.
   * @return the subject in string form.
   */
  public String getSubject() {
    return subject;
  }
  
  @Override
  public List<String> getDataToStore() {
    List<String> listString=new ArrayList<String>();
    listString.add(textData);
    return listString;
  }

  @Override
  public long getId() {
    return id;
  }

  @Override
  public void setId(long idL) {
    id=idL;
    
  }

  @Override
  public void updateFields(List<String> fields) {
    // TODO Auto-generated method stub 
  }

}
