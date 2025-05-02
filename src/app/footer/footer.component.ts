import { Component } from '@angular/core';
import { IconComponent } from '../shared/icon/icon.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'gym-footer',
  imports: [IconComponent, RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
