import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetEditorTimeInputComponent } from './set-editor-time-input.component';
import { Component, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  template: ` <ng-container [formGroup]="form">
    <gym-set-editor-time-input formControlName="test" />
  </ng-container>`,
  imports: [SetEditorTimeInputComponent, ReactiveFormsModule],
})
class SetEditorTimeInputWrapper {
  child = viewChild(SetEditorTimeInputComponent);
  form = new FormGroup({
    test: new FormControl(''),
  });
}

describe('SetEditorTimeInputComponent', () => {
  let component: SetEditorTimeInputWrapper;
  let fixture: ComponentFixture<SetEditorTimeInputWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SetEditorTimeInputComponent,
        SetEditorTimeInputWrapper,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SetEditorTimeInputWrapper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
