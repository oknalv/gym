import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseImageComponent } from './exercise-image.component';

describe('ExerciseImageComponent', () => {
  let component: ExerciseImageComponent;
  let fixture: ComponentFixture<ExerciseImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseImageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('src', '');
    fixture.componentRef.setInput('alt', '');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show image when src is provided', () => {
    fixture.componentRef.setInput('src', 'a');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('gym-icon')).toBeFalsy();
  });

  it('should show icon when src is not provided', () => {
    fixture.componentRef.setInput('src', '');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('gym-icon')).toBeTruthy();
  });
});
