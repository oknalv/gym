import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetEditorComponent } from './set-editor.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, signal, viewChild } from '@angular/core';
import { ProgressType, WeightType } from '../../../../../gym.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  template: `<ng-container>
    <gym-set-editor
      [formGroup]="form"
      [weighted]="weighted()"
      [weightType]="weighType"
      [progressType]="progressType()"
    />
  </ng-container>`,
  imports: [SetEditorComponent, ReactiveFormsModule],
})
class SetEditorWrapper {
  weighted = signal(true);
  weightType = WeightType.side;
  progressType = signal(ProgressType.repetitions);
  child = viewChild(SetEditorComponent);
  form = new FormGroup({
    weight: new FormControl(1),
    repetitions: new FormControl(1),
    time: new FormControl(1),
  });
}

describe('SetEditorComponent', () => {
  let component: SetEditorWrapper;
  let fixture: ComponentFixture<SetEditorWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SetEditorWrapper,
        SetEditorComponent,
        TranslateModule.forRoot(),
      ],
      providers: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SetEditorWrapper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component.child()).toBeTruthy();
  });

  it('should show weight input when weighted is true', () => {
    component.weighted.set(true);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-set-editor-input[formcontrolname="weight"]',
      ),
    ).toBeTruthy();
  });

  it("shouldn't show weight input when weighted is false", () => {
    component.weighted.set(false);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-set-editor-input[formcontrolname="weight"]',
      ),
    ).toBeFalsy();
  });

  it('should show repetitions input when progressType is repetitions', () => {
    component.progressType.set(ProgressType.repetitions);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-set-editor-input[formcontrolname="repetitions"]',
      ),
    ).toBeTruthy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-set-editor-time-input[formcontrolname="time"]',
      ),
    ).toBeFalsy();
  });

  it('should show time input when progressType is time', () => {
    component.progressType.set(ProgressType.time);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-set-editor-time-input[formcontrolname="time"]',
      ),
    ).toBeTruthy();
    expect(
      fixture.elementRef.nativeElement.querySelector(
        'gym-set-editor-input[formcontrolname="repetitions"]',
      ),
    ).toBeFalsy();
  });
});
