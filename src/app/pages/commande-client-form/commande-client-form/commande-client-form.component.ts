import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommandeClientService, CommandeClient } from '../../../services/commande-client.service';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-commande-client-form',
  templateUrl: './commande-client-form.component.html',
  styleUrls: ['./commande-client-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class CommandeClientFormComponent implements OnInit {
  commandeForm!: FormGroup;
  isEditMode = false;
  commandeId?: number;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private commandeService: CommandeClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.commandeForm = this.fb.group({
      clientId: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required],
      items: this.fb.array([]),
    });

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.commandeId = +params['id'];
        this.loadCommande(this.commandeId);
      } else {
        this.addItem();
      }
    });
  }

  get items(): FormArray {
    return this.commandeForm.get('items') as FormArray;
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

  loadCommande(id: number) {
    this.loading = true;
    this.commandeService.getById(id).subscribe({
      next: (data) => {
        this.commandeForm.patchValue({
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
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading commande';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.commandeForm.invalid) {
      this.commandeForm.markAllAsTouched();
      return;
    }

    const commande: CommandeClient = {
      clientId: this.commandeForm.value.clientId,
      date: this.commandeForm.value.date,
      status: this.commandeForm.value.status,
      items: this.commandeForm.value.items,
    };

    if (this.isEditMode && this.commandeId) {
      this.commandeService.update(this.commandeId, commande).subscribe({
        next: () => this.router.navigate(['/commandeclient']),
        error: () => (this.error = 'Error updating commande'),
      });
    } else {
      this.commandeService.create(commande).subscribe({
        next: () => this.router.navigate(['/commandeclient']),
        error: () => (this.error = 'Error creating commande'),
      });
    }
  }

  onCancel() {
    this.router.navigate(['/commandeclient']);
  }
}
