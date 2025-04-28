import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWarningDialogComponent } from './delete-warning-dialog.component';

describe('DeleteWarningDialogComponent', () => {
  let component: DeleteWarningDialogComponent;
  let fixture: ComponentFixture<DeleteWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteWarningDialogComponent],
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

  it('should show whatToDelete text correctly', () => {
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement
        .querySelector('p')
        .innerText.indexOf('whatToDelete') > -1,
    ).toBeTrue();
    expect(
      fixture.elementRef.nativeElement
        .querySelector('p')
        .innerText.indexOf('whatToNotDelete') > -1,
    ).toBeFalse();
    fixture.componentRef.setInput('whatToDelete', 'whatToNotDelete');
    fixture.detectChanges();
    expect(
      fixture.elementRef.nativeElement
        .querySelector('p')
        .innerText.indexOf('whatToNotDelete') > -1,
    ).toBeTrue();
  });

  it('should close the modal when cancel button is pressed', () => {
    fixture.detectChanges();
    expect(component.open()).toBeTrue();
    fixture.elementRef.nativeElement
      .querySelectorAll('.actions > button')[0]
      .click();
    expect(component.open()).toBeFalse();
  });

  it('should emit delete output when delete button is pressed', () => {
    fixture.detectChanges();
    spyOn(component.delete, 'emit');
    fixture.elementRef.nativeElement
      .querySelectorAll('.actions > button')[1]
      .click();
    expect(component.delete.emit).toHaveBeenCalled();
  });
});
