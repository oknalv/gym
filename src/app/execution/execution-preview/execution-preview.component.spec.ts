import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionPreviewComponent } from './execution-preview.component';
import { ExecutionService } from '../../services/execution.service';
import { WorkoutService } from '../../services/workout.service';

describe('ExecutionPreviewComponent', () => {
  let component: ExecutionPreviewComponent;
  let fixture: ComponentFixture<ExecutionPreviewComponent>;
  const mockExecutionService = jasmine.createSpyObj('ExecutionService', [
    'ongoingExecution',
  ]);
  const mockWorkoutService = jasmine.createSpyObj('WorkoutService', [
    'workouts',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionPreviewComponent],
      providers: [
        {
          provide: ExecutionService,
          useValue: mockExecutionService,
        },
        {
          provide: WorkoutService,
          useValue: mockWorkoutService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutionPreviewComponent);
    component = fixture.componentInstance;
    mockExecutionService.ongoingExecution.and.returnValue({
      workoutId: 0,
      completedExerciseIds: [],
      ongoingExerciseId: null,
      restingStart: null,
      setIndex: 0,
    });
    mockWorkoutService.workouts.and.returnValue([
      {
        id: 0,
        name: 'name',
        lastExecution: null,
        exercises: [],
      },
    ]);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
