import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface Fournisseur {
  id: number;
  name: string;
  email: string;
  phone: string;  // Added phone here
}

interface FactureFournisseur {
  id: number;
  fournisseurId: number;
  date: string;
  amount: number;
}

interface CommandeFournisseur {
  id: number;
  fournisseurId: number;
  date: string;
  status: string;
}

@Component({
  standalone: true,
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css'],
  imports: [CommonModule, FormsModule],
})
export class FournisseurComponent {
  searchTerm: string = '';
  selectedFournisseur: Fournisseur | null = null;
  showDetailsModal = false;

  isEdit = false;
  newFournisseur: Fournisseur = { id: 0, name: '', email: '', phone: '' };
  nextId = 3;

  fournisseurs: Fournisseur[] = [
    { id: 1, name: 'Gamma SARL', email: 'gamma@example.com', phone: '0123456789' },
    { id: 2, name: 'Delta SAS', email: 'delta@example.com', phone: '0987654321' }
  ];

  factures: FactureFournisseur[] = [
    { id: 1, fournisseurId: 1, date: '2025-06-05', amount: 1200 },
    { id: 2, fournisseurId: 2, date: '2025-06-20', amount: 2800 }
  ];

  commandes: CommandeFournisseur[] = [
    { id: 1, fournisseurId: 1, date: '2025-05-25', status: 'Reçue' },
    { id: 2, fournisseurId: 2, date: '2025-06-12', status: 'En cours' }
  ];

  // --- helpers ---
  filteredFournisseurs(): Fournisseur[] {
    const term = this.searchTerm.trim().toLowerCase();
    return term ? this.fournisseurs.filter(f => f.name.toLowerCase().includes(term)) : this.fournisseurs;
  }

  getFournisseurFactures(id: number): FactureFournisseur[] {
    return this.factures.filter(f => f.fournisseurId === id);
  }

  getFournisseurCommandes(id: number): CommandeFournisseur[] {
    return this.commandes.filter(c => c.fournisseurId === id);
  }

  // --- modal controls ---
  openDetails(fournisseur: Fournisseur) {
    this.selectedFournisseur = fournisseur;
    this.showDetailsModal = true;
  }

  closeDetails() {
    this.selectedFournisseur = null;
    this.showDetailsModal = false;
  }

  // --- CRUD actions ---
  addOrUpdateFournisseur(form: NgForm) {
    if (this.isEdit) {
      const index = this.fournisseurs.findIndex(f => f.id === this.newFournisseur.id);
      if (index !== -1) this.fournisseurs[index] = { ...this.newFournisseur };
    } else {
      this.fournisseurs.push({ ...this.newFournisseur, id: this.nextId++ });
    }
    form.resetForm();
    this.resetForm();
  }

  editFournisseur(fournisseur: Fournisseur) {
    this.newFournisseur = { ...fournisseur };
    this.isEdit = true;
  }

  deleteFournisseur(id: number) {
    this.fournisseurs = this.fournisseurs.filter(f => f.id !== id);
    if (this.newFournisseur.id === id) this.resetForm();
  }

  cancelEdit(form?: NgForm) {
    if (form) form.resetForm();
    this.resetForm();
  }

  private resetForm() {
    this.newFournisseur = { id: 0, name: '', email: '', phone: '' };
    this.isEdit = false;
  }
}
