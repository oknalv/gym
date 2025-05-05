import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionComponent } from './execution.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

describe('ExecutionComponent', () => {
  let component: ExecutionComponent;
  let fixture: ComponentFixture<ExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
