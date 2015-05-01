/**
 *
 */
package edu.brown.cs.mmth.fileIo;

import java.util.List;

/**
 * Implementing this interface allows the implementing classes to be written to
 * disk by our file writers.
 *
 * @author hsufi
 *
 */
public interface Writeable {

  /**
   * Return the value of fields of the object in the format field_name:
   * field_value.
   *
   * @return - Object's string representation to write to disk.
   */
  List<String> getDataToStore();

  /**
   * Returns unique ID of implementing object, used by writers when making the
   * file name.
   *
   * @return - Unique ID of the object.
   */
  long getId();

}
