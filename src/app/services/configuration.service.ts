import { effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private readonly CONFIGURATION_KEY = 'gym-configuration';
  private _configuration = signal<Configuration>({
    weightUnit: WeightUnit.kg,
    language: navigator.language.split('-')[0],
    timerSound: false,
  });
  configuration = this._configuration.asReadonly();
  private translateService = inject(TranslateService);

  get availableLanguages() {
    return ['en', 'es'];
  }

  constructor() {
    this.translateService.addLangs(this.availableLanguages);
    this.translateService.setDefaultLang('en');
    const configuration: Configuration | null = JSON.parse(
      window.localStorage.getItem(this.CONFIGURATION_KEY) || 'null',
    );
    if (configuration) {
      this._configuration.set(configuration);
    }
    this.translateService.use(this.configuration().language);

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

  setLanguage(language: string) {
    this.translateService.use(language);
    this._configuration.update((configuration) => {
      return { ...configuration, language };
    });
  }

  setTimerSound(timerSound: boolean) {
    this._configuration.update((configuration) => {
      return { ...configuration, timerSound };
    });
  }
}
export interface Configuration {
  weightUnit: WeightUnit;
  language: string;
  timerSound: boolean;
}

export enum WeightUnit {
  kg = 'kg',
  lb = 'lb',
}
