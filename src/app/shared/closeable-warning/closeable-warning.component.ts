import {
  Component,
  effect,
  input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gym-closeable-warning',
  imports: [IconComponent, TranslatePipe],
  templateUrl: './closeable-warning.component.html',
  styleUrl: './closeable-warning.component.scss',
})
export class CloseableWarningComponent implements OnInit {
  storageKey = input.required<string>();
  warningKey = input.required<string>();

  hideWarning!: WritableSignal<boolean>;

  constructor() {
    effect(() => {
      localStorage.setItem(
        this.storageKey(),
        JSON.stringify(this.hideWarning()),
      );
    });
  }
  ngOnInit(): void {
    this.hideWarning = signal(
      localStorage.getItem(this.storageKey() || '') === 'true',
    );
  }

  onHideWarning() {
    this.hideWarning.set(true);
  }
}
