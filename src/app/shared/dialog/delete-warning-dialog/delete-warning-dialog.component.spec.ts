import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWarningDialogComponent } from './delete-warning-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DeleteWarningDialogComponent', () => {
  let component: DeleteWarningDialogComponent;
  let fixture: ComponentFixture<DeleteWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteWarningDialogComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('whatToDelete', 'whatToDelete');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should close the modal when cancel button is pressed', () => {
    fixture.detectChanges();
    expect(component.open()).toBeTrue();
    fixture.elementRef.nativeElement
      .querySelectorAll('.dialog-actions > button')[0]
      .click();
    expect(component.open()).toBeFalse();
  });

  it('should emit delete output when delete button is pressed', () => {
    fixture.detectChanges();
    spyOn(component.delete, 'emit');
    fixture.elementRef.nativeElement
      .querySelectorAll('.dialog-actions > button')[1]
      .click();
    expect(component.delete.emit).toHaveBeenCalled();
  });
});
