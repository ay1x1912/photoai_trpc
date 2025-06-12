export enum Status {
  Pending = "pending",
  Success = "success",
  Failed = "failed",
}
// eslint-disable-next-line 
export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] {
  // eslint-disable-next-line
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}
