import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-glow"></div>

      <div class="auth-card">
        <div class="auth-brand">
          <span class="brand-icon">🛍️</span>
          <span class="brand-name">M&L Glow Shop</span>
        </div>

        <h2>Crea tu cuenta</h2>
        <p class="subtitle">Únete y descubre lo mejor en belleza</p>

        <div class="alert-error" *ngIf="errorMsg()">⚠️ {{ errorMsg() }}</div>
        <div class="alert-success" *ngIf="successMsg()">✅ {{ successMsg() }}</div>

        <form (ngSubmit)="onSubmit()" #regForm="ngForm">
          <div class="field">
            <label>Nombre completo</label>
            <div class="input-wrap">
              <span class="input-icon">👤</span>
              <input type="text" name="name" [(ngModel)]="form.name"
                placeholder="Tu nombre" required minlength="2" #nameInput="ngModel"/>
            </div>
            <span class="field-error" *ngIf="nameInput.invalid && nameInput.touched">
              Ingresa tu nombre
            </span>
          </div>

          <div class="field">
            <label>Correo electrónico</label>
            <div class="input-wrap">
              <span class="input-icon">✉️</span>
              <input type="email" name="email" [(ngModel)]="form.email"
                placeholder="tu@correo.com" required #emailInput="ngModel"/>
            </div>
            <span class="field-error" *ngIf="emailInput.invalid && emailInput.touched">
              Ingresa un correo válido
            </span>
          </div>

          <div class="field">
            <label>Contraseña</label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input [type]="showPass() ? 'text' : 'password'" name="password"
                [(ngModel)]="form.password" placeholder="Mínimo 6 caracteres"
                required minlength="6" #passInput="ngModel"/>
              <button type="button" class="toggle-pass" (click)="showPass.set(!showPass())">
                {{ showPass() ? '🙈' : '👁️' }}
              </button>
            </div>
            <!-- Barra de fortaleza -->
            <div class="strength-bar" *ngIf="form.password">
              <div class="bar" [class]="strengthClass()"></div>
              <span>{{ strengthLabel() }}</span>
            </div>
          </div>

          <div class="field">
            <label>Confirmar contraseña</label>
            <div class="input-wrap" [class.mismatch]="passwordMismatch()">
              <span class="input-icon">🔒</span>
              <input [type]="showPass() ? 'text' : 'password'" name="confirmPassword"
                [(ngModel)]="form.confirmPassword" placeholder="Repite tu contraseña"
                required #confirmInput="ngModel"/>
            </div>
            <span class="field-error" *ngIf="passwordMismatch()">
              Las contraseñas no coinciden
            </span>
          </div>

          <button type="submit" class="btn-submit"
            [disabled]="loading() || regForm.invalid || passwordMismatch()">
            <span *ngIf="!loading()">Crear cuenta gratis</span>
            <span *ngIf="loading()">⏳ Creando cuenta...</span>
          </button>
        </form>

        <p class="auth-footer">
          ¿Ya tienes cuenta? <a routerLink="/login">Ingresar →</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './register.scss'
})
export class RegisterComponent {
  form = { name: '', email: '', password: '', confirmPassword: '' };
  loading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');
  showPass = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  passwordMismatch(): boolean {
    return !!this.form.confirmPassword && this.form.password !== this.form.confirmPassword;
  }

  strengthClass(): string {
    const len = this.form.password.length;
    if (len < 6) return 'weak';
    if (len < 10) return 'medium';
    return 'strong';
  }

  strengthLabel(): string {
    const map: Record<string, string> = { weak: '⚠️ Débil', medium: '👍 Media', strong: '💪 Fuerte' };
    return map[this.strengthClass()];
  }

  async onSubmit() {
    if (this.passwordMismatch()) return;
    this.loading.set(true);
    this.errorMsg.set('');
    try {
      await this.auth.register(this.form);
      this.successMsg.set('¡Cuenta creada exitosamente!');
      setTimeout(() => this.router.navigate(['/']), 1000);
    } catch (err: any) {
      this.errorMsg.set(err);
    } finally {
      this.loading.set(false);
    }
  }
}