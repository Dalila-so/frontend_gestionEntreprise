import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app/app.component';
import { LayoutComponent } from './app/layout.component';
import { LoginComponent } from './app/pages/login/login.component';
import { SignupComponent } from './app/pages/signup/signup.component';
import { ArticleComponent } from './app/pages/articles/article/article.component';
import { ClientComponent } from './app/pages/clients/client/client.component';
import { BonSortieComponent } from './app/pages/stock/bon-sortie/bon-sortie.component';
import { FactureClientListComponent } from './app/pages/facture-client-list/facture-client-list/facture-client-list.component';

import { CommandeClientListComponent } from './app/pages/commande-client-list/commande-client-list/commande-client-list.component';
import { CommandeClientFormComponent } from './app/pages/commande-client-form/commande-client-form/commande-client-form.component';
import { BonLivraisonComponent } from './app/pages/bon-livraison/bon-livraison/bon-livraison.component';
import { authGuard } from './app/guards/auth.guard';

// root‑level routes
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' as const },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      // dashboard (lazy‑loaded)
      {
        path: 'dashboard',
         canActivate: [authGuard],     
        loadComponent: () => import('./app/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      { path: 'signup', component: SignupComponent },
      { path: 'articles', component: ArticleComponent },

      // clients (lazy component)
      {
        path: 'clients',
        loadComponent: () => import('./app/pages/clients/client/client.component').then(m => m.ClientComponent),
      },
      {
        path: 'fournisseur',
        loadComponent: () => import('./app/pages/fournisseur/fournisseur/fournisseur.component').then(m => m.FournisseurComponent),
      },
      // stock
      { path: 'depots', loadComponent: () => import('./app/pages/stock/depot/depot.component').then(m => m.DepotComponent) },
      { path: 'bons-entree', loadComponent: () => import('./app/pages/stock/bon-entree/bon-entree.component').then(m => m.BonEntreeComponent) },
       { path: 'facturefournisseur', loadComponent: () => import('./app/pages/facture-fournisseur/facture-fournisseur/facture-fournisseur.component').then(m => m.FactureFournisseurComponent) },

      { path: 'bons-sortie', component: BonSortieComponent },

      // CommandeClient
      { path: 'commandeclient', component: CommandeClientListComponent },
      { path: 'commandeclient/add', component: CommandeClientFormComponent },
      { path: 'commandeclient/edit/:id', component: CommandeClientFormComponent },

      // FactureClient
      { path: 'factureclient', component: FactureClientListComponent },
      { path: 'bonlivraison', component: BonLivraisonComponent },
      // you'll create this list component

    ],
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(CommonModule, FormsModule),
    provideRouter(routes),
  ],
}).catch(err => console.error(err));