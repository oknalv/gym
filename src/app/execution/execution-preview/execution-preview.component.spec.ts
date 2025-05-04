import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionPreviewComponent } from './execution-preview.component';

describe('ExecutionPreviewComponent', () => {
  let component: ExecutionPreviewComponent;
  let fixture: ComponentFixture<ExecutionPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
