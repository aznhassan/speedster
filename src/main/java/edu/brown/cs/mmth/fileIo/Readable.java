package edu.brown.cs.mmth.fileIo;

/**
 * Implementing this interface allows our readers to fill the objects of the
 * implementing class with data from disk.
 * @author hsufi
 *
 */
public interface Readable {

  /**
   * This allows us to update the id of the object to that of the file from
   * which we are reading.
   * @param idL
   *          -- id to set object to
   */
  void setId(long idL);

  /**
   * The given data will be of the form field_name: field_value. Implementing
   * objects should read the parameters and update their fields accordingly. The
   * implementing objects are responsible for checking for corrupt data
   * themselves.
   * @param jsonFields
   *          - The fields of the object represented as a JSON object. - T
   */
  void updateFields(String jsonFields);

}
