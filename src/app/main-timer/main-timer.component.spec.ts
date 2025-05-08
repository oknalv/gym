import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTimerComponent } from './main-timer.component';
import { TranslateModule } from '@ngx-translate/core';

describe('MainTimerComponent', () => {
  let component: MainTimerComponent;
  let fixture: ComponentFixture<MainTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainTimerComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MainTimerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
