// bon-livraison.component.ts (clean version: no stock mutations or try/catch)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface Article { id: number; name: string; unitPrice: number; }
interface Supplier { id: number; name: string; }
interface Category { id: number; name: string; }
interface BonLivraisonLine {
  articleId: number;
  quantity: number;
  unitPrice: number;
}
interface BonLivraison {
  id: number;
  date: string;
  categorieId: number;
  bonNumber: string;
  objet: string;
  supplierId: number;
  reference: string;
  lines: BonLivraisonLine[];
}

@Component({
  standalone: true,
  selector: 'app-bon-livraison',
  templateUrl: './bon-livraison.component.html',
  styleUrls: ['./bon-livraison.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BonLivraisonComponent {
  /* ------------------------------ Mock master data ------------------------------ */
  categories: Category[] = [
    { id: 1, name: 'Informatique' },
    { id: 2, name: 'Bureautique' }
  ];
  suppliers: Supplier[] = [
    { id: 1, name: 'TechSupplier SARL' },
    { id: 2, name: 'Office Pro Ltd.' }
  ];
  articles: Article[] = [
    { id: 1, name: 'Clavier', unitPrice: 25 },
    { id: 2, name: 'Souris', unitPrice: 10 },
    { id: 3, name: 'Écran', unitPrice: 180 }
  ];

  /* ------------------------------ State ------------------------------ */
  bons: BonLivraison[] = [];
  newBon: BonLivraison = this.emptyBon();
  line: BonLivraisonLine = { articleId: 0, quantity: 1, unitPrice: 0 };

  isEdit = false;
  nextId = 1;
  showModal = false;
  showViewModal = false;
  viewBonData: BonLivraison | null = null;

  /* ------------------------------ Filters ------------------------------ */
  filterSupplierId = 0;
  filterCategorieId = 0;
  filterDate = '';

  /* ------------------------------ Helpers ------------------------------ */
  private emptyBon(): BonLivraison {
    return {
      id: 0,
      date: '',
      categorieId: 0,
      bonNumber: '',
      objet: '',
      supplierId: 0,
      reference: '',
      lines: []
    };
  }

  private articleById = (id: number) => this.articles.find(a => a.id === id);
  getArticleName = (id: number) => this.articleById(id)?.name ?? '—';
  getCategoryName = (id: number) => this.categories.find(c => c.id === id)?.name ?? '—';
  supplierName = (id: number) => this.suppliers.find(s => s.id === id)?.name ?? '—';

  /* ------------------------------ Totals ------------------------------ */
  lineTotal = (l: BonLivraisonLine) => l.unitPrice * l.quantity;
  totalBonAmount = (b: BonLivraison) => b.lines.reduce((sum, l) => sum + this.lineTotal(l), 0);
  grandTotal = () => this.totalBonAmount(this.newBon);

  /* ------------------------------ Filtered list ------------------------------ */
  get filteredBons(): BonLivraison[] {
    return this.bons.filter(b =>
      (this.filterSupplierId === 0 || b.supplierId === this.filterSupplierId) &&
      (this.filterCategorieId === 0 || b.categorieId === this.filterCategorieId) &&
      (!this.filterDate || b.date === this.filterDate)
    );
  }

  /* ------------------------------ Line operations ------------------------------ */
  onArticleChange() {
    const a = this.articleById(this.line.articleId);
    this.line.unitPrice = a?.unitPrice ?? 0;
  }

  addLine() {
    if (!this.line.articleId || this.line.quantity <= 0) return;
    this.newBon.lines.push({ ...this.line });
    this.line = { articleId: 0, quantity: 1, unitPrice: 0 };
  }

  removeLine(l: BonLivraisonLine) {
    this.newBon.lines = this.newBon.lines.filter(x => x !== l);
  }

  /* ------------------------------ Modal handlers ------------------------------ */
  openModal() {
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
    this.resetBon();
  }

  saveBon(form: NgForm) {
    const b = this.newBon;
    if (!b.date || b.categorieId === 0 || b.supplierId === 0) return;

    if (this.isEdit) {
      const idx = this.bons.findIndex(x => x.id === b.id);
      if (idx !== -1) this.bons[idx] = { ...b };
    } else {
      this.bons.push({ ...b, id: this.nextId++ });
    }

    form.resetForm();
    this.closeModal();
  }

  editBon(b: BonLivraison) {
    this.newBon = { ...b, lines: b.lines.map(l => ({ ...l })) };
    this.isEdit = true;
    this.openModal();
  }

  deleteBon(id: number) {
    if (confirm('Supprimer ce bon ?')) {
      this.bons = this.bons.filter(b => b.id !== id);
      if (this.newBon.id === id) this.resetBon();
    }
  }

  resetBon() {
    this.newBon = this.emptyBon();
    this.line = { articleId: 0, quantity: 1, unitPrice: 0 };
    this.isEdit = false;
  }

  /* ------------------------------ View modal ------------------------------ */
  viewBon(b: BonLivraison) {
    this.viewBonData = { ...b, lines: b.lines.map(l => ({ ...l })) };
    this.showViewModal = true;
    document.body.classList.add('modal-open');
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewBonData = null;
    document.body.classList.remove('modal-open');
  }

  /* ------------------------------ Quick add article ------------------------------ */
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
