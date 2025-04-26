import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseEditorComponent } from './exercise-editor.component';
import { ProgressType, WeightType } from '../../../exercise.model';

fdescribe('ExerciseEditorComponent', () => {
  let component: ExerciseEditorComponent;
  let fixture: ComponentFixture<ExerciseEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseEditorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('exerciseTypes', []);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('baseExercise', undefined);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should be on create mode when baseExercise is not provided', () => {
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement
        .querySelector('h1')
        .innerText.startsWith('New'),
    ).toBeTrue();
    const buttons = fixture.elementRef.nativeElement.querySelectorAll('button');
    expect(buttons[buttons.length - 1].innerText.startsWith('Add')).toBeTrue();
  });

  it('should be on edit mode when baseExercise is provided', () => {
    fixture.componentRef.setInput('baseExercise', {
      id: 0,
      type: null,
      weighted: true,
      weightType: WeightType.total,
      progressType: ProgressType.repetitions,
      sets: [],
    });
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement
        .querySelector('h1')
        .innerText.startsWith('Edit'),
    ).toBeTrue();
    const buttons = fixture.elementRef.nativeElement.querySelectorAll('button');
    expect(buttons[buttons.length - 1].innerText.startsWith('Save')).toBeTrue();
  });

  it('should not display the exercise type dialog when there are no exercise types', () => {
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeFalsy();
  });

  it('should display the exercise type dialog when there are exercise types', () => {
    fixture.componentRef.setInput('exerciseTypes', [
      { id: 0, name: '', image: '' },
    ]);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeTruthy();
  });
});
