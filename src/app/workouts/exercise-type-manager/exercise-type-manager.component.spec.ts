import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTypeManagerComponent } from './exercise-type-manager.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ExerciseTypeManagerComponent', () => {
  let component: ExerciseTypeManagerComponent;
  let fixture: ComponentFixture<ExerciseTypeManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTypeManagerComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTypeManagerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', false);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
