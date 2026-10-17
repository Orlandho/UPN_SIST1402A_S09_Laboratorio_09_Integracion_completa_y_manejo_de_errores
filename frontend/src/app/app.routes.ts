import { Routes } from '@angular/router';
import { Catalogo } from './components/catalogo/catalogo';
import { ProductoForm } from './pages/producto-form/producto-form';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: Catalogo },
  { path: 'productos/nuevo', component: ProductoForm },
  { path: 'productos/editar/:id', component: ProductoForm },
  { path: '**', redirectTo: 'productos' }
];
