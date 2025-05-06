import { effect, Injectable, signal } from '@angular/core';
import { Configuration, WeightUnit } from './configuration.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private CONFIGURATION_KEY = 'gym-configuration';
  private _configuration = signal<Configuration>({
    weightUnit: WeightUnit.kg,
  });
  configuration = this._configuration.asReadonly();

  constructor() {
    const configuration: Configuration | null = JSON.parse(
      window.localStorage.getItem(this.CONFIGURATION_KEY) || 'null',
    );
    if (configuration) {
      this._configuration.set(configuration);
    }
    effect(() => {
      localStorage.setItem(
        this.CONFIGURATION_KEY,
        JSON.stringify(this.configuration()),
      );
    });
  }

  setWeightUnit(weightUnit: WeightUnit) {
    this._configuration.update((configuration) => {
      return { ...configuration, weightUnit };
    });
  }
}
