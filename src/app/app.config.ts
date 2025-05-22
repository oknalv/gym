import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { DataService } from './services/data.service';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { WorkoutService } from './services/workout.service';
import { ConfigurationService } from './services/configuration.service';
import { provideServiceWorker } from '@angular/service-worker';
import { TimerService } from './services/timer.service';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient,
) => new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAppInitializer(() => {
      inject(TimerService);
      inject(ConfigurationService);
      const dataService = inject(DataService);
      const workoutService = inject(WorkoutService);
      return new Promise((resolve) => {
        dataService.init().then(() => {
          workoutService.init().then(resolve);
        });
      });
    }),
    provideHttpClient(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
