package edu.brown.cs.mmth.speedster;

import java.util.ArrayList;
import java.util.List;

import edu.brown.cs.mmth.fileIo.Readable;
import edu.brown.cs.mmth.fileIo.Writeable;

import org.json.JSONObject;


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
  //private String subject;
  private long id;
  private String name;
  private long subjectId;

  /**
   * Constructs a new note object with a unique ID.
   * @param d -- data to store
   * @param s -- subject Id to which note belongs
   * @param n -- name of the note.
   */
  public Note(String d, Long s, String n){
    textData=d;
    subjectId = s;
    name = n;
  }

  /** Grabs the name of the note
   * @return - The name field of the note..
   */
  public String getName() {
    return name;
  }
  
  /**
   * Gets subject Id as a String.
   * @return the subject in string form.
   */
  public String getSubjectIdStr() {
      return "" + subjectId;       
  }
  
  /** Grabs the subject Id.
   * @return
   */
  public long getSubjectId() {
    return subjectId; 
  }
//  public String getSubject() {
//    return subject;
//  }
  
  /**
   * Gets text data in single string. Use instead of
   * getDataToStore (which is exclusively used by writer).
   * Trims the text data it returns.
   * @return String with all text data of notes.
   */
  public String getTextData() {
    return textData.trim();
  }
  
  
  @Override
  public List<String> getDataToStore() {
    List<String> listString=new ArrayList<String>();
    listString.add("data:" + textData);
    listString.add("name:" + name);
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
  public void updateFields(String jsonFields) {
    JSONObject object = new JSONObject(jsonFields);
    this.textData = object.getString("data");
    this.name = object.getString("name");
  }

}
