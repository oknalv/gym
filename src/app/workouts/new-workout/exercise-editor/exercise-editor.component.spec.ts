import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseEditorComponent } from './exercise-editor.component';
import { ProgressType, WeightType } from '../../../gym.model';

describe('ExerciseEditorComponent', () => {
  let component: ExerciseEditorComponent;
  let fixture: ComponentFixture<ExerciseEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseEditorComponent],
    }).compileComponents();

    window.localStorage.setItem('hide-superset-sets-warning', 'false');
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
        .querySelector('h2')
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
        .querySelector('h2')
        .innerText.startsWith('Edit'),
    ).toBeTrue();
    const buttons = fixture.elementRef.nativeElement.querySelectorAll('button');
    expect(buttons[buttons.length - 1].innerText.startsWith('Save')).toBeTrue();
  });

  it('should have the weight type switch when weighted is true', () => {
    fixture.detectChanges();
    const sections = fixture.elementRef.nativeElement.querySelectorAll(
      ':scope > gym-dialog form > section',
    );
    expect(sections.length).toBe(5);
    expect(
      sections[2]
        .querySelector('header')
        .innerText.indexOf('how to measure the weight'),
    ).not.toBe(-1);
  });

  it('should not have the weight type switch when weighted is false', () => {
    fixture.detectChanges();
    component.form.controls.weighted.setValue(false);
    fixture.detectChanges();
    const sections = fixture.elementRef.nativeElement.querySelectorAll(
      ':scope > gym-dialog form > section',
    );
    expect(sections.length).toBe(4);
    expect(
      sections[2]
        .querySelector('header')
        .innerText.indexOf('how to measure the weight'),
    ).toBe(-1);
  });

  it('should show error when form is invalid and submit button is clicked', () => {
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelectorAll('.error').length,
    ).toBe(0);
    const buttons = fixture.elementRef.nativeElement.querySelectorAll('button');
    buttons[buttons.length - 1].click();
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelectorAll('.error').length,
    ).toBe(2);
  });

  it('should show warning when it is in superset', () => {
    fixture.componentRef.setInput('inSuperset', true);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.warning'),
    ).toBeTruthy();
  });

  it('should hide warning after clicking close button', () => {
    fixture.componentRef.setInput('inSuperset', true);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.warning'),
    ).toBeTruthy();
    fixture.elementRef.nativeElement.querySelector('.warning > button').click();
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.warning'),
    ).toBeFalsy();
  });

  it('should now show warning when not in superset', () => {
    fixture.componentRef.setInput('inSuperset', false);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.warning'),
    ).toBeFalsy();
  });

  it('should now show warning when in superset and it had already been closed', () => {
    fixture.componentRef.setInput('inSuperset', true);
    component.onHideSupersetSetsWarning();
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.warning'),
    ).toBeFalsy();
  });

  it('should be invalid when it is weighted and any of the weights is negative', () => {
    fixture.detectChanges();
    component.form.setValue({
      type: {
        exerciseType: null,
        newExerciseType: {
          name: 'name',
          image: null,
        },
      },
      weighted: true,
      weightType: WeightType.side,
      progressType: ProgressType.repetitions,
      sets: {
        sets: [
          {
            id: 0,
            repetitions: 1,
            time: 1,
            weight: -1,
          },
        ],
      },
    });
    expect(component.form.invalid).toBeTrue();
  });

  it('should be valid when any of the weights is negative but it is not weighted', () => {
    fixture.detectChanges();
    component.form.setValue({
      type: {
        exerciseType: null,
        newExerciseType: {
          name: 'name',
          image: null,
        },
      },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.repetitions,
      sets: {
        sets: [
          {
            id: 0,
            repetitions: 1,
            time: 1,
            weight: -1,
          },
        ],
      },
    });
    expect(component.form.invalid).toBeFalse();
  });

  it('should be invalid when progress type is repetitions and any of the repetitions is less than 1 or with decimal part', () => {
    fixture.detectChanges();
    component.form.setValue({
      type: {
        exerciseType: null,
        newExerciseType: {
          name: 'name',
          image: null,
        },
      },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.repetitions,
      sets: {
        sets: [
          {
            id: 0,
            repetitions: 0,
            time: 1,
            weight: -1,
          },
        ],
      },
    });
    expect(component.form.invalid).toBeTrue();
    component.form.controls.sets.controls.sets.controls[0].controls.repetitions.setValue(
      1.5,
    );
    expect(component.form.invalid).toBeTrue();
  });

  it('should be valid when any of the repetitions is less than 1 or with decimal part but progress type is time', () => {
    fixture.detectChanges();
    component.form.setValue({
      type: {
        exerciseType: null,
        newExerciseType: {
          name: 'name',
          image: null,
        },
      },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: {
        sets: [
          {
            id: 0,
            repetitions: 0,
            time: 1,
            weight: -1,
          },
        ],
      },
    });
    expect(component.form.invalid).toBeFalse();
    component.form.controls.sets.controls.sets.controls[0].controls.repetitions.setValue(
      1.5,
    );
    expect(component.form.invalid).toBeFalse();
  });

  it('should be invalid when progress type is time and any of the time is less than 1 or with decimal part', () => {
    fixture.detectChanges();
    component.form.setValue({
      type: {
        exerciseType: null,
        newExerciseType: {
          name: 'name',
          image: null,
        },
      },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: {
        sets: [
          {
            id: 0,
            repetitions: 1,
            time: 0,
            weight: -1,
          },
        ],
      },
    });
    expect(component.form.invalid).toBeTrue();
    component.form.controls.sets.controls.sets.controls[0].controls.time.setValue(
      1.5,
    );
    expect(component.form.invalid).toBeTrue();
  });

  it('should be valid when any of the time is less than 1 or with decimal part but progress type is repetitions', () => {
    fixture.detectChanges();
    component.form.setValue({
      type: {
        exerciseType: null,
        newExerciseType: {
          name: 'name',
          image: null,
        },
      },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.repetitions,
      sets: {
        sets: [
          {
            id: 0,
            repetitions: 1,
            time: 0,
            weight: -1,
          },
        ],
      },
    });
    expect(component.form.invalid).toBeFalse();
    component.form.controls.sets.controls.sets.controls[0].controls.time.setValue(
      1.5,
    );
    expect(component.form.invalid).toBeFalse();
  });

  it('should be invalid when name is empty and there is no exercise type', () => {
    fixture.detectChanges();
    component.form.setValue({
      type: {
        exerciseType: null,
        newExerciseType: {
          name: '',
          image: null,
        },
      },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.repetitions,
      sets: {
        sets: [
          {
            id: 0,
            repetitions: 1,
            time: 1,
            weight: -1,
          },
        ],
      },
    });
    expect(component.form.invalid).toBeTrue();
  });

  it('should be valid when name has a value and there is no exercise type', () => {
    fixture.detectChanges();
    component.form.setValue({
      type: {
        exerciseType: null,
        newExerciseType: {
          name: 'name',
          image: null,
        },
      },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.repetitions,
      sets: {
        sets: [
          {
            id: 0,
            repetitions: 1,
            time: 1,
            weight: -1,
          },
        ],
      },
    });
    expect(component.form.invalid).toBeFalse();
  });

  it('should be valid when name is empty but exercise type has a value', () => {
    fixture.detectChanges();
    component.form.setValue({
      type: {
        exerciseType: { id: 0, name: 'name', image: undefined },
        newExerciseType: {
          name: '',
          image: null,
        },
      },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.repetitions,
      sets: {
        sets: [
          {
            id: 0,
            repetitions: 1,
            time: 1,
            weight: -1,
          },
        ],
      },
    });
    expect(component.form.invalid).toBeFalse();
  });

  it('should not emit any value when submitted but it is not valid', () => {
    spyOn(component.exercise, 'emit');
    fixture.detectChanges();
    component.form.setValue({
      type: {
        exerciseType: null,
        newExerciseType: {
          name: '',
          image: null,
        },
      },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.repetitions,
      sets: {
        sets: [
          {
            id: 0,
            repetitions: 1,
            time: 1,
            weight: -1,
          },
        ],
      },
    });
    expect(component.form.invalid).toBeTrue();
    component.onSubmitExercise();
    expect(component.exercise.emit).not.toHaveBeenCalled();
  });

  it('should emit the form data when submitted and it is valid', () => {
    fixture.componentRef.setInput('baseExercise', {
      id: 0,
      type: { id: 1, name: 'name', image: undefined },
      weighted: true,
      weightType: WeightType.total,
      progressType: ProgressType.repetitions,
      sets: [
        {
          repetitions: 1,
          time: 1,
          weight: 1,
        },
      ],
    });
    spyOn(component.exercise, 'emit');
    fixture.detectChanges();
    expect(component.form.invalid).toBeFalse();
    component.onSubmitExercise();
    expect(component.exercise.emit).toHaveBeenCalledWith({
      id: 0,
      type: { id: 1, name: 'name', image: undefined },
      weighted: true,
      weightType: WeightType.total,
      progressType: ProgressType.repetitions,
      sets: [
        {
          repetitions: 1,
          time: 1,
          weight: 1,
        },
      ],
    });
  });
});
