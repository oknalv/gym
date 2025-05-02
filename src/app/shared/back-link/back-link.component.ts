import { Component, inject } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Location } from '@angular/common';

@Component({
  selector: 'gym-back-link',
  imports: [IconComponent],
  templateUrl: './back-link.component.html',
  styleUrl: './back-link.component.scss',
})
export class BackLinkComponent {
  location = inject(Location);

  onGoBack() {
    this.location.back();
  }
}
