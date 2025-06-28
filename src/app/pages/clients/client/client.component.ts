import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface FactureClient {
  id: number;
  clientId: number;
  date: string;
  amount: number;
}

interface CommandeClient {
  id: number;
  clientId: number;
  date: string;
  status: string;
}

@Component({
  standalone: true,
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ClientComponent {
  searchTerm: string = '';
  selectedClient: Client | null = null;
  showDetailsModal = false;

  isEdit = false;
  newClient: Client = { id: 0, name: '', email: '', phone: '' };
  nextId = 3;

  clients: Client[] = [
    { id: 1, name: 'Alpha Inc.', email: 'alpha@example.com', phone: '1234567890' },
    { id: 2, name: 'Beta SARL',  email: 'beta@example.com',  phone: '0987654321' }
  ];

  factures: FactureClient[] = [
    { id: 1, clientId: 1, date: '2025-06-01', amount: 1500 },
    { id: 2, clientId: 2, date: '2025-06-15', amount: 2300 }
  ];

  commandes: CommandeClient[] = [
    { id: 1, clientId: 1, date: '2025-05-20', status: 'Livrée' },
    { id: 2, clientId: 2, date: '2025-06-10', status: 'En attente' }
  ];

  // --- helpers ---
  filteredClients(): Client[] {
    const term = this.searchTerm.trim().toLowerCase();
    return term ? this.clients.filter(c => c.name.toLowerCase().includes(term)) : this.clients;
  }

  getClientFactures(id: number): FactureClient[] {
    return this.factures.filter(f => f.clientId === id);
  }

  getClientCommandes(id: number): CommandeClient[] {
    return this.commandes.filter(c => c.clientId === id);
  }

  // --- modal controls ---
  openDetails(client: Client) {
    this.selectedClient = client;
    this.showDetailsModal = true;
  }

  closeDetails() {
    this.selectedClient = null;
    this.showDetailsModal = false;
  }

  // --- CRUD actions ---
  addOrUpdateClient(form: NgForm) {
    if (this.isEdit) {
      const index = this.clients.findIndex(c => c.id === this.newClient.id);
      if (index !== -1) this.clients[index] = { ...this.newClient };
    } else {
      this.clients.push({ ...this.newClient, id: this.nextId++ });
    }
    form.resetForm();
    this.resetForm();
  }

  editClient(client: Client) {
    this.newClient = { ...client };
    this.isEdit = true;
  }

  deleteClient(id: number) {
    this.clients = this.clients.filter(c => c.id !== id);
    if (this.newClient.id === id) this.resetForm();
  }

  cancelEdit(form?: NgForm) {
    if (form) form.resetForm();
    this.resetForm();
  }

  private resetForm() {
    this.newClient = { id: 0, name: '', email: '', phone: '' };
    this.isEdit = false;
  }
}
