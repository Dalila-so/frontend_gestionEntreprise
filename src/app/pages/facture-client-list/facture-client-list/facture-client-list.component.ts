import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  FactureClientService,
  FactureClient,
} from '../../../services/facture-client.service';

interface Client  { id: number; name: string; }
interface Article { id: number; name: string; price: number; }
interface FactureLine { articleId: number; quantity: number; price: number; }

@Component({
  standalone: true,
  selector   : 'app-facture-client-list',
  templateUrl: './facture-client-list.component.html',
  styleUrls  : ['./facture-client-list.component.css'],
  imports    : [CommonModule, FormsModule],
})
export class FactureClientListComponent implements OnInit {

  /* ------- Mock master data ------- */
  clients: Client[] = [
    { id: 101, name: 'Alpha Inc.' },
    { id: 102, name: 'Beta SARL' },
  ];
  articles: Article[] = [
    { id: 201, name: 'Clavier', price: 25 },
    { id: 202, name: 'Souris',  price: 10 },
    { id: 203, name: 'Écran',   price: 180 },
  ];
  statuses = [ 'Paid', 'Pending', 'Cancelled' ];

  /* ------- Component state ------- */
  factures: FactureClient[] = [];
  newFacture: FactureClient = this.emptyFacture();
  line: FactureLine = { articleId: 0, quantity: 1, price: 0 };

  isEdit = false;
  showModal = false;
  showViewModal = false;
  viewData: FactureClient | null = null;

  loading = false;
  error   = '';

  /* ------- Filters ------- */
  filterClientId = 0;
  filterStatus   = '';
  filterDate     = '';

  constructor(private svc: FactureClientService) {}

  /* ---------- life‑cycle ---------- */
  ngOnInit() { this.refresh(); }

  /* ---------- helpers ---------- */
  private emptyFacture(): FactureClient {
    return {
      clientId: 0,
      date   : new Date().toISOString().slice(0,10), // today
      status : '',
      total  : 0,
      items  : []
    };
  }
  articleById = (id: number) => this.articles.find(a => a.id === id);
  clientName  = (id: number) => this.clients.find(c => c.id === id)?.name ?? '—';
  lineTotal   = (l: FactureLine) => l.price * l.quantity;
  factureTotal = (f: FactureClient) =>
    f.items.reduce((s,l) => s + this.lineTotal(l), 0);

  /* ---------- load list ---------- */
  refresh() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next : d => { this.factures = d; this.loading = false; },
      error: _ => { this.error = 'Load error'; this.loading = false; }
    });
  }
  get filteredFactures(): FactureClient[] {
    return this.factures.filter(f =>
      (this.filterClientId === 0 || f.clientId === this.filterClientId) &&
      (this.filterStatus   === '' || f.status   === this.filterStatus)   &&
      (!this.filterDate    || f.date === this.filterDate)
    );
  }

  /* ---------- line ops ---------- */
  onArticleChange() {
    const a = this.articleById(this.line.articleId);
    this.line.price = a?.price ?? 0;
  }
  addLine() {
    if (!this.line.articleId || this.line.quantity <= 0) return;
    this.newFacture.items.push({ ...this.line });
    this.line = { articleId: 0, quantity: 1, price: 0 };
  }
  removeLine(l: FactureLine) {
    this.newFacture.items = this.newFacture.items.filter(x => x !== l);
  }

  /* ---------- modal ---------- */
  openModal(isAdd = true, f?: FactureClient) {
    this.isEdit     = !isAdd;
    this.newFacture = isAdd ? this.emptyFacture()
                            : { ...f!, items: f!.items.map(x => ({ ...x })) };
    this.line       = { articleId: 0, quantity: 1, price: 0 };
    this.showModal  = true;
    document.body.classList.add('modal-open');
  }
  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
    this.newFacture = this.emptyFacture();
    this.line       = { articleId: 0, quantity: 1, price: 0 };
  }

  /* ---------- save ---------- */
  saveFacture(form: NgForm) {
    const f = { ...this.newFacture };
    f.clientId = +f.clientId;
    f.total    = this.factureTotal(f);

    if (!f.date || f.clientId === 0 || !f.status || !f.items.length) return;

    const finish = () => {
      form.resetForm();
      this.closeModal();
      this.refresh();      // single source of truth → no duplicates
    };

    if (this.isEdit && f.id) {
      this.svc.update(f.id, f).subscribe(() => finish());
    } else {
      this.svc.create(f).subscribe(() => finish());
    }
  }

  /* ---------- view ---------- */
  viewFacture(f: FactureClient) {
    this.viewData = { ...f, items: f.items.map(i => ({ ...i })) };
    this.showViewModal = true;
    document.body.classList.add('modal-open');
  }
  closeViewModal() {
    this.viewData = null;
    this.showViewModal = false;
    document.body.classList.remove('modal-open');
  }

  /* ---------- delete ---------- */
  deleteFacture(id: number) {
    if (!confirm('Supprimer cette facture ?')) return;
    this.svc.delete(id).subscribe(() => this.refresh());
  }
}
