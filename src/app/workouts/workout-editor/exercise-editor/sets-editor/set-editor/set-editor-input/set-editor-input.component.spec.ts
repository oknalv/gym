import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetEditorInputComponent } from './set-editor-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, viewChild } from '@angular/core';

@Component({
  template: ` <ng-container [formGroup]="form">
    <gym-set-editor-input formControlName="test" icon="repeat" label="reps" />
  </ng-container>`,
  imports: [SetEditorInputComponent, ReactiveFormsModule],
})
class SetEditorInputWrapper {
  child = viewChild(SetEditorInputComponent);
  form = new FormGroup({
    test: new FormControl(''),
  });
}

describe('SetEditorInputComponent', () => {
  let component: SetEditorInputWrapper;
  let fixture: ComponentFixture<SetEditorInputWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetEditorInputComponent, SetEditorInputWrapper],
      providers: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SetEditorInputWrapper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component.child()).toBeTruthy();
  });
});
