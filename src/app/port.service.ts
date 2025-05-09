import { inject, Injectable } from '@angular/core';
import { ExerciseType, WorkoutDTO } from './gym.model';
import { Configuration } from './configuration.model';
import { DataService } from './data.service';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class PortService {
  private dataService = inject(DataService);
  private configurationService = inject(ConfigurationService);
  constructor() {}

  async export() {
    const appDataContainer: AppDataContainer = {
      workouts: await this.dataService.getAllData(
        this.dataService.workoutStoreName,
      ),
      exerciseTypes: await this.dataService.getAllData(
        this.dataService.exerciseTypeStoreName,
      ),
      configuration: this.configurationService.configuration(),
    };
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(appDataContainer)),
    );
    element.setAttribute('download', 'gym.json');
    element.click();
  }

  async import() {
    return new Promise<void>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = () => {
        const reader = new FileReader();
        reader.onload = async () => {
          const appDataContainer: AppDataContainer = JSON.parse(
            reader.result as string,
          );
          for (const exerciseType of appDataContainer.exerciseTypes) {
            await this.dataService.addData(
              this.dataService.exerciseTypeStoreName,
              exerciseType,
            );
          }
          for (const workout of appDataContainer.workouts) {
            await this.dataService.addData(
              this.dataService.workoutStoreName,
              workout,
            );
          }
          this.configurationService.setLanguage(
            appDataContainer.configuration.language,
          );
          this.configurationService.setWeightUnit(
            appDataContainer.configuration.weightUnit,
          );
          resolve();
        };
        reader.readAsText(input.files![0], 'UTF-8');
      };
      input.click();
    });
  }
}

interface AppDataContainer {
  workouts: WorkoutDTO[];
  exerciseTypes: ExerciseType[];
  configuration: Configuration;
}
