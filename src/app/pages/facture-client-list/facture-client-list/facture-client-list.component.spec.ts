import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureClientListComponent } from './facture-client-list.component';

describe('FactureClientListComponent', () => {
  let component: FactureClientListComponent;
  let fixture: ComponentFixture<FactureClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureClientListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
