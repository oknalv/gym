export interface Configuration {
  weightUnit: WeightUnit;
  language: string;
}

export enum WeightUnit {
  kg = 'kg',
  lb = 'lb',
}
