export default class NunjucksUtils {
  static objectMerge(originalObject: object, extraObject: object): object {
    return { ...originalObject, ...extraObject }
  }
}
