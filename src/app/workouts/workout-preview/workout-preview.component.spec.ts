import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutPreviewComponent } from './workout-preview.component';
import { TranslateModule } from '@ngx-translate/core';

describe('WorkoutPreviewComponent', () => {
  let component: WorkoutPreviewComponent;
  let fixture: ComponentFixture<WorkoutPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutPreviewComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutPreviewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('workout', {
      id: 0,
      name: 'name',
      lastExecution: null,
      exercises: [],
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
