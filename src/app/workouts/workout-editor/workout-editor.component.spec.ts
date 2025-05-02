import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutEditorComponent } from './workout-editor.component';
import { TranslateModule } from '@ngx-translate/core';

describe('WorkoutEditorComponent', () => {
  let component: WorkoutEditorComponent;
  let fixture: ComponentFixture<WorkoutEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutEditorComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
