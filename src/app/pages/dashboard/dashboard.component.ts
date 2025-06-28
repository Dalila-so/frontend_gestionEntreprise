import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  cards = [
    { title: 'Total Clients', value: 0, description: 'Clients enregistrés', color: 'primary', icon: 'bi-people' },
    { title: 'Commandes Aujourd’hui', value: 0, description: 'Commandes du jour', color: 'success', icon: 'bi-cart-check' },
    { title: 'Revenu Mensuel', value: '€0', description: 'Chiffre d’affaires', color: 'warning', icon: 'bi-currency-euro' }
  ];

  commandesParMois: { month: string; count: number }[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.cards[0].value = data.totalClients;
        this.cards[1].value = data.ordersToday;
        this.cards[2].value = `€${data.revenue}`;
        this.commandesParMois = data.ordersPerMonth || [];
      },
      error: (err) => {
        console.error('Erreur récupération données dashboard', err);
      }
    });
  }
}
