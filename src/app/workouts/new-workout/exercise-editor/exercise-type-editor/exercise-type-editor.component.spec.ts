import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTypeEditorComponent } from './exercise-type-editor.component';
import { Component, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExerciseType } from '../../../../gym.model';

@Component({
  template: `<ng-container>
    <gym-exercise-type-editor
      [formGroup]="form"
      [exerciseTypes]="exerciseTypes()"
      [showError]="showError()"
    />
  </ng-container>`,
  imports: [ExerciseTypeEditorComponent, ReactiveFormsModule],
})
class ExerciseTypeEditorWrapper {
  exerciseTypes = signal<ExerciseType[]>([]);
  showError = signal(false);
  child = viewChild(ExerciseTypeEditorComponent);
  form = new FormGroup({
    exerciseType: new FormControl<ExerciseType | null>(null),
    newExerciseType: new FormGroup({
      name: new FormControl(''),
      image: new FormControl(undefined),
    }),
  });
}
describe('ExerciseTypeEditorComponent', () => {
  let component: ExerciseTypeEditorWrapper;
  let fixture: ComponentFixture<ExerciseTypeEditorWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTypeEditorComponent, ExerciseTypeEditorWrapper],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTypeEditorWrapper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component.child()).toBeTruthy();
  });

  it('should have just the NewExerciseTypeComponent when exercise types are not supplied', () => {
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('gym-new-exercise-type'),
    ).toBeTruthy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeFalsy();
  });

  it('should have the ExerciseTypeDialogComponent, the use existing button and the create new button when exercise types are supplied and there is no interaction with the component', () => {
    component.exerciseTypes.set([{ id: 0, name: '', image: '' }]);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('gym-new-exercise-type'),
    ).toBeFalsy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeTruthy();
    const childElement = fixture.elementRef.nativeElement.querySelector(
      'gym-exercise-type-editor',
    );
    const buttons = childElement.querySelectorAll(':scope > div > button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].innerText.startsWith('Use')).toBeTrue();
    expect(buttons[1].innerText.startsWith('Create')).toBeTrue();
  });

  it('should have the ExerciseTypeDialogComponent, the NewExerciseTypeComponent and the use existing instead button when the create new button is clicked', () => {
    component.exerciseTypes.set([{ id: 0, name: '', image: '' }]);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('gym-new-exercise-type'),
    ).toBeFalsy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeTruthy();
    const childElement = fixture.elementRef.nativeElement.querySelector(
      'gym-exercise-type-editor',
    );
    let buttons = childElement.querySelectorAll(':scope > div > button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].innerText.startsWith('Use')).toBeTrue();
    expect(buttons[1].innerText.startsWith('Create')).toBeTrue();
    buttons[1].click();
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('gym-new-exercise-type'),
    ).toBeTruthy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeTruthy();
    buttons = childElement.querySelectorAll(':scope > div > button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].innerText.startsWith('Use')).toBeTrue();
  });

  it('should open the ExerciseTypeDialogComponent when use existing button is clicked', () => {
    component.exerciseTypes.set([{ id: 0, name: '', image: '' }]);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('gym-new-exercise-type'),
    ).toBeFalsy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeTruthy();
    const childElement = fixture.elementRef.nativeElement.querySelector(
      'gym-exercise-type-editor',
    );
    const buttons = childElement.querySelectorAll(':scope > div > button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].innerText.startsWith('Use')).toBeTrue();
    expect(buttons[1].innerText.startsWith('Create')).toBeTrue();
    expect(fixture.nativeElement.querySelector('dialog').open).toBeFalse();
    buttons[0].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog').open).toBeTrue();
  });

  it('should show error when exercise types are supplied, there is no interaction with the component and parent component changes showError input', () => {
    component.exerciseTypes.set([{ id: 0, name: '', image: '' }]);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('gym-new-exercise-type'),
    ).toBeFalsy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeTruthy();
    const childElement = fixture.elementRef.nativeElement.querySelector(
      'gym-exercise-type-editor',
    );
    const buttons = childElement.querySelectorAll(':scope > div > button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].innerText.startsWith('Use')).toBeTrue();
    expect(buttons[1].innerText.startsWith('Create')).toBeTrue();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeFalsy();
    component.showError.set(true);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeTruthy();
  });

  it('should open the ExerciseTypeDialogComponent when use existing button instead is clicked', () => {
    component.exerciseTypes.set([{ id: 0, name: '', image: '' }]);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('gym-new-exercise-type'),
    ).toBeFalsy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeTruthy();
    const childElement = fixture.elementRef.nativeElement.querySelector(
      'gym-exercise-type-editor',
    );
    let buttons = childElement.querySelectorAll(':scope > div > button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].innerText.startsWith('Use')).toBeTrue();
    expect(buttons[1].innerText.startsWith('Create')).toBeTrue();
    buttons[1].click();
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('gym-new-exercise-type'),
    ).toBeTruthy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeTruthy();
    buttons = childElement.querySelectorAll(':scope > div > button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].innerText.startsWith('Use')).toBeTrue();
    expect(fixture.nativeElement.querySelector('dialog').open).toBeFalse();
    buttons[0].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog').open).toBeTrue();
  });

  it('should have change and create new buttons when exerciseType is provided', () => {
    component.exerciseTypes.set([{ id: 0, name: '', image: '' }]);
    component.form.controls.exerciseType.setValue({
      id: 0,
      name: '',
      image: '',
    });
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('gym-new-exercise-type'),
    ).toBeFalsy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeTruthy();
    const childElement = fixture.elementRef.nativeElement.querySelector(
      'gym-exercise-type-editor',
    );
    let buttons = childElement.querySelectorAll(':scope > div > button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].innerText.startsWith('Change')).toBeTrue();
    expect(buttons[1].innerText.startsWith('Create')).toBeTrue();
  });

  it('should open the ExerciseTypeDialogComponent when change button is clicked', () => {
    component.exerciseTypes.set([{ id: 0, name: '', image: '' }]);
    component.form.controls.exerciseType.setValue({
      id: 0,
      name: '',
      image: '',
    });
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('gym-new-exercise-type'),
    ).toBeFalsy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-exercise-type-dialog',
      ),
    ).toBeTruthy();
    const childElement = fixture.elementRef.nativeElement.querySelector(
      'gym-exercise-type-editor',
    );
    let buttons = childElement.querySelectorAll(':scope > div > button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].innerText.startsWith('Change')).toBeTrue();
    expect(buttons[1].innerText.startsWith('Create')).toBeTrue();
    expect(fixture.nativeElement.querySelector('dialog').open).toBeFalse();
    buttons[0].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog').open).toBeTrue();
  });
});
