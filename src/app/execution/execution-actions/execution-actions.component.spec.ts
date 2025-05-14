import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionActionsComponent } from './execution-actions.component';
import { ExecutionService } from '../../services/execution.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ExecutionActionsComponent', () => {
  let component: ExecutionActionsComponent;
  let fixture: ComponentFixture<ExecutionActionsComponent>;
  const mockExecutionService = jasmine.createSpyObj('ExecutionService', [
    'ongoingExecution',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionActionsComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ExecutionService,
          useValue: mockExecutionService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutionActionsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('elementKey', 'elementKey');
    fixture.componentRef.setInput('isLastSet', false);
    fixture.componentRef.setInput('restingTime', 1);
    fixture.componentRef.setInput('isLastExercise', false);
    mockExecutionService.ongoingExecution.and.returnValue({
      workoutId: 1,
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
