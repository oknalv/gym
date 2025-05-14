import { Component, computed, inject, input } from '@angular/core';
import { ExerciseSet, ProgressType } from '../../../gym.model';
import { setToString } from '../../../utils';
import { ConfigurationService } from '../../../services/configuration.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'gym-set',
  imports: [],
  templateUrl: './set.component.html',
  styleUrl: './set.component.scss',
})
export class SetComponent {
  set = input.required<ExerciseSet>();
  weighted = input.required<boolean>();
  progressType = input.required<ProgressType>();
  private configurationService = inject(ConfigurationService);
  private translateService = inject(TranslateService);
  weightUnit = computed(() => {
    return this.configurationService.configuration().weightUnit;
  });
  text = computed(() => {
    return setToString(
      this.set(),
      this.weighted(),
      this.progressType(),
      this.weightUnit(),
      this.translateService.instant('exercises.editor.sets.failure'),
    );
  });
}
