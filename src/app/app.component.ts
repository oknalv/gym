import { Component, computed, inject, signal } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ExecutionService } from './services/execution.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'gym-root',
  imports: [FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    '[class.executing]': 'isExecuting()',
    '[class.in-execution]': 'isInExecution()',
  },
})
export class AppComponent {
  private executionService = inject(ExecutionService);
  private router = inject(Router);
  private currentPage = signal('');
  isExecuting = computed(() => {
    return !!this.executionService.ongoingExecution();
  });
  isInExecution = computed(() => {
    return this.currentPage() === '/execution';
  });
  showExecutionPreview = computed(() => {
    return this.isExecuting() && !this.isInExecution();
  });

  constructor() {
    Notification.requestPermission();
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe({
        next: (event) => {
          this.currentPage.set(event.url);
        },
      });
    if (this.isExecuting()) {
      this.router.navigate(['/execution'], { replaceUrl: true });
    } else {
      this.router.navigate(['/workouts'], { replaceUrl: true });
    }
  }
}
