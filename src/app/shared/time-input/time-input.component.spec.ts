import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeInputComponent } from './time-input.component';
import { Component, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  template: ` <ng-container [formGroup]="form">
    <gym-time-input formControlName="test" />
  </ng-container>`,
  imports: [TimeInputComponent, ReactiveFormsModule],
})
class TimeInputWrapper {
  child = viewChild(TimeInputComponent);
  form = new FormGroup({
    test: new FormControl(''),
  });
}
describe('TimeInputComponent', () => {
  let component: TimeInputWrapper;
  let fixture: ComponentFixture<TimeInputWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TimeInputComponent,
        TimeInputWrapper,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeInputWrapper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component.child()).toBeTruthy();
  });
});
