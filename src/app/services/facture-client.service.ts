import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface FactureClient {
  id?: number;
  clientId: number;
  date: string;
  status: string;
  total: number;
  items: Array<{ articleId: number; quantity: number; price: number }>;
}

@Injectable({ providedIn: 'root' })
export class FactureClientService {
  private factures: FactureClient[] = [
    {
      id: 1,
      clientId: 101,
      date: '2025-06-01',
      status: 'Paid',
      total: 1500,
      items: [
        { articleId: 201, quantity: 2, price: 500 },
        { articleId: 202, quantity: 1, price: 500 },
      ],
    },
    // …more seed data
  ];

  getAll(): Observable<FactureClient[]> { return of(this.factures).pipe(delay(500)); }
  getById(id: number): Observable<FactureClient> { return of(this.factures.find(f => f.id === id)!).pipe(delay(300)); }
  create(f: FactureClient): Observable<FactureClient> { f.id = Math.max(0, ...this.factures.map(x => x.id!))+1; this.factures.push(f); return of(f).pipe(delay(300)); }
  update(id: number, f: FactureClient): Observable<FactureClient> { const i = this.factures.findIndex(x => x.id===id); this.factures[i] = { ...f, id }; return of(this.factures[i]).pipe(delay(300)); }
  delete(id: number) { this.factures = this.factures.filter(f => f.id!==id); return of(void 0).pipe(delay(300)); }
}