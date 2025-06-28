import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { BonLivraison } from './bon-livraison.model';

@Injectable({
  providedIn: 'root',
})
export class BonLivraisonService {
  private apiUrl = 'http://localhost:3000/bonlivraison'; // your backend URL

  constructor(private http: HttpClient) {}

  getAll(): Observable<BonLivraison[]> {
    return this.http.get<BonLivraison[]>(this.apiUrl);
  }

  getById(id: number): Observable<BonLivraison> {
    return this.http.get<BonLivraison>(`${this.apiUrl}/${id}`);
  }

  create(bon: BonLivraison): Observable<BonLivraison> {
    return this.http.post<BonLivraison>(this.apiUrl, bon);
  }

  update(id: number, bon: BonLivraison): Observable<BonLivraison> {
    return this.http.put<BonLivraison>(`${this.apiUrl}/${id}`, bon);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
