import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface CommandeClient {
  id?: number;
  clientId: number;
  date: string;
  status: string;
  items: Array<{ articleId: number; quantity: number; price: number }>;
}

@Injectable({
  providedIn: 'root',
})
export class CommandeClientService {
  private commandes: CommandeClient[] = [
    {
      id: 1,
      clientId: 101,
      date: '2025-06-05',
      status: 'Shipped',
      items: [
        { articleId: 201, quantity: 3, price: 100 },
        { articleId: 202, quantity: 1, price: 200 },
      ],
    },
    {
      id: 2,
      clientId: 103,
      date: '2025-06-10',
      status: 'Pending',
      items: [{ articleId: 203, quantity: 2, price: 150 }],
    },
  ];

  constructor() {}

  getAll(): Observable<CommandeClient[]> {
    return of(this.commandes).pipe(delay(500));
  }

  getById(id: number): Observable<CommandeClient> {
    const commande = this.commandes.find((c) => c.id === id);
    return of(commande!).pipe(delay(300));
  }

  create(commande: CommandeClient): Observable<CommandeClient> {
    commande.id = this.commandes.length ? Math.max(...this.commandes.map((c) => c.id!)) + 1 : 1;
    this.commandes.push(commande);
    return of(commande).pipe(delay(300));
  }

  update(id: number, commande: CommandeClient): Observable<CommandeClient> {
    const index = this.commandes.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.commandes[index] = { ...commande, id };
      return of(this.commandes[index]).pipe(delay(300));
    }
    throw new Error('Commande not found');
  }

  delete(id: number): Observable<void> {
    this.commandes = this.commandes.filter((c) => c.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
