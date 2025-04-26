import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupersetEditorComponent } from './superset-editor.component';

describe('SupersetEditorComponent', () => {
  let component: SupersetEditorComponent;
  let fixture: ComponentFixture<SupersetEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupersetEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupersetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
