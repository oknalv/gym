import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetsEditorComponent } from './sets-editor.component';
import { Component, signal, viewChild } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProgressType, WeightType } from '../../../../gym.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  template: `<ng-container>
    <gym-sets-editor
      [formGroup]="form"
      [weighted]="weighted()"
      [weightType]="weighType"
      [progressType]="progressType()"
    />
  </ng-container>`,
  imports: [SetsEditorComponent, ReactiveFormsModule],
})
class SetsEditorWrapper {
  weighted = signal(true);
  weightType = WeightType.side;
  progressType = signal(ProgressType.repetitions);
  child = viewChild(SetsEditorComponent);
  form = new FormGroup({
    sets: new FormArray([
      new FormGroup({
        id: new FormControl(0),
        weight: new FormControl(1),
        repetitions: new FormControl(1),
        time: new FormControl(1),
      }),
    ]),
  });
}

describe('SetsEditorComponent', () => {
  let component: SetsEditorWrapper;
  let fixture: ComponentFixture<SetsEditorWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SetsEditorComponent,
        SetsEditorWrapper,
        TranslateModule.forRoot(),
      ],
      providers: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SetsEditorWrapper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component.child()).toBeTruthy();
  });

  it("shouldn't show the remove button when there is only one set", () => {
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.delete-set-button'),
    ).toBeFalsy();
  });

  it('should show the remove button when there is more than one set', () => {
    fixture.detectChanges();
    component.child()!.onAddSet();
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelectorAll('.delete-set-button')
        .length,
    ).toBe(2);
  });

  it('should clone the last set when adding a new one and add it to the end', () => {
    const newSetValue = { weight: 10, repetitions: 3, time: 8 };
    fixture.detectChanges();
    component.child()!.onAddSet();
    fixture.detectChanges();
    const initialValue0 = component.child()!.sets.get('0')!.value;
    delete initialValue0['id'];
    const initialValue1 = component.child()!.sets.get('1')!.value;
    delete initialValue1['id'];
    expect(initialValue0).toEqual(initialValue1);
    component
      .child()!
      .sets.get('1')!
      .setValue({ id: 0, ...newSetValue });
    fixture.detectChanges();
    expect(component.child()!.sets.get('0')!.value).not.toEqual(
      component.child()!.sets.get('1')!.value,
    );
    const value1 = component.child()!.sets.get('1')!.value;
    delete value1['id'];
    expect(value1).toEqual({ ...newSetValue });
    component.child()!.onAddSet();
    fixture.detectChanges();
    const value2 = component.child()!.sets.get('2')!.value;
    delete value2['id'];
    expect(value2).toEqual({ ...newSetValue });
  });

  it('should delete correctly', () => {
    const newSetValue0 = { id: 0, weight: 1, repetitions: 2, time: 3 };
    const newSetValue1 = { id: 1, weight: 10, repetitions: 3, time: 8 };
    const newSetValue2 = { id: 2, weight: 11, repetitions: 7, time: 33 };
    fixture.detectChanges();
    component
      .child()!
      .sets.get('0')!
      .setValue({ ...newSetValue0 });
    component.child()!.onAddSet();
    component
      .child()!
      .sets.get('1')!
      .setValue({ ...newSetValue1 });
    component.child()!.onAddSet();
    component
      .child()!
      .sets.get('2')!
      .setValue({ ...newSetValue2 });
    fixture.detectChanges();
    expect(component.child()?.sets.length).toBe(3);
    component.child()!.onDeleteSet(1);
    fixture.detectChanges();
    expect(component.child()?.sets.length).toBe(2);
    expect(component.child()!.sets.get('0')!.value).toEqual({
      ...newSetValue0,
    });
    expect(component.child()!.sets.get('1')!.value).toEqual({
      ...newSetValue2,
    });
  });

  it("should show weight error when any of the sets' weight is invalid", () => {
    fixture.detectChanges();
    let errors = fixture.elementRef.nativeElement.querySelectorAll('.error');
    expect(errors.length).toBe(0);
    const firstSet = component.child()!.sets.get('0') as FormGroup;
    const firstSetWeight = firstSet.controls['weight'];
    firstSetWeight.addValidators([Validators.min(firstSetWeight.value + 10)]);
    firstSetWeight.updateValueAndValidity();
    fixture.detectChanges();
    errors = fixture.elementRef.nativeElement.querySelectorAll('.error');
    expect(errors.length).toBe(1);
    expect(errors[0].innerText).toBe('sets.editor.weightError');
  });

  it("should show repetitions error when any of the sets' repetitions is invalid", () => {
    fixture.detectChanges();
    let errors = fixture.elementRef.nativeElement.querySelectorAll('.error');
    expect(errors.length).toBe(0);
    const firstSet = component.child()!.sets.get('0') as FormGroup;
    const firstSetRepetitions = firstSet.controls['repetitions'];
    firstSetRepetitions.addValidators([
      Validators.min(firstSetRepetitions.value + 10),
    ]);
    firstSetRepetitions.updateValueAndValidity();
    fixture.detectChanges();
    errors = fixture.elementRef.nativeElement.querySelectorAll('.error');
    expect(errors.length).toBe(1);
    expect(errors[0].innerText).toBe('sets.editor.repetitionsError');
  });

  it("should show both repetitions and weight error when any of the sets' repetitions and weight are invalid", () => {
    fixture.detectChanges();
    let errors = fixture.elementRef.nativeElement.querySelectorAll('.error');
    expect(errors.length).toBe(0);
    const firstSet = component.child()!.sets.get('0') as FormGroup;
    const firstSetWeight = firstSet.controls['weight'];
    firstSetWeight.addValidators([Validators.min(firstSetWeight.value + 10)]);
    const firstSetRepetitions = firstSet.controls['repetitions'];
    firstSetRepetitions.addValidators([
      Validators.min(firstSetRepetitions.value + 10),
    ]);
    firstSetWeight.updateValueAndValidity();
    firstSetRepetitions.updateValueAndValidity();
    fixture.detectChanges();
    errors = fixture.elementRef.nativeElement.querySelectorAll('.error');
    expect(errors.length).toBe(2);
    expect(errors[0].innerText).toBe('sets.editor.weightError');
    expect(errors[1].innerText).toBe('sets.editor.repetitionsError');
  });
});
