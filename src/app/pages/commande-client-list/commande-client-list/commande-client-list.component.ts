import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

/* ---------------- Mock master data models ---------------- */
interface Article  { id: number; name: string; unitPrice: number; }
interface Client   { id: number; name: string; }
interface Category { id: number; name: string; }

interface CommandeLine {
  articleId: number;
  quantity:  number;
  unitPrice: number;
}

interface CommandeClient {
  id:          number;
  date:        string;
  categorieId: number;
  orderNumber: string;
  objet:       string;
  clientId:    number;
  reference:   string;
  lines:       CommandeLine[];
}

@Component({
  standalone: true,
  selector   : 'app-commande-client-list',
  templateUrl: './commande-client-list.component.html',
  styleUrls  : ['./commande-client-list.component.css'],
  imports    : [CommonModule, FormsModule]
})
export class CommandeClientListComponent {
  /* ---------------- Mock master data ---------------- */
  categories: Category[] = [
    { id: 1, name: 'Informatique' },
    { id: 2, name: 'Bureautique' }
  ];
  clients: Client[] = [
    { id: 1, name: 'ACME Corp.' },
    { id: 2, name: 'Beta Ltd.' }
  ];
  articles: Article[] = [
    { id: 1, name: 'Clavier', unitPrice: 25 },
    { id: 2, name: 'Souris',  unitPrice: 10 },
    { id: 3, name: 'Écran',   unitPrice: 180 }
  ];

  /* ---------------- Component state ---------------- */
  commandes: CommandeClient[] = [];
  newCmd:    CommandeClient   = this.emptyCmd();
  line:      CommandeLine     = { articleId: 0, quantity: 1, unitPrice: 0 };

  isEdit        = false;
  nextId        = 1;
  showModal     = false;
  showViewModal = false;
  viewData: CommandeClient | null = null;

  /* ---------------- Filters ---------------- */
  filterClientId    = 0;
  filterCategorieId = 0;
  filterDate        = '';

  /* ---------------- Helpers ---------------- */
  private emptyCmd(): CommandeClient {
    return {
      id: 0,
      date: '',
      categorieId: 0,
      orderNumber: '',
      objet: '',
      clientId: 0,
      reference: '',
      lines: []
    };
  }

  private articleById = (id: number) => this.articles.find(a => a.id === id);
  getArticleName = (id: number) => this.articleById(id)?.name ?? '—';
  getCategoryName= (id: number) => this.categories.find(c => c.id === id)?.name ?? '—';
  clientName     = (id: number) => this.clients.find(c => c.id === id)?.name  ?? '—';

  /* ---------------- Totals ---------------- */
  lineTotal      = (l: CommandeLine)  => l.unitPrice * l.quantity;
  totalCmdAmount = (c: CommandeClient)=> c.lines.reduce((s,l)=>s+this.lineTotal(l),0);
  grandTotal     = () => this.totalCmdAmount(this.newCmd);

  /* ---------------- Filtered list ---------------- */
  get filteredCmds(): CommandeClient[] {
    return this.commandes.filter(c =>
      (this.filterClientId    === 0 || c.clientId    === this.filterClientId) &&
      (this.filterCategorieId === 0 || c.categorieId === this.filterCategorieId) &&
      (!this.filterDate || c.date === this.filterDate)
    );
  }

  /* ---------------- Line ops ---------------- */
  onArticleChange() {
    const a = this.articleById(this.line.articleId);
    this.line.unitPrice = a?.unitPrice ?? 0;
  }
  addLine() {
    if (!this.line.articleId || this.line.quantity <= 0) return;
    this.newCmd.lines.push({ ...this.line });
    this.line = { articleId: 0, quantity: 1, unitPrice: 0 };
  }
  removeLine(l: CommandeLine) {
    this.newCmd.lines = this.newCmd.lines.filter(x => x !== l);
  }

  /* ---------------- Modal ---------------- */
  openModal() {
    this.showModal = true;
    document.body.classList.add('modal-open');
  }
  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
    this.resetCmd();
  }

  saveCmd(form: NgForm) {
    const c = this.newCmd;
    if (!c.date || c.categorieId === 0 || c.clientId === 0) return;

    if (this.isEdit) {
      const idx = this.commandes.findIndex(x => x.id === c.id);
      if (idx !== -1) this.commandes[idx] = { ...c };
    } else {
      this.commandes.push({ ...c, id: this.nextId++ });
    }

    form.resetForm();
    this.closeModal();
  }

  editCmd(c: CommandeClient) {
    this.newCmd = { ...c, lines: c.lines.map(l => ({ ...l })) };
    this.isEdit = true;
    this.openModal();
  }

  deleteCmd(id: number) {
    if (confirm('Supprimer cette commande ?')) {
      this.commandes = this.commandes.filter(c => c.id !== id);
      if (this.newCmd.id === id) this.resetCmd();
    }
  }

  resetCmd() {
    this.newCmd = this.emptyCmd();
    this.line   = { articleId: 0, quantity: 1, unitPrice: 0 };
    this.isEdit = false;
  }

  /* ---------------- View modal ---------------- */
  viewCmd(c: CommandeClient) {
    this.viewData = { ...c, lines: c.lines.map(l => ({ ...l })) };
    this.showViewModal = true;
    document.body.classList.add('modal-open');
  }
  closeViewModal() {
    this.showViewModal = false;
    this.viewData = null;
    document.body.classList.remove('modal-open');
  }

  /* ---------------- Quick add article ---------------- */
  addNewArticle() {
    const name = prompt('Nom du nouvel article ?');
    const priceStr = prompt('Prix unitaire ?');
    const price = priceStr ? +priceStr : 0;
    if (name && price > 0) {
      const newId = this.articles.length
        ? Math.max(...this.articles.map(a => a.id)) + 1 : 1;
      this.articles.push({ id: newId, name, unitPrice: price });
    }
  }
}
