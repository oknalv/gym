import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseOptionComponent } from './exercise-option.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressType, WeightType } from '../../gym.model';

describe('ExerciseOptionComponent', () => {
  let component: ExerciseOptionComponent;
  let fixture: ComponentFixture<ExerciseOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseOptionComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseOptionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('exercise', {
      id: 0,
      type: { id: 0, name: 'name', image: undefined },
      progressType: ProgressType.repetitions,
      restingTime: 1,
      sets: [{ repetitions: 1, time: 1, weight: 1 }],
      weighted: true,
      weightType: WeightType.total,
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
