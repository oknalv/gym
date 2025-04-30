import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEditorDialogInputComponent } from './time-editor-dialog-input.component';
import { Component, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  template: ` <ng-container [formGroup]="form">
    <gym-time-editor-dialog-input formControlName="test" [label]="label" />
  </ng-container>`,
  imports: [TimeEditorDialogInputComponent, ReactiveFormsModule],
})
class TimeEditorDialogInputWrapper {
  child = viewChild(TimeEditorDialogInputComponent);
  label = signal('hours');
  form = new FormGroup({
    test: new FormControl(0),
  });
}

describe('TimeEditorDialogInputComponent', () => {
  let component: TimeEditorDialogInputWrapper;
  let fixture: ComponentFixture<TimeEditorDialogInputWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TimeEditorDialogInputComponent,
        TimeEditorDialogInputWrapper,
        TranslateModule.forRoot(),
      ],
      providers: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeEditorDialogInputWrapper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component.child()).toBeTruthy();
  });
});
