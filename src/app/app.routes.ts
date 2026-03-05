// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin.guard';

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
      import('./features/checkout/checkout/checkout').then(m => m.Checkout),
    canActivate: [authGuard]  // Proteger con autenticación
  },
  // ── Admin ──
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'productos/nuevo',
        loadComponent: () => import('./features/admin/products/product-form/product-form').then(m => m.ProductForm)
      },
      {
        path: 'productos/editar/:id',
        loadComponent: () => import('./features/admin/products/product-form/product-form').then(m => m.ProductForm)
      },
      {
        path: 'categorias/nueva',
        loadComponent: () => import('./features/admin/categories/category-form/category-form').then(m => m.CategoryForm)
      },
      {
        path: 'categorias/editar/:id',
        loadComponent: () => import('./features/admin/categories/category-form/category-form').then(m => m.CategoryForm)
      },
    ]
  },
  { path: '**',
    redirectTo: '' 
  }
];
