import { Component, computed, input, model, output } from '@angular/core';
import { DialogComponent } from '../dialog.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gym-delete-warning-dialog',
  imports: [DialogComponent, TranslatePipe],
  templateUrl: './delete-warning-dialog.component.html',
  styleUrl: './delete-warning-dialog.component.scss',
})
export class DeleteWarningDialogComponent {
  open = model.required<boolean>();
  whatToDelete = input.required<string>();
  whatToDeleteKey = computed(() => {
    return `shared.deleteDialog.${this.whatToDelete()}`;
  });
  delete = output();

  onCancel() {
    this.open.set(false);
  }

  onDelete() {
    this.delete.emit();
  }
}
