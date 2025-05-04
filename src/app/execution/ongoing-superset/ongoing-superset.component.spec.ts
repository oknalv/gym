import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingSupersetComponent } from './ongoing-superset.component';
import { ProgressType, WeightType } from '../../gym.model';
import { TranslateModule } from '@ngx-translate/core';

describe('OngoingSupersetComponent', () => {
  let component: OngoingSupersetComponent;
  let fixture: ComponentFixture<OngoingSupersetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingSupersetComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingSupersetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('superset', {
      id: 0,
      exercises: [
        {
          id: 0,
          type: { id: 0, name: 'name', image: undefined },
          progressType: ProgressType.repetitions,
          restingTime: 1,
          sets: [{ repetitions: 1, time: 1, weight: 1 }],
          weighted: true,
          weightType: WeightType.total,
        },
      ],
    });
    fixture.componentRef.setInput('setIndex', 0);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
