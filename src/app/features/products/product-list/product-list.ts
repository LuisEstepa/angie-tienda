// src/app/features/products/product-list/product-list.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="products-page">
      <!-- Filtros -->
      <aside class="filters">
        <h3>Categorías</h3>
        <ul>
          <li *ngFor="let cat of categories()" (click)="filterByCategory(cat.slug)"
              [class.active]="selectedCategory() === cat.slug">
            {{ cat.icon }} {{ cat.name }}
          </li>
          <li (click)="filterByCategory(null)" [class.active]="!selectedCategory()">
            🛍️ Todos
          </li>
        </ul>
      </aside>

      <!-- Listado -->
      <main class="products-grid">
        <div class="toolbar">
          <input
            type="search"
            placeholder="Buscar productos..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          />
          <span>{{ products().length }} productos</span>
        </div>

        <div class="grid">
          <div class="product-card" *ngFor="let product of products()">
            <a [routerLink]="['/productos', product.id]">
              <img [src]="product.image" [alt]="product.name" />
              <div class="badge" *ngIf="product.originalPrice">OFERTA</div>
            </a>
            <div class="card-body">
              <h4>{{ product.name }}</h4>
              <div class="rating">
                ⭐ {{ product.rating }} ({{ product.reviewCount }})
              </div>
              <div class="price">
                <span class="current">{{ product.price | currency:'COP':'$':'1.0-0' }}</span>
                <span class="original" *ngIf="product.originalPrice">
                  {{ product.originalPrice | currency:'COP':'$':'1.0-0' }}
                </span>
              </div>
              <button
                (click)="addToCart(product)"
                [class.in-cart]="cartService.isInCart(product.id)"
              >
                {{ cartService.isInCart(product.id) ? '✓ En carrito' : 'Agregar al carrito' }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrl: './product-list.scss'
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<any[]>([]);
  selectedCategory = signal<string | null>(null);
  searchQuery = '';

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filterByCategory(params['category']);
      } else {
        this.loadProducts();
      }
    });
  }

  loadProducts(category?: string) {
    this.productService.getProducts(category).subscribe(products => {
      this.products.set(products);
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

  filterByCategory(slug: string | null) {
    this.selectedCategory.set(slug);
    this.loadProducts(slug || undefined);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe(results => {
        this.products.set(results);
      });
    } else {
      this.loadProducts(this.selectedCategory() || undefined);
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
