import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeClientFormComponent } from './commande-client-form.component';

describe('CommandeClientFormComponent', () => {
  let component: CommandeClientFormComponent;
  let fixture: ComponentFixture<CommandeClientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeClientFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
