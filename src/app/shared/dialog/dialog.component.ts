import {
  Component,
  effect,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'gym-dialog',
  imports: [IconComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  open = model.required<boolean>();
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  alert = input(false);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.dialog()!.nativeElement.showModal();
        this.dialog()!.nativeElement.querySelector(
          '.dialog-content',
        )!.scrollTop = 0;
      } else {
        this.dialog()!.nativeElement.close();
      }
    });
  }

  onClose() {
    this.open.set(false);
  }

  get height() {
    return this.alert() ? 'fit-content' : '100%';
  }
}
