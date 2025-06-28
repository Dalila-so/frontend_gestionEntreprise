import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonEntreeComponent } from './bon-entree.component';

describe('BonEntreeComponent', () => {
  let component: BonEntreeComponent;
  let fixture: ComponentFixture<BonEntreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonEntreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonEntreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
