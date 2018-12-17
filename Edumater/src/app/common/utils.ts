import * as _ from "underscore";

export class Utils{
  public static RandomElement(array: any[]) {
    if (!array || array.length == 0) {
      return null;
    }
    return array[_.random(array.length - 1)];
  }
}
