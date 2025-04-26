import { Component, input, model, output } from '@angular/core';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'gym-delete-warning-dialog',
  imports: [DialogComponent],
  templateUrl: './delete-warning-dialog.component.html',
  styleUrl: './delete-warning-dialog.component.scss',
})
export class DeleteWarningDialogComponent {
  open = model.required<boolean>();
  whatToDelete = input.required<string>();
  delete = output();

  onCancel() {
    this.open.set(false);
  }

  onDelete() {
    this.delete.emit();
  }
}
