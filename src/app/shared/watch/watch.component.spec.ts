import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchComponent } from './watch.component';

describe('WatchComponent', () => {
  let component: WatchComponent;
  let fixture: ComponentFixture<WatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('time', {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
