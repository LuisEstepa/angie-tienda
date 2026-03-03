// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./features/products/product-list/product-list')
        .then(m => m.ProductListComponent)
  },
  {
    path: 'productos/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail')
        .then(m => m.ProductDetailComponent)
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./features/cart/cart/cart').then(m => m.Cart)
  },
    {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout/checkout')
        .then(m => m.Checkout),
    canActivate: [authGuard]  // Proteger con autenticación
  },
  {
    path: '**',
    redirectTo: ''
  }
];
