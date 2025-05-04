import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupersetOptionComponent } from './superset-option.component';
import { ProgressType, WeightType } from '../../gym.model';
import { TranslateModule } from '@ngx-translate/core';

describe('SupersetOptionComponent', () => {
  let component: SupersetOptionComponent;
  let fixture: ComponentFixture<SupersetOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupersetOptionComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SupersetOptionComponent);
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
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
