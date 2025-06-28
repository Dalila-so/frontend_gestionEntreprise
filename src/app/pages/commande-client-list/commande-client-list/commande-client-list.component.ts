import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CommandeClientService, CommandeClient } from '../../../services/commande-client.service';

@Component({
  selector: 'app-commande-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './commande-client-list.component.html',
  styleUrls: ['./commande-client-list.component.css'],
})
export class CommandeClientListComponent implements OnInit {
  commandes: CommandeClient[] = [];
  loading = false;
  error = '';

  constructor(
    private commandeService: CommandeClientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCommandes();
  }

  loadCommandes() {
    this.loading = true;
    this.commandeService.getAll().subscribe({
      next: data => {
        this.commandes = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load commandes';
        this.loading = false;
      },
    });
  }

  onAdd() {
    this.router.navigate(['/commandeclient/add']);
  }

  onEdit(id: number) {
    this.router.navigate(['/commandeclient/edit', id]);
  }

  onDelete(id: number) {
    if (confirm('Are you sure to delete this commande?')) {
      this.commandeService.delete(id).subscribe(() => this.loadCommandes());
    }
  }
}