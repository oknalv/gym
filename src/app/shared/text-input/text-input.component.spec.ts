import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextInputComponent } from './text-input.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, viewChild } from '@angular/core';

@Component({
  template: `<ng-container [formGroup]="form">
    <gym-text-input
      formControlName="test"
      [label]="label"
      [errorMessage]="errorMessage"
    />
  </ng-container>`,
  imports: [TextInputComponent, ReactiveFormsModule],
})
class TextInputWrapper {
  label = 'label';
  child = viewChild(TextInputComponent);
  errorMessage: string | undefined = undefined;
  form = new FormGroup({
    test: new FormControl(''),
  });
}

describe('TextInputComponent', () => {
  let component: TextInputWrapper;
  let fixture: ComponentFixture<TextInputWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputComponent, TextInputWrapper],
      providers: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TextInputWrapper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component.child()).toBeTruthy();
  });

  it('should not have * mark after the label when Validators.required is not present', () => {
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('input').placeholder,
    ).toBe(component.label);
  });

  it('should have * mark after the label when Validators.required is present', () => {
    component.form.controls.test.addValidators(Validators.required);
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('input').placeholder,
    ).toBe(component.label + ' *');
  });

  it('should show the error message just when it is present, the component is dirty and validation fails', () => {
    component.form.controls.test.addValidators(Validators.required);
    component.errorMessage = 'error';
    //initial state: empty
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeFalsy();
    //user input: empty
    fixture.elementRef.nativeElement
      .querySelector('input')
      .dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeTruthy();
    //user input: 'a'
    component.form.controls.test.setValue('a');
    fixture.elementRef.nativeElement
      .querySelector('input')
      .dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeFalsy();
  });

  it('should not show any error message when it is not present', () => {
    component.form.controls.test.addValidators(Validators.required);
    //initial state: empty
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeFalsy();
    //user input: empty
    fixture.elementRef.nativeElement
      .querySelector('input')
      .dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeFalsy();
    //user input: 'a'
    component.form.controls.test.setValue('a');
    fixture.elementRef.nativeElement
      .querySelector('input')
      .dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement.querySelector('.error'),
    ).toBeFalsy();
  });

  it('should disable inner input when it is disabled', async () => {
    component.form.controls.test.disable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.elementRef.nativeElement.querySelector('input').disabled,
    ).toBeTrue();
  });
});
