import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface Depot {
  id: number;
  name: string;
  location: string;
}

@Component({
  standalone: true,
  selector: 'app-depot',
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DepotComponent {
  depots: Depot[] = [
    { id: 1, name: 'Main Warehouse', location: 'City Center' },
    { id: 2, name: 'Backup Storage', location: 'Industrial Zone' }
  ];

  newDepot: Depot = { id: 0, name: '', location: '' };
  nextId = 3;
  isEditMode = false;

  addDepot(form: NgForm) {
    if (!this.newDepot.name.trim()) return;

    if (this.isEditMode) {
      const i = this.depots.findIndex(d => d.id === this.newDepot.id);
      if (i !== -1) this.depots[i] = { ...this.newDepot };
    } else {
      this.depots.push({ ...this.newDepot, id: this.nextId++ });
    }

    form.resetForm();
    this.resetForm();
  }

  editDepot(d: Depot) {
    this.newDepot = { ...d };
    this.isEditMode = true;
  }

  delete(id: number) {
    this.depots = this.depots.filter(d => d.id !== id);
    if (this.newDepot.id === id) this.resetForm();
  }

  resetForm() {
    this.newDepot = { id: 0, name: '', location: '' };
    this.isEditMode = false;
  }
}
