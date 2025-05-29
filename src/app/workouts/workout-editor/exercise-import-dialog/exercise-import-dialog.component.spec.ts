import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseImportDialogComponent } from './exercise-import-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ExerciseImportDialogComponent', () => {
  let component: ExerciseImportDialogComponent;
  let fixture: ComponentFixture<ExerciseImportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseImportDialogComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseImportDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('existingExerciseIds', []);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
