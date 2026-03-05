import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product, Category } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="form-page">
      <div class="form-header">
        <a routerLink="/admin" class="btn-back">← Volver</a>
        <div>
          <h1>{{ isEditing() ? '✏️ Editar Producto' : '➕ Nuevo Producto' }}</h1>
          <p>{{ isEditing() ? 'Modifica los datos del producto' : 'Completa el formulario para agregar un producto' }}</p>
        </div>
      </div>

      <form class="admin-form" (ngSubmit)="onSubmit()" #f="ngForm">
        <div class="form-grid">

          <!-- Columna izquierda -->
          <div class="form-col">
            <div class="form-card">
              <h3>Información básica</h3>

              <div class="field">
                <label>Nombre del producto *</label>
                <input type="text" name="name" [(ngModel)]="form.name"
                  placeholder="Ej: Labial Mate Terciopelo" required #nameF="ngModel"/>
                <span class="field-error" *ngIf="nameF.invalid && nameF.touched">Campo requerido</span>
              </div>

              <div class="field">
                <label>Descripción *</label>
                <textarea name="description" [(ngModel)]="form.description"
                  placeholder="Describe el producto..." required rows="4" #descF="ngModel"></textarea>
                <span class="field-error" *ngIf="descF.invalid && descF.touched">Campo requerido</span>
              </div>

              <div class="field-row">
                <div class="field">
                  <label>Categoría *</label>
                  <select name="category" [(ngModel)]="form.category" required #catF="ngModel">
                    <option value="" disabled>Seleccionar...</option>
                    <option *ngFor="let c of categories()" [value]="c.slug">{{ c.icon }} {{ c.name }}</option>
                  </select>
                  <span class="field-error" *ngIf="catF.invalid && catF.touched">Selecciona una categoría</span>
                </div>

                <div class="field">
                  <label>Stock *</label>
                  <input type="number" name="stock" [(ngModel)]="form.stock"
                    placeholder="0" required min="0" #stockF="ngModel"/>
                  <span class="field-error" *ngIf="stockF.invalid && stockF.touched">Stock requerido</span>
                </div>
              </div>

              <div class="field">
                <label>Tags <span class="label-hint">(separados por coma)</span></label>
                <input type="text" name="tags" [(ngModel)]="tagsInput"
                  placeholder="oferta, nuevo, destacado"/>
              </div>
            </div>

            <!-- Imagen -->
            <div class="form-card">
              <h3>Imagen del producto</h3>
              <div class="field">
                <label>URL de imagen principal *</label>
                <input type="url" name="image" [(ngModel)]="form.image"
                  placeholder="https://..." required #imgF="ngModel"/>
                <span class="field-error" *ngIf="imgF.invalid && imgF.touched">URL requerida</span>
              </div>
              <div class="image-preview" *ngIf="form.image">
                <img [src]="form.image" alt="Preview" (error)="form.image = ''" />
                <span>Vista previa</span>
              </div>
            </div>
          </div>

          <!-- Columna derecha -->
          <div class="form-col">
            <div class="form-card">
              <h3>Precios</h3>

              <div class="field">
                <label>Precio de venta (COP) *</label>
                <div class="input-prefix">
                  <span>$</span>
                  <input type="number" name="price" [(ngModel)]="form.price"
                    placeholder="0" required min="0" #priceF="ngModel"/>
                </div>
                <span class="field-error" *ngIf="priceF.invalid && priceF.touched">Precio requerido</span>
              </div>

              <div class="field">
                <label>Precio original <span class="label-hint">(dejar vacío si no hay descuento)</span></label>
                <div class="input-prefix">
                  <span>$</span>
                  <input type="number" name="originalPrice" [(ngModel)]="form.originalPrice"
                    placeholder="0" min="0"/>
                </div>
              </div>

              <!-- Preview descuento -->
              <div class="discount-preview" *ngIf="form.price && form.originalPrice && form.originalPrice > form.price">
                <span class="dp-label">Descuento calculado</span>
                <span class="dp-value">{{ getDiscount() }}% OFF</span>
              </div>
            </div>

            <div class="form-card">
              <h3>Rating</h3>
              <div class="field-row">
                <div class="field">
                  <label>Rating (0-5)</label>
                  <input type="number" name="rating" [(ngModel)]="form.rating"
                    placeholder="4.5" min="0" max="5" step="0.1"/>
                </div>
                <div class="field">
                  <label>Nº de reseñas</label>
                  <input type="number" name="reviewCount" [(ngModel)]="form.reviewCount"
                    placeholder="0" min="0"/>
                </div>
              </div>
            </div>

            <!-- Resumen -->
            <div class="form-card summary-card">
              <h3>Resumen</h3>
              <div class="summary-rows">
                <div class="sum-row">
                  <span>Nombre</span>
                  <strong>{{ form.name || '—' }}</strong>
                </div>
                <div class="sum-row">
                  <span>Categoría</span>
                  <strong>{{ form.category || '—' }}</strong>
                </div>
                <div class="sum-row">
                  <span>Precio</span>
                  <strong>{{ form.price ? (form.price | currency:'COP':'$':'1.0-0') : '—' }}</strong>
                </div>
                <div class="sum-row">
                  <span>Stock</span>
                  <strong>{{ form.stock ?? '—' }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="form-footer">
          <a routerLink="/admin" class="btn-cancel-form">Cancelar</a>
          <button type="submit" class="btn-submit-form" [disabled]="f.invalid || saving()">
            <span *ngIf="!saving()">{{ isEditing() ? '💾 Guardar cambios' : '➕ Crear producto' }}</span>
            <span *ngIf="saving()">⏳ Guardando...</span>
          </button>
        </div>

      </form>
    </div>
  `,
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
  isEditing  = signal(false);
  saving     = signal(false);
  categories = signal<Category[]>([]);
  tagsInput  = '';

  form: Partial<Product> = {
    name: '', description: '', price: undefined, originalPrice: undefined,
    image: '', category: '', stock: undefined, rating: 4.5,
    reviewCount: 0, tags: []
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productService.getCategories().subscribe(c => this.categories.set(c));
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing.set(true);
      this.productService.getProductById(+id).subscribe(p => {
        if (p) {
          this.form = { ...p };
          this.tagsInput = p.tags?.join(', ') || '';
        }
      });
    }
  }

  getDiscount(): number {
    if (!this.form.price || !this.form.originalPrice) return 0;
    return Math.round((1 - this.form.price / this.form.originalPrice) * 100);
  }

  async onSubmit() {
    this.saving.set(true);
    this.form.tags = this.tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    // Simula guardado — conecta con tu API real aquí
    await new Promise(r => setTimeout(r, 800));

    if (this.isEditing()) {
      this.productService.updateProduct(this.form as Product);
    } else {
      this.productService.addProduct(this.form as Product);
    }

    this.saving.set(false);
    this.router.navigate(['/admin']);
  }
}
