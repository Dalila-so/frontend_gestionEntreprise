import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private stockMap: Record<number, number> = {}; // { articleId: quantity }

  increase(articleId: number, quantity: number): void {
    if (!this.stockMap[articleId]) this.stockMap[articleId] = 0;
    this.stockMap[articleId] += quantity;
  }

  decrease(articleId: number, quantity: number): void {
    const current = this.stockMap[articleId] ?? 0;
    if (current < quantity) {
      throw new Error('Stock insuffisant pour cet article');
    }
    this.stockMap[articleId] -= quantity;
  }

  getStock(articleId: number): number {
    return this.stockMap[articleId] ?? 0;
  }

  getAllStock(): Record<number, number> {
    return this.stockMap;
  }
   reset() {
    this.stockMap = {};
  }
}
