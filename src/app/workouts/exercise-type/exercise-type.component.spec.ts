import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTypeComponent } from './exercise-type.component';

describe('ExerciseTypeComponent', () => {
  let component: ExerciseTypeComponent;
  let fixture: ComponentFixture<ExerciseTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTypeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('type', {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
