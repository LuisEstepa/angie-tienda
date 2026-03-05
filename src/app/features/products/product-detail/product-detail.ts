import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-page" *ngIf="product(); else loading">

      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <a routerLink="/">Inicio</a>
        <span>›</span>
        <a routerLink="/productos">Productos</a>
        <span>›</span>
        <a [routerLink]="['/productos']" [queryParams]="{category: product()!.category}">
          {{ product()!.category | titlecase }}
        </a>
        <span>›</span>
        <span class="current">{{ product()!.name }}</span>
      </nav>

      <!-- Layout principal -->
      <div class="detail-layout">

        <!-- ── Galería ── -->
        <div class="gallery">
          <div class="main-image">
            <img [src]="selectedImage()" [alt]="product()!.name" />
            <span class="badge-oferta" *ngIf="product()!.originalPrice">OFERTA</span>
            <span class="badge-stock low" *ngIf="product()!.stock <= 5">
              ⚡ ¡Últimas {{ product()!.stock }} unidades!
            </span>
          </div>
          <div class="thumbnails" *ngIf="allImages().length > 1">
            <button
              *ngFor="let img of allImages(); let i = index"
              class="thumb"
              [class.active]="selectedImage() === img"
              (click)="selectedImage.set(img)"
            >
              <img [src]="img" [alt]="product()!.name + ' ' + i" />
            </button>
          </div>
        </div>

        <!-- ── Info ── -->
        <div class="info">

          <!-- Encabezado -->
          <div class="info-header">
            <span class="brand">M&L Glow Shop</span>
            <h1>{{ product()!.name }}</h1>

            <div class="rating-row">
              <div class="stars">
                <span *ngFor="let s of getStars(product()!.rating)" class="star" [class.half]="s === 0.5">★</span>
              </div>
              <span class="rating-val">{{ product()!.rating }}</span>
              <span class="review-count">({{ product()!.reviewCount }} reseñas)</span>
            </div>
          </div>

          <!-- Precio -->
          <div class="price-block">
            <span class="price-current">{{ product()!.price | currency:'COP':'$':'1.0-0' }}</span>
            <div class="price-original-wrap" *ngIf="product()!.originalPrice">
              <span class="price-original">{{ product()!.originalPrice | currency:'COP':'$':'1.0-0' }}</span>
              <span class="discount-pct">-{{ getDiscount() }}%</span>
            </div>
            <p class="price-note" *ngIf="product()!.price < 200000">
              🚚 Agrega <strong>{{ (200000 - product()!.price) | currency:'COP':'$':'1.0-0' }}</strong> más para envío gratis
            </p>
            <p class="price-note free" *ngIf="product()!.price >= 200000">
              🚚 ¡Este producto incluye <strong>envío gratis!</strong>
            </p>
          </div>

          <!-- Descripción -->
          <p class="description">{{ product()!.description }}</p>

          <!-- Tags -->
          <div class="tags" *ngIf="product()!.tags?.length">
            <span class="tag" *ngFor="let tag of product()!.tags">{{ tag }}</span>
          </div>

          <!-- Cantidad + Carrito -->
          <div class="buy-block">
            <div class="qty-selector">
              <button (click)="changeQty(-1)" [disabled]="qty() <= 1">−</button>
              <span>{{ qty() }}</span>
              <button (click)="changeQty(1)" [disabled]="qty() >= product()!.stock">+</button>
            </div>

            <button
              class="btn-add"
              (click)="addToCart()"
              [class.added]="added()"
              [disabled]="product()!.stock === 0"
            >
              <span *ngIf="!added() && product()!.stock > 0">🛒 Agregar al carrito</span>
              <span *ngIf="added()">✓ ¡Agregado!</span>
              <span *ngIf="product()!.stock === 0">Sin stock</span>
            </button>

            <button class="btn-wish" title="Lista de deseos">♡</button>
          </div>

          <!-- Specs rápidas -->
          <div class="quick-specs">
            <div class="spec">
              <span class="spec-icon">📦</span>
              <div>
                <strong>Stock</strong>
                <span>{{ product()!.stock }} disponibles</span>
              </div>
            </div>
            <div class="spec">
              <span class="spec-icon">🏷️</span>
              <div>
                <strong>Categoría</strong>
                <span>{{ product()!.category | titlecase }}</span>
              </div>
            </div>
            <div class="spec">
              <span class="spec-icon">🚚</span>
              <div>
                <strong>Envío</strong>
                <span>{{ product()!.price >= 200000 ? 'Gratis' : 'Desde $10.000' }}</span>
              </div>
            </div>
            <div class="spec">
              <span class="spec-icon">↩️</span>
              <div>
                <strong>Devolución</strong>
                <span>30 días gratis</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Productos relacionados -->
      <div class="related" *ngIf="related().length > 0">
        <h2>También te puede gustar</h2>
        <div class="related-grid">
          <a class="related-card" *ngFor="let p of related()" [routerLink]="['/productos', p.id]">
            <img [src]="p.image" [alt]="p.name" />
            <div class="related-info">
              <span>{{ p.name }}</span>
              <strong>{{ p.price | currency:'COP':'$':'1.0-0' }}</strong>
            </div>
          </a>
        </div>
      </div>

    </div>

    <!-- Loading -->
    <ng-template #loading>
      <div class="loading-state">
        <div class="spinner-ring"></div>
        <p>Cargando producto...</p>
      </div>
    </ng-template>
  `,
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent implements OnInit {
  product   = signal<Product | null>(null);
  related   = signal<Product[]>([]);
  selectedImage = signal('');
  qty       = signal(1);
  added     = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public  cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.productService.getProductById(id).subscribe(p => {
        if (!p) { this.router.navigate(['/productos']); return; }
        this.product.set(p);
        this.selectedImage.set(p.image);
        this.qty.set(1);
        this.added.set(false);
        this.loadRelated(p);
      });
    });
  }

  loadRelated(p: Product) {
    this.productService.getProducts(p.category).subscribe(all => {
      this.related.set(all.filter(x => x.id !== p.id).slice(0, 4));
    });
  }

  allImages(): string[] {
    const p = this.product();
    if (!p) return [];
    return p.images?.length ? p.images : [p.image];
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => {
      if (i + 1 <= Math.floor(rating)) return 1;
      if (i < rating) return 0.5;
      return 0;
    }).filter(v => v > 0);
  }

  getDiscount(): number {
    const p = this.product();
    if (!p?.originalPrice) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }

  changeQty(delta: number) {
    const p = this.product();
    if (!p) return;
    this.qty.set(Math.max(1, Math.min(p.stock, this.qty() + delta)));
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cartService.addToCart(p, this.qty());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2000);
  }
}
