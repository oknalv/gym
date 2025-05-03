import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutDetailComponent } from './workout-detail.component';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('WorkoutDetailComponent', () => {
  let component: WorkoutDetailComponent;
  let fixture: ComponentFixture<WorkoutDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDetailComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '0');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
