import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEditorDialogComponent } from './time-editor-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

describe('TimeEditorDialogComponent', () => {
  let component: TimeEditorDialogComponent;
  let fixture: ComponentFixture<TimeEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeEditorDialogComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('value', 1);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
