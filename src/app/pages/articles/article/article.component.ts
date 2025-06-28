import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface Article {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Movement {
  date: string;
  quantity: number;
  operation: 'entrée' | 'sortie';
  warehouse: string;
  articleId: number;
}

@Component({
  standalone: true,
  selector: 'app-article',
  imports: [CommonModule, FormsModule],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent {
  searchTerm = '';
  showModal = false;
  showMovementModal = false;
  selectedArticle: Article | null = null;

  articles: Article[] = [
    { id: 1, name: 'Keyboard', price: 29.99, stock: 100 },
    { id: 2, name: 'Mouse',    price: 15.5,  stock: 60  },
    { id: 3, name: 'Monitor',  price: 220.0, stock: 25  }
  ];

  movements: Movement[] = [
    { date: '2025-06-25', quantity: 10, operation: 'entrée', warehouse: 'Central', articleId: 1 },
    { date: '2025-06-26', quantity: 5,  operation: 'sortie', warehouse: 'North',   articleId: 1 },
    { date: '2025-06-27', quantity: 2,  operation: 'entrée', warehouse: 'West',    articleId: 2 }
  ];

  newArticle: Article = { id: 0, name: '', price: 0, stock: 0 };
  nextId = 4;
  isEditMode = false;

  openModal(edit?: boolean, article?: Article) {
    if (edit && article) {
      this.newArticle = { ...article };
      this.isEditMode = true;
    } else {
      this.resetForm();
    }
    this.showModal = true;
  }
  closeModal(form?: NgForm) {
    this.showModal = false;
    if (form) form.resetForm();
    this.resetForm();
  }

  openMovementModal(article: Article) {
    this.selectedArticle = article;
    this.showMovementModal = true;
  }

  closeMovementModal() {
    this.selectedArticle = null;
    this.showMovementModal = false;
  }

  filteredArticles(): Article[] {
    const term = this.searchTerm.trim().toLowerCase();
    return term
      ? this.articles.filter(a => a.name.toLowerCase().includes(term))
      : this.articles;
  }

  get totalArticles(): number {
    return this.articles.length;
  }
  get totalStock(): number {
    return this.articles.reduce((sum, a) => sum + a.stock, 0);
  }
  get totalValue(): number {
    return this.articles.reduce((sum, a) => sum + a.stock * a.price, 0);
  }

  saveArticle(form: NgForm) {
    if (!this.newArticle.name.trim()) return;
    if (this.isEditMode) {
      const idx = this.articles.findIndex(a => a.id === this.newArticle.id);
      if (idx !== -1) this.articles[idx] = { ...this.newArticle };
    } else {
      this.articles.push({ ...this.newArticle, id: this.nextId++ });
    }
    this.closeModal(form);
  }

  editArticle(a: Article) {
    this.openModal(true, a);
  }

  deleteArticle(id: number) {
    this.articles = this.articles.filter(a => a.id !== id);
  }

  cancelEdit(form: NgForm) {
    this.closeModal(form);
  }

  resetForm() {
    this.newArticle = { id: 0, name: '', price: 0, stock: 0 };
    this.isEditMode = false;
  }

  getArticleMovements(articleId: number): Movement[] {
    return this.movements.filter(m => m.articleId === articleId);
  }
}
