import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="hero">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <span class="hero-tag">✨ Nueva colección 2026</span>
        <h1>Tu belleza,<br><span class="gradient-text">tu esencia</span></h1>
        <p>Descubre productos de belleza seleccionados para realzar tu brillo natural.</p>
        <div class="hero-actions">
          <a routerLink="/productos" class="btn-hero">Ver colección →</a>
          <a routerLink="/productos" class="btn-ghost">Ofertas del día</a>
        </div>
      </div>
      <div class="hero-visual">💄</div>
    </div>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: calc(100vh - 68px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      padding: 4rem 0;
    }
    .hero-glow {
      position: absolute;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(232,160,191,0.15) 0%, transparent 70%);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
    .hero-content {
      max-width: 560px;
      z-index: 1;
    }
    .hero-tag {
      display: inline-block;
      background: rgba(232,160,191,0.12);
      color: var(--color-primary);
      border: 1px solid rgba(232,160,191,0.25);
      padding: 0.35rem 1rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      letter-spacing: 0.04em;
    }
    h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 1.2rem;
    }
    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: var(--color-text-muted);
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 2rem;
    }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-hero {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: #1a1a24;
      font-weight: 700;
      padding: 0.85rem 2rem;
      border-radius: 999px;
      font-size: 1rem;
      transition: all 0.25s;
      &:hover { transform: translateY(-3px); box-shadow: 0 0 30px rgba(232,160,191,0.35); }
    }
    .btn-ghost {
      border: 1px solid var(--color-border);
      color: var(--color-text-soft);
      padding: 0.85rem 2rem;
      border-radius: 999px;
      font-size: 1rem;
      transition: all 0.25s;
      &:hover { border-color: var(--color-primary); color: var(--color-primary); }
    }
    .hero-visual {
      font-size: 12rem;
      opacity: 0.15;
      position: absolute;
      right: -2rem;
      filter: blur(2px);
    }
  `]
})

export class Home {

}
