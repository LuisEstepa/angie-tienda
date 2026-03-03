import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-glow"></div>

      <div class="auth-card">
        <!-- Logo -->
        <div class="auth-brand">
          <span class="brand-icon">🛍️</span>
          <span class="brand-name">M&L Glow Shop</span>
        </div>

        <h2>Bienvenida de nuevo</h2>
        <p class="subtitle">Ingresa a tu cuenta para continuar</p>

        <!-- Error -->
        <div class="alert-error" *ngIf="errorMsg()">
          ⚠️ {{ errorMsg() }}
        </div>

        <!-- Formulario -->
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="field">
            <label>Correo electrónico</label>
            <div class="input-wrap">
              <span class="input-icon">✉️</span>
              <input
                type="email"
                name="email"
                [(ngModel)]="form.email"
                placeholder="tu@correo.com"
                required
                #emailInput="ngModel"
              />
            </div>
            <span class="field-error" *ngIf="emailInput.invalid && emailInput.touched">
              Ingresa un correo válido
            </span>
          </div>

          <div class="field">
            <label>
              Contraseña
              <a routerLink="/forgot" class="forgot">¿Olvidaste tu contraseña?</a>
            </label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                name="password"
                [(ngModel)]="form.password"
                placeholder="Mínimo 6 caracteres"
                required
                minlength="6"
                #passInput="ngModel"
              />
              <button type="button" class="toggle-pass" (click)="showPassword.set(!showPassword())">
                {{ showPassword() ? '🙈' : '👁️' }}
              </button>
            </div>
            <span class="field-error" *ngIf="passInput.invalid && passInput.touched">
              Mínimo 6 caracteres
            </span>
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading() || loginForm.invalid">
            <span *ngIf="!loading()">Ingresar</span>
            <span *ngIf="loading()" class="spinner">⏳ Ingresando...</span>
          </button>
        </form>

        <p class="auth-footer">
          ¿No tienes cuenta?
          <a routerLink="/registro">Regístrate gratis →</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './login.scss'
})
export class LoginComponent {
  form = { email: '', password: '' };
  loading = signal(false);
  errorMsg = signal('');
  showPassword = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.loading.set(true);
    this.errorMsg.set('');
    try {
      await this.auth.login(this.form);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMsg.set(err);
    } finally {
      this.loading.set(false);
    }
  }
}