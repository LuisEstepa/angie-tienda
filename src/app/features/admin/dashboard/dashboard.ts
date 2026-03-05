import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, Category } from '../../../core/models/product.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-page">

      <!-- Header -->
      <div class="admin-header">
        <div>
          <h1>⚙️ Panel de Administración</h1>
          <p>Gestiona productos y categorías de tu tienda</p>
        </div>
        <div class="admin-actions">
          <a routerLink="/admin/productos/nuevo" class="btn-new product">+ Nuevo Producto</a>
          <a routerLink="/admin/categorias/nueva" class="btn-new category">+ Nueva Categoría</a>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">📦</span>
          <div>
            <strong>{{ products().length }}</strong>
            <span>Productos</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🏷️</span>
          <div>
            <strong>{{ categories().length }}</strong>
            <span>Categorías</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🔥</span>
          <div>
            <strong>{{ getOnSale() }}</strong>
            <span>En oferta</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⚡</span>
          <div>
            <strong>{{ getLowStock() }}</strong>
            <span>Stock bajo</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button [class.active]="tab() === 'products'" (click)="tab.set('products')">
          📦 Productos
        </button>
        <button [class.active]="tab() === 'categories'" (click)="tab.set('categories')">
          🏷️ Categorías
        </button>
      </div>

      <!-- ══ TABLA PRODUCTOS ══ -->
      <div *ngIf="tab() === 'products'" class="table-section">
        <div class="table-toolbar">
          <input type="search" placeholder="Buscar producto..." [(ngModel)]="searchProd"
            (input)="filterProducts()" />
          <span>{{ filteredProducts().length }} productos</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of filteredProducts()">
                <td>
                  <div class="prod-cell">
                    <img [src]="p.image" [alt]="p.name" />
                    <div>
                      <strong>{{ p.name }}</strong>
                      <span *ngIf="p.originalPrice" class="badge-sale">Oferta</span>
                    </div>
                  </div>
                </td>
                <td><span class="cat-chip">{{ p.category }}</span></td>
                <td>
                  <div class="price-cell">
                    <strong>{{ p.price | currency:'COP':'$':'1.0-0' }}</strong>
                    <span *ngIf="p.originalPrice" class="price-old">
                      {{ p.originalPrice | currency:'COP':'$':'1.0-0' }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="stock-badge" [class.low]="p.stock <= 5" [class.out]="p.stock === 0">
                    {{ p.stock === 0 ? 'Agotado' : p.stock + ' uds' }}
                  </span>
                </td>
                <td>⭐ {{ p.rating }}</td>
                <td>
                  <div class="action-btns">
                    <a [routerLink]="['/admin/productos/editar', p.id]" class="btn-edit" title="Editar">✏️</a>
                    <button class="btn-delete" (click)="confirmDelete(p)" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ══ TABLA CATEGORÍAS ══ -->
      <div *ngIf="tab() === 'categories'" class="table-section">
        <div class="table-toolbar">
          <span>{{ categories().length }} categorías registradas</span>
          <a routerLink="/admin/categorias/nueva" class="btn-new product">+ Nueva</a>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Icono</th>
                <th>Nombre</th>
                <th>Slug</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of categories()">
                <td style="font-size:1.5rem; text-align:center">{{ c.icon }}</td>
                <td><strong>{{ c.name }}</strong></td>
                <td><code class="slug">{{ c.slug }}</code></td>
                <td>{{ countByCategory(c.slug) }} productos</td>
                <td>
                  <div class="action-btns">
                    <a [routerLink]="['/admin/categorias/editar', c.id]" class="btn-edit">✏️</a>
                    <button class="btn-delete" (click)="confirmDeleteCat(c)">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal confirmar eliminación -->
      <div class="modal-overlay" *ngIf="deleteTarget()" (click)="deleteTarget.set(null)">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>⚠️ Confirmar eliminación</h3>
          <p>¿Estás seguro de eliminar <strong>{{ deleteTarget()?.name }}</strong>?</p>
          <p class="modal-sub">Esta acción no se puede deshacer.</p>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="deleteTarget.set(null)">Cancelar</button>
            <button class="btn-confirm-delete" (click)="executeDelete()">Sí, eliminar</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  products         = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  categories       = signal<Category[]>([]);
  tab              = signal<'products' | 'categories'>('products');
  deleteTarget     = signal<any>(null);
  deleteType       = signal<'product' | 'category'>('product');
  searchProd       = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(p => {
      this.products.set(p);
      this.filteredProducts.set(p);
    });
    this.productService.getCategories().subscribe(c => this.categories.set(c));
  }

  filterProducts() {
    const q = this.searchProd.toLowerCase();
    this.filteredProducts.set(
      this.products().filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    );
  }

  getOnSale()    { return this.products().filter(p => p.originalPrice).length; }
  getLowStock()  { return this.products().filter(p => p.stock <= 5).length; }
  countByCategory(slug: string) { return this.products().filter(p => p.category === slug).length; }

  confirmDelete(p: Product) { this.deleteType.set('product');  this.deleteTarget.set(p); }
  confirmDeleteCat(c: Category) { this.deleteType.set('category'); this.deleteTarget.set(c); }

  executeDelete() {
    if (this.deleteType() === 'product') {
      const id = this.deleteTarget().id;
      this.products.update(list => list.filter(p => p.id !== id));
      this.filteredProducts.update(list => list.filter(p => p.id !== id));
    } else {
      const id = this.deleteTarget().id;
      this.categories.update(list => list.filter(c => c.id !== id));
    }
    this.deleteTarget.set(null);
  }
}