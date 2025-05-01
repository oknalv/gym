import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseableWarningComponent } from './closeable-warning.component';
import { TranslateModule } from '@ngx-translate/core';

describe('CloseableWarningComponent', () => {
  let component: CloseableWarningComponent;
  let fixture: ComponentFixture<CloseableWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseableWarningComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseableWarningComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('storageKey', 'storageKey');
    fixture.componentRef.setInput('warningKey', 'warningKey');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
