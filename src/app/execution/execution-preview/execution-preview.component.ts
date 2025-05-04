import { Component } from '@angular/core';
import { ExecutionComponent } from '../execution.component';
import { TranslatePipe } from '@ngx-translate/core';
import { OngoingExercisePreviewComponent } from '../ongoing-exercise/ongoing-exercise-preview/ongoing-exercise-preview.component';

@Component({
  selector: 'gym-execution-preview',
  imports: [TranslatePipe, OngoingExercisePreviewComponent],
  templateUrl: './execution-preview.component.html',
  styleUrl: './execution-preview.component.scss',
})
export class ExecutionPreviewComponent extends ExecutionComponent {}
