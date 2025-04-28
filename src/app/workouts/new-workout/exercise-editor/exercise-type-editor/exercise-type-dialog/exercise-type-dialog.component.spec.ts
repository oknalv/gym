import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTypeDialogComponent } from './exercise-type-dialog.component';

describe('ExerciseTypeDialogComponent', () => {
  let component: ExerciseTypeDialogComponent;
  let fixture: ComponentFixture<ExerciseTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTypeDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('exerciseTypes', [
      { id: 1, name: 'a', image: undefined },
    ]);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit and close when any of the exercise types is selected', () => {
    spyOn(component.select, 'emit');
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog').open).toBeTrue();
    expect(component.select.emit).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('gym-exercise-type').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog').open).toBeFalse();
    expect(component.select.emit).toHaveBeenCalledWith({
      id: 1,
      name: 'a',
      image: undefined,
    });
  });
});
