export class Utils{
  public static RandomElement(array: any[]) {
    return array[_.random(array.length - 1)];
  }
}
