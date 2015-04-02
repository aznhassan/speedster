package edu.brown.cs.mmth.fileIo;

import java.util.List;

/**
 * Implementing this interface allows our readers to fill the objects of the
 * implementing class with data from disk.
 * 
 * @author hsufi
 *
 */
public interface Readable {

  /**
   * This allows us to update the id of the object to that of the file from
   * which we are reading.
   */
  void setId();

  /**
   * The given data will be of the form field_name: field_value. Implementing
   * objects should read the parameters and update their fields accordingly. The
   * implementing objects are responsible for checking for corrupt data
   * themselves.
   * 
   * @param fields
   *          - T
   */
  void updateFields(List<String> fields);

}