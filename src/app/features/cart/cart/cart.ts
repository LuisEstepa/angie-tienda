import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-page">

      <!-- Header -->
      <div class="cart-header">
        <h1>🛒 Tu Carrito</h1>
        <span class="item-count" *ngIf="cartService.itemCount() > 0">
          {{ cartService.itemCount() }} productos
        </span>
      </div>

      <!-- Vacío -->
      <div *ngIf="cartService.itemCount() === 0" class="empty-cart">
        <div class="empty-icon">🛍️</div>
        <h2>Tu carrito está vacío</h2>
        <p>Explora nuestra colección y encuentra algo que te encante</p>
        <a routerLink="/productos" class="btn-explore">Ver productos →</a>
      </div>

      <!-- Con items -->
      <div *ngIf="cartService.itemCount() > 0" class="cart-layout">

        <!-- Items grid -->
        <div class="cart-items">
          <div class="items-grid">
            <div class="cart-card" *ngFor="let item of cartService.items()">
              <div class="card-image">
                <img [src]="item.product.image" [alt]="item.product.name" />
                <button class="btn-remove" (click)="cartService.removeFromCart(item.product.id)" title="Eliminar">✕</button>
              </div>
              <div class="card-info">
                <h4>{{ item.product.name }}</h4>
                <p class="unit-price">{{ item.product.price | currency:'COP':'$':'1.0-0' }} c/u</p>
                <div class="quantity-row">
                  <div class="qty-controls">
                    <button (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)">−</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)">+</button>
                  </div>
                  <span class="subtotal">
                    {{ item.product.price * item.quantity | currency:'COP':'$':'1.0-0' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen -->
        <div class="cart-summary">
          <div class="summary-card">
            <h3>Resumen del pedido</h3>

            <div class="summary-items">
              <div class="summary-row" *ngFor="let item of cartService.items()">
                <span class="summary-name">{{ item.product.name }} x{{ item.quantity }}</span>
                <span>{{ item.product.price * item.quantity | currency:'COP':'$':'1.0-0' }}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ cartService.total() | currency:'COP':'$':'1.0-0' }}</span>
            </div>
            <div class="summary-row shipping">
              <span>Envío</span>
              <span class="free">✓ Gratis</span>
            </div>

            <div class="divider"></div>

            <div class="summary-row total-row">
              <strong>Total</strong>
              <strong class="total-amount">{{ cartService.total() | currency:'COP':'$':'1.0-0' }}</strong>
            </div>

            <a routerLink="/checkout" class="btn-checkout">Ir a pagar →</a>
            <button class="btn-clear" (click)="cartService.clearCart()">Vaciar carrito</button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      padding: 2rem 0;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Header */
    .cart-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;

      h1 {
        font-size: 1.8rem;
        font-weight: 800;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .item-count {
      background: rgba(232,160,191,0.12);
      color: var(--color-primary);
      border: 1px solid rgba(232,160,191,0.25);
      padding: 0.25rem 0.85rem;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 600;
    }

    /* Vacío */
    .empty-cart {
      text-align: center;
      padding: 6rem 2rem;

      .empty-icon {
        font-size: 5rem;
        margin-bottom: 1.5rem;
        opacity: 0.4;
      }

      h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--color-text-muted);
        margin-bottom: 2rem;
      }
    }

    .btn-explore {
      display: inline-block;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: #1a1a24;
      font-weight: 700;
      padding: 0.8rem 2rem;
      border-radius: 999px;
      transition: all 0.25s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 25px rgba(232,160,191,0.3);
      }
    }

    /* Layout */
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 2rem;
      align-items: start;
    }

    /* Grid de tarjetas */
    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .cart-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md), var(--shadow-glow);
        border-color: rgba(232,160,191,0.3);
      }
    }

    .card-image {
      position: relative;

      img {
        width: 100%;
        height: 160px;
        object-fit: cover;
      }
    }

    .btn-remove {
      position: absolute;
      top: 8px; right: 8px;
      background: rgba(15,15,19,0.8);
      color: var(--color-text-muted);
      border: 1px solid var(--color-border);
      border-radius: 50%;
      width: 28px; height: 28px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      backdrop-filter: blur(4px);

      &:hover {
        background: var(--color-danger);
        color: white;
        border-color: var(--color-danger);
      }
    }

    .card-info {
      padding: 0.9rem 1rem 1rem;

      h4 {
        font-size: 0.88rem;
        font-weight: 600;
        margin-bottom: 0.3rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .unit-price {
        color: var(--color-text-muted);
        font-size: 0.78rem;
        margin-bottom: 0.75rem;
      }
    }

    .quantity-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .qty-controls {
      display: flex;
      align-items: center;
      gap: 0;
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: 999px;
      overflow: hidden;

      button {
        background: transparent;
        color: var(--color-text-soft);
        border: none;
        width: 28px; height: 28px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
          background: rgba(232,160,191,0.15);
          color: var(--color-primary);
        }
      }

      span {
        font-size: 0.85rem;
        font-weight: 600;
        min-width: 24px;
        text-align: center;
        color: var(--color-text);
      }
    }

    .subtotal {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    /* Summary */
    .summary-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      position: sticky;
      top: 88px;

      h3 {
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: 1.25rem;
        color: var(--color-text);
      }
    }

    .summary-items {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
      max-height: 200px;
      overflow-y: auto;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-track { background: transparent; }
      &::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 2px;
      }
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.88rem;
      color: var(--color-text-soft);
      padding: 0.25rem 0;

      .summary-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 180px;
        font-size: 0.82rem;
        color: var(--color-text-muted);
      }

      &.shipping .free {
        color: var(--color-success);
        font-weight: 600;
        font-size: 0.82rem;
      }
    }

    .total-row {
      padding: 0.5rem 0;

      strong { font-size: 1rem; }

      .total-amount {
        font-size: 1.2rem;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .divider {
      height: 1px;
      background: var(--color-border);
      margin: 0.75rem 0;
    }

    .btn-checkout {
      display: block;
      text-align: center;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: #1a1a24;
      font-weight: 700;
      padding: 0.85rem;
      border-radius: 999px;
      margin-top: 1.25rem;
      transition: all 0.25s;
      font-size: 0.95rem;
      letter-spacing: 0.02em;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 25px rgba(232,160,191,0.3);
      }
    }

    .btn-clear {
      display: block;
      width: 100%;
      text-align: center;
      background: transparent;
      color: var(--color-text-muted);
      padding: 0.65rem;
      border-radius: 999px;
      margin-top: 0.75rem;
      border: 1px solid var(--color-border);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: var(--color-danger);
        color: var(--color-danger);
      }
    }

    /* Responsive */
    @media (max-width: 900px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }
      .summary-card {
        position: static;
      }
    }

    @media (max-width: 600px) {
      .items-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})

export class Cart {
  constructor(public cartService: CartService) {}
}
