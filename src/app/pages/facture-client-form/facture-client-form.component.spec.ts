import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureClientFormComponent } from './facture-client-form.component';

describe('FactureClientFormComponent', () => {
  let component: FactureClientFormComponent;
  let fixture: ComponentFixture<FactureClientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureClientFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
