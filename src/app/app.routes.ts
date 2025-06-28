import { Routes } from '@angular/router';
import { FactureClientListComponent } from './pages/facture-client-list/facture-client-list/facture-client-list.component';
import { FactureClientFormComponent } from './pages/facture-client-form/facture-client-form.component';


export const routes: Routes = [
  { path: '', redirectTo: 'factureclient', pathMatch: 'full' },
  { path: 'factureclient', component: FactureClientListComponent },
  { path: 'factureclient/add', component: FactureClientFormComponent },
  { path: 'factureclient/edit/:id', component: FactureClientFormComponent },
];