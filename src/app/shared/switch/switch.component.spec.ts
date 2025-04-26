import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchComponent } from './switch.component';
import { Component, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  template: ` <ng-container [formGroup]="form">
    <gym-switch formControlName="test" [options]="options" />
  </ng-container>`,
  imports: [SwitchComponent, ReactiveFormsModule],
})
class SwitchWrapper {
  child = viewChild(SwitchComponent);
  options = {
    on: true,
    off: false,
  };
  form = new FormGroup({
    test: new FormControl(true),
  });
}

describe('SwitchComponent', () => {
  let component: SwitchWrapper;
  let fixture: ComponentFixture<SwitchWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchComponent, SwitchWrapper],
      providers: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchWrapper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component.child()).toBeTruthy();
  });

  it('should have the on option selected and the off option not selected on creation', () => {
    fixture.detectChanges();
    const buttons = fixture.elementRef.nativeElement.querySelectorAll('button');
    expect(buttons[0].classList.contains('selected')).toBeTrue();
    expect(buttons[1].classList.contains('selected')).toBeFalse();
  });

  it('should have the off option selected and the on option not selected after clicking in off option', () => {
    fixture.detectChanges();
    const buttons = fixture.elementRef.nativeElement.querySelectorAll('button');
    expect(buttons[0].classList.contains('selected')).toBeTrue();
    expect(buttons[1].classList.contains('selected')).toBeFalse();
    buttons[1].click();
    fixture.detectChanges();
    expect(buttons[0].classList.contains('selected')).toBeFalse();
    expect(buttons[1].classList.contains('selected')).toBeTrue();
  });

  it('should have the on option selected and the off option not selected after clicking in on option', () => {
    fixture.detectChanges();
    const buttons = fixture.elementRef.nativeElement.querySelectorAll('button');
    expect(buttons[0].classList.contains('selected')).toBeTrue();
    expect(buttons[1].classList.contains('selected')).toBeFalse();
    buttons[0].click();
    fixture.detectChanges();
    expect(buttons[0].classList.contains('selected')).toBeTrue();
    expect(buttons[1].classList.contains('selected')).toBeFalse();
  });

  it('should have both options not selected when disabled', async () => {
    fixture.detectChanges();
    let buttons = fixture.elementRef.nativeElement.querySelectorAll('button');
    expect(buttons[0].classList.contains('selected')).toBeTrue();
    expect(buttons[1].classList.contains('selected')).toBeFalse();
    component.form.controls.test.disable();
    fixture.detectChanges();
    await fixture.whenStable();
    buttons = fixture.elementRef.nativeElement.querySelectorAll('button');
    expect(buttons[0].classList.contains('selected')).toBeFalse();
    expect(buttons[1].classList.contains('selected')).toBeFalse();
  });
});
