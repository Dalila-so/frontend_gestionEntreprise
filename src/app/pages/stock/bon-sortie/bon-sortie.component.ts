import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { StockService } from '../../../services/stock.service';

/* ---------- Models ---------- */
interface Article {
  id: number;
  name: string;
  unitPrice: number;
}
interface Client {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
}
interface BonSortieLine {
  articleId: number;
  quantity: number;
  unitPrice: number;
}
interface BonSortie {
  id: number;
  date: string;
  categorieId: number;
  bonSortieNumber: string;
  objet: string;
  clientId: number;
  reference: string;
  lines: BonSortieLine[];
}

@Component({
  standalone: true,
  selector: 'app-bon-sortie',
  templateUrl: './bon-sortie.component.html',
  styleUrls: ['./bon-sortie.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BonSortieComponent {
 constructor(public stock: StockService) {}


  /* Master data */
  categories: Category[] = [
    { id: 1, name: 'Informatique' },
    { id: 2, name: 'Bureautique' },
  ];
  clients: Client[] = [
    { id: 1, name: 'Client A' },
    { id: 2, name: 'Client B' },
  ];
  articles: Article[] = [
    { id: 1, name: 'Clavier', unitPrice: 25 },
    { id: 2, name: 'Souris', unitPrice: 10 },
    { id: 3, name: 'Écran', unitPrice: 180 },
  ];

  bons: BonSortie[] = [];
  newBon: BonSortie = this.emptyBon();
  line: BonSortieLine = { articleId: 0, quantity: 1, unitPrice: 0 };

  isEdit = false;
  nextId = 1;
  showModal = false;
  showViewModal = false;
  viewBonData: BonSortie | null = null;

  filterClientId = 0;
  filterCategorieId = 0;
  filterDate = '';

  private emptyBon(): BonSortie {
    return {
      id: 0,
      date: '',
      categorieId: 0,
      bonSortieNumber: '',
      objet: '',
      clientId: 0,
      reference: '',
      lines: [],
    };
  }

  private articleById(id: number) {
    return this.articles.find((a) => a.id === id);
  }

  getArticleName = (id: number) => {
    const name = this.articleById(id)?.name ?? '—';
    const stock = this.stock.getStock(id);
    return `${name} (Stock: ${stock})`;
  };
  getCategoryName = (id: number) => this.categories.find((c) => c.id === id)?.name ?? '—';
  clientName = (id: number) => this.clients.find((c) => c.id === id)?.name ?? '—';

  totalBonAmount(b: BonSortie): number {
    return b.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  }
  lineTotal(l: BonSortieLine) {
    return l.unitPrice * l.quantity;
  }
  grandTotal() {
    return this.totalBonAmount(this.newBon);
  }

  get filteredBons(): BonSortie[] {
    return this.bons.filter(
      (b) =>
        (this.filterClientId === 0 || b.clientId === this.filterClientId) &&
        (this.filterCategorieId === 0 || b.categorieId === this.filterCategorieId) &&
        (!this.filterDate || b.date === this.filterDate)
    );
  }

  onArticleChange() {
    const a = this.articleById(this.line.articleId);
    this.line.unitPrice = a?.unitPrice ?? 0;
  }
  addLine() {
    if (!this.line.articleId || this.line.quantity <= 0) return;

    const available = this.stock.getStock(this.line.articleId);
    if (this.line.quantity > available) {
      alert(`Stock insuffisant ! Disponible : ${available}`);
      return;
    }

    this.newBon.lines.push({ ...this.line });
    this.line = { articleId: 0, quantity: 1, unitPrice: 0 };
  }

  removeLine(l: BonSortieLine) {
    this.newBon.lines = this.newBon.lines.filter((x) => x !== l);
  }

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
    if (!b.date || b.categorieId === 0 || b.clientId === 0) return;

    try {
      if (this.isEdit) {
        const i = this.bons.findIndex((x) => x.id === b.id);
        if (i !== -1) this.bons[i] = { ...b };
      } else {
        // Check and decrease stock
        b.lines.forEach((l) => this.stock.decrease(l.articleId, l.quantity));
        this.bons.push({ ...b, id: this.nextId++ });
      }
      form.resetForm();
      this.closeModal();
    } catch (e: any) {
      alert(e.message); // "Stock insuffisant pour cet article"
    }
  }

  editBon(b: BonSortie) {
    this.newBon = { ...b, lines: b.lines.map((l) => ({ ...l })) };
    this.isEdit = true;
    this.openModal();
  }
  deleteBon(id: number) {
    this.bons = this.bons.filter((b) => b.id !== id);
    if (this.newBon.id === id) this.resetBon();
  }
  resetBon() {
    this.newBon = this.emptyBon();
    this.line = { articleId: 0, quantity: 1, unitPrice: 0 };
    this.isEdit = false;
  }

  viewBon(b: BonSortie) {
    this.viewBonData = { ...b, lines: b.lines.map((l) => ({ ...l })) };
    this.showViewModal = true;
    document.body.classList.add('modal-open');
  }
  closeViewModal() {
    this.showViewModal = false;
    this.viewBonData = null;
    document.body.classList.remove('modal-open');
  }

  addNewArticle() {
    const name = prompt('Nom du nouvel article ?');
    const pstr = prompt('Prix unitaire ?');
    const price = pstr ? +pstr : 0;
    if (name && price > 0) {
      const newId = this.articles.length ? Math.max(...this.articles.map((a) => a.id)) + 1 : 1;
      this.articles.push({ id: newId, name, unitPrice: price });
    }
  }

  addNewCategorie() {
    const name = prompt('Nom de la nouvelle catégorie ?');
    if (name && !this.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      const newId = this.categories.length ? Math.max(...this.categories.map((c) => c.id)) + 1 : 1;
      this.categories.push({ id: newId, name });
    }
  }


}
