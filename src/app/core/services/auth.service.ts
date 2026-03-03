import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _user = signal<User | null>(this.loadUser());
  
  isLoggedIn = computed(() => this._user() !== null);
  currentUser = this._user.asReadonly();

  constructor(private router: Router) {}

  login(data: LoginRequest): Promise<void> {
    // Simula llamada a API — reemplaza con HttpClient real
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email && data.password.length >= 6) {
          const user: User = {
            id: 1,
            name: data.email.split('@')[0],
            email: data.email,
            avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.email}`
          };
          this._user.set(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve();
        } else {
          reject('Credenciales incorrectas');
        }
      }, 800);
    });
  }

  register(data: RegisterRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.password !== data.confirmPassword) {
          reject('Las contraseñas no coinciden');
          return;
        }
        const user: User = {
          id: Date.now(),
          name: data.name,
          email: data.email,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.email}`
        };
        this._user.set(user);
        localStorage.setItem('user', JSON.stringify(user));
        resolve();
      }, 800);
    });
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  private loadUser(): User | null {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }
}