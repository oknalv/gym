import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'gym-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  host: {
    '[style]': 'style()',
  },
})
export class IconComponent {
  icon = input.required<string>();

  style = computed(() => {
    return {
      '--icon-id': `'${this.icon()}'`,
      '--icon-comp': `'${this.icon()}_comp'`,
    };
  });
}
