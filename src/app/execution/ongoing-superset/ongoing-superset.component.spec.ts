import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingSupersetComponent } from './ongoing-superset.component';
import { ProgressType, WeightType } from '../../gym.model';
import { TranslateModule } from '@ngx-translate/core';
import { ExecutionService } from '../../execution.service';

describe('OngoingSupersetComponent', () => {
  let component: OngoingSupersetComponent;
  let fixture: ComponentFixture<OngoingSupersetComponent>;
  const mockExecutionService = jasmine.createSpyObj('ExecutionService', [
    'ongoingExecution',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingSupersetComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ExecutionService,
          useValue: mockExecutionService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingSupersetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('superset', {
      id: 0,
      exercises: [
        {
          id: 0,
          type: { id: 0, name: 'name', image: undefined },
          progressType: ProgressType.repetitions,
          restingTime: 1,
          sets: [{ repetitions: 1, time: 1, weight: 1 }],
          weighted: true,
          weightType: WeightType.total,
        },
      ],
    });
    mockExecutionService.ongoingExecution.and.returnValue({
      workoutId: 0,
      completedExerciseIds: [],
      ongoingExerciseId: null,
      restingStart: null,
      setIndex: 0,
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
