import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExerciseTypeComponent } from './new-exercise-type.component';
import { Component, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  template: `<ng-container>
    <gym-new-exercise-type [formGroup]="form" />
  </ng-container>`,
  imports: [NewExerciseTypeComponent, ReactiveFormsModule],
})
class NewExerciseTypeWrapper {
  child = viewChild(NewExerciseTypeComponent);
  form = new FormGroup({
    name: new FormControl(''),
    image: new FormControl<string | undefined>(undefined),
  });
}

describe('NewExerciseTypeComponent', () => {
  let component: NewExerciseTypeWrapper;
  let fixture: ComponentFixture<NewExerciseTypeWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewExerciseTypeComponent,
        NewExerciseTypeWrapper,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewExerciseTypeWrapper);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component.child()).toBeTruthy();
  });

  it('should show just add button when there is no image', () => {
    component.form.controls.image.setValue(undefined);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(1);
  });

  it('should show change and delete buttons when image is present', () => {
    component.form.controls.image.setValue('undefined');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(2);
  });
});
