import { Component, effect, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SwitchComponent } from '../shared/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { WeightUnit } from '../configuration.model';
import { ConfigurationService } from '../configuration.service';
import { SelectComponent } from '../shared/select/select.component';

@Component({
  selector: 'gym-configuration',
  imports: [TranslatePipe, SwitchComponent, FormsModule, SelectComponent],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
})
export class ConfigurationComponent {
  private configurationService = inject(ConfigurationService);
  private configuration = this.configurationService.configuration;
  availableLanguages = this.configurationService.availableLanguages;
  weightUnit = signal(WeightUnit.kg);
  language = signal('en');

  constructor() {
    this.weightUnit.set(this.configuration().weightUnit);
    this.language = signal(this.configuration().language);
    effect(() => {
      this.configurationService.setWeightUnit(this.weightUnit());
    });
    effect(() => {
      this.configurationService.setLanguage(this.language());
    });
  }
}
