import { Component, effect, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SwitchComponent } from '../shared/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { WeightUnit } from '../configuration.model';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'gym-configuration',
  imports: [TranslatePipe, SwitchComponent, FormsModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
})
export class ConfigurationComponent {
  weightUnit = signal<WeightUnit>(WeightUnit.kg);
  private configurationService = inject(ConfigurationService);
  private configuration = this.configurationService.configuration;

  constructor() {
    this.weightUnit.set(this.configuration().weightUnit);
    effect(() => {
      this.configurationService.setWeightUnit(this.weightUnit());
    });
  }
}
