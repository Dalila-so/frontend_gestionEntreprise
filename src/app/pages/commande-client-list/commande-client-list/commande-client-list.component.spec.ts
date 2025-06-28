import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeClientListComponent } from './commande-client-list.component';

describe('CommandeClientListComponent', () => {
  let component: CommandeClientListComponent;
  let fixture: ComponentFixture<CommandeClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeClientListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
