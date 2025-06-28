export interface BonLivraisonItem {
  articleId: number;
  quantity: number;
  price: number;
}

export interface BonLivraison {
  id?: number;
  clientId: number;
  date: string;
  status: string;
  items: BonLivraisonItem[];
  total?: number;
}
