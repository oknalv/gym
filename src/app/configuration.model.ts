export interface Configuration {
  weightUnit: WeightUnit;
  language: string;
  timerSound: boolean;
}

export enum WeightUnit {
  kg = 'kg',
  lb = 'lb',
}
