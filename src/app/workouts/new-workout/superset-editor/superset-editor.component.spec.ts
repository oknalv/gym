import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupersetEditorComponent } from './superset-editor.component';
import { ProgressType, WeightType } from '../../../gym.model';
import { TranslateModule } from '@ngx-translate/core';

describe('SupersetEditorComponent', () => {
  let component: SupersetEditorComponent;
  let fixture: ComponentFixture<SupersetEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupersetEditorComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SupersetEditorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('baseSuperset', { id: 0, exercises: [] });
    fixture.componentRef.setInput('exerciseTypes', []);
    fixture.componentRef.setInput('showError', false);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have the editing exercise set to undefined by default and when the editor is closed', () => {
    fixture.detectChanges();
    expect(component.editingExercise()).toBeFalsy();
    expect(component.exerciseEditorVisible()).toBeFalse();
    component.editingExercise.set({
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
    expect(component.editingExercise()).toBeTruthy();
    expect(component.exerciseEditorVisible()).toBeFalse();
    component.showExerciseEditor();
    expect(component.exerciseEditorVisible()).toBeTrue();
    component.exerciseEditorVisible.set(false);
    expect(component.exerciseEditorVisible()).toBeFalse();
  });

  it('should open the exercise editor when clicking add exercise', () => {
    fixture.detectChanges();
    expect(component.exerciseEditorVisible()).toBeFalse();
    fixture.elementRef.nativeElement.querySelector('.add-exercise').click();
    expect(component.exerciseEditorVisible()).toBeTrue();
    component.exerciseEditorVisible.set(false);
    expect(component.exerciseEditorVisible()).toBeFalse();
    fixture.componentRef.setInput('baseSuperset', {
      id: 0,
      exercises: [
        {
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
        },
      ],
    });
    fixture.detectChanges();
    fixture.elementRef.nativeElement.querySelector('.edit-exercise').click();
    expect(component.exerciseEditorVisible()).toBeTrue();
  });

  it('should open the delete warning dialog when clicking delete exercise', () => {
    fixture.componentRef.setInput('baseSuperset', {
      id: 0,
      exercises: [
        {
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
        },
      ],
    });
    fixture.detectChanges();
    expect(component.showAskDeleteExercise()).toBeFalse();
    fixture.elementRef.nativeElement
      .querySelector('.ask-delete-exercise')
      .click();
    expect(component.showAskDeleteExercise()).toBeTrue();
  });

  it('should add new exercise when exercise array is empty or when the received exercise is not in the array', () => {
    fixture.detectChanges();
    expect(component.baseSuperset().exercises.length).toBe(0);
    component.onGetExercise({
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
    expect(component.baseSuperset().exercises.length).toBe(1);
    component.onGetExercise({
      id: 1,
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
    expect(component.baseSuperset().exercises.length).toBe(2);
  });

  it('should edit exercise when exercise array is not empty and the received exercise is in the array', () => {
    fixture.componentRef.setInput('baseSuperset', {
      id: 0,
      exercises: [
        {
          id: 1,
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
        },
      ],
    });
    fixture.detectChanges();
    expect(component.baseSuperset().exercises.length).toBe(1);
    component.onGetExercise({
      id: 1,
      type: { id: 2, name: 'name2', image: undefined },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: [
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
      ],
    });
    expect(component.baseSuperset().exercises.length).toBe(1);
    expect(component.baseSuperset().exercises[0]).toEqual({
      id: 1,
      type: { id: 2, name: 'name2', image: undefined },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: [
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
      ],
    });
  });

  it('should emit new exercise type when it is not in exercise type array', () => {
    spyOn(component.newExerciseType, 'emit');
    fixture.componentRef.setInput('exerciseTypes', [
      { id: 0, name: 'name', image: undefined },
    ]);
    component.onGetExercise({
      id: 1,
      type: { id: 2, name: 'name2', image: undefined },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: [
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
      ],
    });
    expect(component.newExerciseType.emit).toHaveBeenCalledWith({
      id: 2,
      name: 'name2',
      image: undefined,
    });
  });

  it('should not emit new exercise type when it is in exercise type array', () => {
    spyOn(component.newExerciseType, 'emit');
    fixture.componentRef.setInput('exerciseTypes', [
      { id: 1, name: 'name', image: undefined },
    ]);
    component.onGetExercise({
      id: 1,
      type: { id: 1, name: 'name', image: undefined },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: [
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
      ],
    });
    expect(component.newExerciseType.emit).not.toHaveBeenCalled();
  });

  it('should update number of sets in exercises when new exercise is added', () => {
    fixture.detectChanges();
    component.onGetExercise({
      id: 1,
      type: { id: 2, name: 'name2', image: undefined },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: [
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
      ],
    });
    expect(component.baseSuperset().exercises[0].sets.length).toBe(1);
    component.onGetExercise({
      id: 2,
      type: { id: 2, name: 'name2', image: undefined },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: [
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
      ],
    });
    expect(component.baseSuperset().exercises[0].sets.length).toBe(2);
    expect(component.baseSuperset().exercises[1].sets.length).toBe(2);
    component.onGetExercise({
      id: 3,
      type: { id: 2, name: 'name2', image: undefined },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: [
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
      ],
    });
    expect(component.baseSuperset().exercises[0].sets.length).toBe(1);
    expect(component.baseSuperset().exercises[1].sets.length).toBe(1);
    expect(component.baseSuperset().exercises[2].sets.length).toBe(1);
  });

  it('should emit superset when exercise is received', () => {
    spyOn(component.superset, 'emit');
    fixture.detectChanges();
    component.onGetExercise({
      id: 1,
      type: { id: 2, name: 'name2', image: undefined },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: [
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
      ],
    });
    expect(component.superset.emit).toHaveBeenCalledWith({
      id: 0,
      exercises: [
        {
          id: 1,
          type: { id: 2, name: 'name2', image: undefined },
          weighted: false,
          weightType: WeightType.side,
          progressType: ProgressType.time,
          sets: [
            {
              repetitions: 2,
              time: 2,
              weight: 2,
            },
          ],
        },
      ],
    });
    component.onGetExercise({
      id: 2,
      type: { id: 2, name: 'name2', image: undefined },
      weighted: false,
      weightType: WeightType.side,
      progressType: ProgressType.time,
      sets: [
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
        {
          repetitions: 2,
          time: 2,
          weight: 2,
        },
      ],
    });
    expect(component.superset.emit).toHaveBeenCalledWith({
      id: 0,
      exercises: [
        {
          id: 1,
          type: { id: 2, name: 'name2', image: undefined },
          weighted: false,
          weightType: WeightType.side,
          progressType: ProgressType.time,
          sets: [
            {
              repetitions: 2,
              time: 2,
              weight: 2,
            },
            {
              repetitions: 2,
              time: 2,
              weight: 2,
            },
          ],
        },
        {
          id: 2,
          type: { id: 2, name: 'name2', image: undefined },
          weighted: false,
          weightType: WeightType.side,
          progressType: ProgressType.time,
          sets: [
            {
              repetitions: 2,
              time: 2,
              weight: 2,
            },
            {
              repetitions: 2,
              time: 2,
              weight: 2,
            },
          ],
        },
      ],
    });
  });

  it('should delete when exercise is deleted and emit correct superset', () => {
    spyOn(component.superset, 'emit');
    fixture.componentRef.setInput('baseSuperset', {
      id: 0,
      exercises: [
        {
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
        },
      ],
    });
    fixture.detectChanges();
    fixture.elementRef.nativeElement.querySelector('ask-delete-exercise');
    component.onDeleteExercise();
    expect(component.baseSuperset().exercises.length).toBe(0);
    expect(component.superset.emit).toHaveBeenCalledWith({
      id: 0,
      exercises: [],
    });
  });

  it('should show the error when the showError input is true and there are no exercises', () => {
    fixture.componentRef.setInput('baseSuperset', {
      id: 0,
      exercises: [],
    });
    fixture.componentRef.setInput('showError', true);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeTruthy();
  });

  it('should not show the error when the showError input is true and there are exercises', () => {
    fixture.componentRef.setInput('baseSuperset', {
      id: 0,
      exercises: [
        {
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
        },
      ],
    });
    fixture.componentRef.setInput('showError', true);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeFalsy();
  });

  it('should not show the error when the showError input is false', () => {
    fixture.componentRef.setInput('baseSuperset', {
      id: 0,
      exercises: [],
    });
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeFalsy();
  });
});
