import { Component, effect, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SwitchComponent } from '../shared/switch/switch.component';
import { FormsModule } from '@angular/forms';
import {
  ConfigurationService,
  WeightUnit,
} from '../services/configuration.service';
import { SelectComponent } from '../shared/select/select.component';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'gym-configuration',
  imports: [
    TranslatePipe,
    SwitchComponent,
    FormsModule,
    SelectComponent,
    IconComponent,
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
})
export class ConfigurationComponent {
  private configurationService = inject(ConfigurationService);
  private configuration = this.configurationService.configuration;
  availableLanguages = this.configurationService.availableLanguages;
  weightUnit = signal(WeightUnit.kg);
  language = signal('en');
  timerSound = signal(false);

  constructor() {
    this.weightUnit.set(this.configuration().weightUnit);
    this.language.set(this.configuration().language);
    this.timerSound.set(this.configuration().timerSound);
    effect(() => {
      this.configurationService.setWeightUnit(this.weightUnit());
    });
    effect(() => {
      this.configurationService.setLanguage(this.language());
    });
    effect(() => {
      this.configurationService.setTimerSound(this.timerSound());
    });
  }
}
