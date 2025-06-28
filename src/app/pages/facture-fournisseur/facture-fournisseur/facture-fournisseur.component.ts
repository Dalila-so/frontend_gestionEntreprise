import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface Article { id: number; name: string; unitPrice: number; }
interface Supplier { id: number; name: string; }
interface FactureFournisseurLine {
  articleId: number;
  quantity: number;
  unitPrice: number;
}
interface FactureFournisseur {
  id: number;
  date: string;
  supplierId: number;
  invoiceNumber: string;
  reference: string;
  lines: FactureFournisseurLine[];
}

@Component({
  standalone: true,
  selector: 'app-facture-fournisseur',
  templateUrl: './facture-fournisseur.component.html',
  styleUrls: ['./facture-fournisseur.component.css'],
  imports: [CommonModule, FormsModule],
})
export class FactureFournisseurComponent {
  // Mock master data
  suppliers: Supplier[] = [
    { id: 1, name: 'Fournisseur Alpha' },
    { id: 2, name: 'Fournisseur Beta' },
  ];
  articles: Article[] = [
    { id: 1, name: 'Article A', unitPrice: 15 },
    { id: 2, name: 'Article B', unitPrice: 30 },
    { id: 3, name: 'Article C', unitPrice: 50 },
  ];

  // State
  factures: FactureFournisseur[] = [];
  newFacture: FactureFournisseur = this.emptyFacture();
  line: FactureFournisseurLine = { articleId: 0, quantity: 1, unitPrice: 0 };

  isEdit = false;
  nextId = 1;
  showModal = false;
  showViewModal = false;
  viewFactureData: FactureFournisseur | null = null;

  // Filters
  filterSupplierId = 0;
  filterDate = '';

  // Helpers
  private emptyFacture(): FactureFournisseur {
    return {
      id: 0,
      date: '',
      supplierId: 0,
      invoiceNumber: '',
      reference: '',
      lines: [],
    };
  }

  private articleById = (id: number) => this.articles.find(a => a.id === id);
  getArticleName = (id: number) => this.articleById(id)?.name ?? '—';
  supplierName = (id: number) => this.suppliers.find(s => s.id === id)?.name ?? '—';

  // Totals
  lineTotal = (l: FactureFournisseurLine) => l.unitPrice * l.quantity;
  totalFactureAmount = (f: FactureFournisseur) => f.lines.reduce((sum, l) => sum + this.lineTotal(l), 0);
  grandTotal = () => this.totalFactureAmount(this.newFacture);

  // Filtered list
  get filteredFactures(): FactureFournisseur[] {
    return this.factures.filter(f =>
      (this.filterSupplierId === 0 || f.supplierId === this.filterSupplierId) &&
      (!this.filterDate || f.date === this.filterDate)
    );
  }

  // Line operations
  onArticleChange() {
    const a = this.articleById(this.line.articleId);
    this.line.unitPrice = a?.unitPrice ?? 0;
  }

  addLine() {
    if (!this.line.articleId || this.line.quantity <= 0) return;
    this.newFacture.lines.push({ ...this.line });
    this.line = { articleId: 0, quantity: 1, unitPrice: 0 };
  }

  removeLine(l: FactureFournisseurLine) {
    this.newFacture.lines = this.newFacture.lines.filter(x => x !== l);
  }

  // Modal handlers
  openModal() {
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
    this.resetFacture();
  }

  saveFacture(form: NgForm) {
    const f = this.newFacture;
    if (!f.date || f.supplierId === 0) return;

    if (this.isEdit) {
      const idx = this.factures.findIndex(x => x.id === f.id);
      if (idx !== -1) this.factures[idx] = { ...f };
    } else {
      this.factures.push({ ...f, id: this.nextId++ });
    }

    form.resetForm();
    this.closeModal();
  }

  editFacture(f: FactureFournisseur) {
    this.newFacture = { ...f, lines: f.lines.map(l => ({ ...l })) };
    this.isEdit = true;
    this.openModal();
  }

  deleteFacture(id: number) {
    if (confirm('Supprimer cette facture ?')) {
      this.factures = this.factures.filter(f => f.id !== id);
      if (this.newFacture.id === id) this.resetFacture();
    }
  }

  resetFacture() {
    this.newFacture = this.emptyFacture();
    this.line = { articleId: 0, quantity: 1, unitPrice: 0 };
    this.isEdit = false;
  }

  // View modal
  viewFacture(f: FactureFournisseur) {
    this.viewFactureData = { ...f, lines: f.lines.map(l => ({ ...l })) };
    this.showViewModal = true;
    document.body.classList.add('modal-open');
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewFactureData = null;
    document.body.classList.remove('modal-open');
  }

  // Quick add article
  addNewArticle() {
    const name = prompt('Nom du nouvel article ?');
    const priceStr = prompt('Prix unitaire ?');
    const price = priceStr ? +priceStr : 0;
    if (name && price > 0) {
      const newId = this.articles.length ? Math.max(...this.articles.map(a => a.id)) + 1 : 1;
      this.articles.push({ id: newId, name, unitPrice: price });
    }
  }
}
