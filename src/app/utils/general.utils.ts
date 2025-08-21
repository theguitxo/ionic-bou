export class GeneralUtils {
  static IndexInArray(array: unknown[], index: number): boolean {
    return Array.from(array.keys())?.includes(index);
  }

  static getTotalEqualArrayValues(
    arrayOrigin: unknown[],
    referenceArray: unknown[]
  ): number {
    return arrayOrigin.length !== referenceArray.length ? 0 :
      arrayOrigin.map((value: unknown, index: number) => referenceArray[index] === value)?.filter((i) => !!i)?.length;
  }
}
