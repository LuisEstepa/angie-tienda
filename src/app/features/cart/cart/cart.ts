// src/app/features/cart/cart.component.ts
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
      <h1>Tu Carrito</h1>

      <div *ngIf="cartService.itemCount() === 0" class="empty-cart">
        <p>🛒 Tu carrito está vacío</p>
        <a routerLink="/productos">Ver productos</a>
      </div>

      <div *ngIf="cartService.itemCount() > 0" class="cart-content">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cartService.items()">
            <img [src]="item.product.image" [alt]="item.product.name" />
            <div class="item-info">
              <h4>{{ item.product.name }}</h4>
              <p>{{ item.product.price | currency:'COP':'$':'1.0-0' }}</p>
            </div>
            <div class="quantity-controls">
              <button (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)">−</button>
              <span>{{ item.quantity }}</span>
              <button (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)">+</button>
            </div>
            <span class="item-total">
              {{ item.product.price * item.quantity | currency:'COP':'$':'1.0-0' }}
            </span>
            <button class="remove" (click)="cartService.removeFromCart(item.product.id)">✕</button>
          </div>
        </div>

        <div class="cart-summary">
          <h3>Resumen del pedido</h3>
          <div class="summary-row">
            <span>Subtotal ({{ cartService.itemCount() }} items)</span>
            <span>{{ cartService.total() | currency:'COP':'$':'1.0-0' }}</span>
          </div>
          <div class="summary-row">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <hr />
          <div class="summary-row total">
            <strong>Total</strong>
            <strong>{{ cartService.total() | currency:'COP':'$':'1.0-0' }}</strong>
          </div>
          <a routerLink="/checkout" class="btn-checkout">Ir a pagar</a>
          <button (click)="cartService.clearCart()" class="btn-clear">Vaciar carrito</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './cart.scss'
})
export class Cart {
  constructor(public cartService: CartService) {}
}
