import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Category } from '../../../../core/models/product.model';

const EMOJI_OPTIONS = ['💄','✨','🌸','💇','🪄','💅','🧴','🛁','🪞','💆','🌿','🧖','💋','👄','🧪','🫧'];

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="form-page">
      <div class="form-header">
        <a routerLink="/admin" class="btn-back">← Volver</a>
        <div>
          <h1>{{ isEditing() ? '✏️ Editar Categoría' : '➕ Nueva Categoría' }}</h1>
          <p>{{ isEditing() ? 'Modifica los datos de la categoría' : 'Crea una nueva categoría para tus productos' }}</p>
        </div>
      </div>

      <form class="admin-form" (ngSubmit)="onSubmit()" #f="ngForm">
        <div class="cat-form-grid">

          <div class="form-card">
            <h3>Datos de la categoría</h3>

            <div class="field">
              <label>Nombre *</label>
              <input type="text" name="name" [(ngModel)]="form.name"
                (input)="generateSlug()" placeholder="Ej: Skincare"
                required #nameF="ngModel"/>
              <span class="field-error" *ngIf="nameF.invalid && nameF.touched">Campo requerido</span>
            </div>

            <div class="field">
              <label>Slug <span class="label-hint">(se genera automáticamente)</span></label>
              <div class="input-prefix">
                <span>/</span>
                <input type="text" name="slug" [(ngModel)]="form.slug"
                  placeholder="skincare" required #slugF="ngModel"/>
              </div>
            </div>

            <div class="field">
              <label>Icono</label>
              <div class="emoji-grid">
                <button type="button"
                  *ngFor="let e of emojiOptions"
                  class="emoji-btn"
                  [class.selected]="form.icon === e"
                  (click)="form.icon = e">
                  {{ e }}
                </button>
              </div>
            </div>

          </div>

          <!-- Preview -->
          <div class="form-card preview-card">
            <h3>Vista previa</h3>
            <div class="cat-preview">
              <div class="preview-pill">
                <span class="preview-icon">{{ form.icon || '🏷️' }}</span>
                <span class="preview-name">{{ form.name || 'Nombre' }}</span>
              </div>
              <div class="preview-slug">
                Ruta: <code>/productos?category={{ form.slug || 'slug' }}</code>
              </div>
            </div>
          </div>

        </div>

        <div class="form-footer">
          <a routerLink="/admin" class="btn-cancel-form">Cancelar</a>
          <button type="submit" class="btn-submit-form" [disabled]="f.invalid || saving()">
            <span *ngIf="!saving()">{{ isEditing() ? '💾 Guardar cambios' : '➕ Crear categoría' }}</span>
            <span *ngIf="saving()">⏳ Guardando...</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './category-form.scss'
})
export class CategoryForm implements OnInit {
  isEditing  = signal(false);
  saving     = signal(false);
  emojiOptions = EMOJI_OPTIONS;

  form: Partial<Category> = { name: '', slug: '', icon: '💄' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing.set(true);
      this.productService.getCategories().subscribe(cats => {
        const cat = cats.find(c => c.id === +id);
        if (cat) this.form = { ...cat };
      });
    }
  }

  generateSlug() {
    this.form.slug = (this.form.name || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  async onSubmit() {
    this.saving.set(true);
    await new Promise(r => setTimeout(r, 600));
    // Conecta con tu API real aquí
    this.saving.set(false);
    this.router.navigate(['/admin']);
  }
}