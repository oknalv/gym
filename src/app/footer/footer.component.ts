import { Component, input } from '@angular/core';
import { IconComponent } from '../shared/icon/icon.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ExecutionPreviewComponent } from '../execution/execution-preview/execution-preview.component';

@Component({
  selector: 'gym-footer',
  imports: [
    IconComponent,
    RouterLink,
    RouterLinkActive,
    ExecutionPreviewComponent,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  showExecutionPreview = input.required<boolean>();
}
