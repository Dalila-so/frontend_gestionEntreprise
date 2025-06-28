import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FactureClientService, FactureClient } from '../../services/facture-client.service';
import { ClientService, Client } from '../../services/client.service';
import { ArticleService, Article } from '../../services/article.service';
@Component({
  selector: 'app-facture-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './facture-client-form.component.html',
  styleUrls: ['./facture-client-form.component.css'],
})
export class FactureClientFormComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  id?: number;
  error = '';

clients: Client[] = [];
  articles: Article[] = [];

  constructor(
    private fb: FormBuilder,
    private svc: FactureClientService,
    private clientService: ClientService,
    private articleService: ArticleService,
    private router: Router,
    private ar: ActivatedRoute
  ) {}

  ngOnInit() {
    // Load clients and articles for selects
    this.clientService.getAll().subscribe(clients => (this.clients = clients));
    this.articleService.getAll().subscribe(articles => (this.articles = articles));

    // Initialize form
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required],
      items: this.fb.array([]),
    });

    // Load facture data if editing
    this.ar.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.id = +params['id'];
        this.load();
      } else {
        this.addItem();
      }
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    this.items.push(
      this.fb.group({
        articleId: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        price: [0, [Validators.required, Validators.min(0)]],
      })
    );
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  load() {
    if (!this.id) return;
    this.svc.getById(this.id).subscribe({
      next: (data) => {
        this.form.patchValue({
          clientId: data.clientId,
          date: data.date,
          status: data.status,
        });
        this.items.clear();
        data.items.forEach((item) => {
          this.items.push(
            this.fb.group({
              articleId: [item.articleId, Validators.required],
              quantity: [item.quantity, [Validators.required, Validators.min(1)]],
              price: [item.price, [Validators.required, Validators.min(0)]],
            })
          );
        });
      },
      error: () => {
        this.error = 'Failed to load facture data';
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const facture: FactureClient = {
      ...this.form.value,
      total: this.total(),
    };

    const obs = this.editMode ? this.svc.update(this.id!, facture) : this.svc.create(facture);
    obs.subscribe({
      next: () => this.router.navigate(['/factureclient']),
      error: () => (this.error = 'Failed to save facture'),
    });
  }

  total(): number {
    return this.items.controls.reduce((sum, ctrl) => {
      const val = ctrl.value;
      const quantity = val.quantity || 0;
      const price = val.price || 0;
      return sum + quantity * price;
    }, 0);
  }

  onCancel() {
    this.router.navigate(['/factureclient']);
  }
}