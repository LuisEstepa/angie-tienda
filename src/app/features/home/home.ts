import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  tag: string;
  title: string;
  highlight: string;
  description: string;
  cta: string;
  link: string;
  emoji: string;
  gradient: string;
  accentColor: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home">

      <!-- ═══════════════ SLIDER ═══════════════ -->
      <section class="slider">

        <!-- Slides -->
        <div class="slides-wrapper">
          <div
            class="slide"
            *ngFor="let slide of slides; let i = index"
            [class.active]="currentSlide() === i"
            [class.prev]="prevSlide() === i"
            [style.--accent]="slide.accentColor"
          >
            <!-- Fondo decorativo -->
            <div class="slide-bg" [style.background]="slide.gradient"></div>
            <div class="slide-particles">
              <span *ngFor="let p of particles">✦</span>
            </div>

            <!-- Contenido -->
            <div class="slide-content">
              <span class="slide-tag">{{ slide.tag }}</span>
              <h1 class="slide-title">
                {{ slide.title }}<br>
                <span class="slide-highlight">{{ slide.highlight }}</span>
              </h1>
              <p class="slide-desc">{{ slide.description }}</p>
              <div class="slide-actions">
                <a [routerLink]="slide.link" class="btn-slide-primary">
                  {{ slide.cta }} →
                </a>
                <a routerLink="/productos" class="btn-slide-ghost">
                  Ver todo
                </a>
              </div>
            </div>

            <!-- Emoji decorativo -->
            <div class="slide-visual">{{ slide.emoji }}</div>
          </div>
        </div>

        <!-- Controles -->
        <button class="slider-arrow left" (click)="prev()">‹</button>
        <button class="slider-arrow right" (click)="next()">›</button>

        <!-- Dots -->
        <div class="slider-dots">
          <button
            *ngFor="let slide of slides; let i = index"
            class="dot"
            [class.active]="currentSlide() === i"
            (click)="goTo(i)"
          ></button>
        </div>

        <!-- Barra de progreso -->
        <div class="progress-bar">
          <div class="progress-fill" [style.animation-duration]="duration + 'ms'"></div>
        </div>

      </section>

      <!-- ═══════════════ CATEGORÍAS RÁPIDAS ═══════════════ -->
      <section class="quick-cats">
        <a routerLink="/productos" [queryParams]="{category: 'maquillaje'}" class="cat-pill">💄 Maquillaje</a>
        <a routerLink="/productos" [queryParams]="{category: 'skincare'}"   class="cat-pill">✨ Skincare</a>
        <a routerLink="/productos" [queryParams]="{category: 'fragancias'}" class="cat-pill">🌸 Fragancias</a>
        <a routerLink="/productos" [queryParams]="{category: 'cabello'}"    class="cat-pill">💇 Cabello</a>
        <a routerLink="/productos" [queryParams]="{category: 'uñas'}"       class="cat-pill">💅 Uñas</a>
        <a routerLink="/productos" [queryParams]="{category: 'herramientas'}" class="cat-pill">🪄 Herramientas</a>
      </section>

      <!-- ═══════════════ BANNERS SECUNDARIOS ═══════════════ -->
      <section class="banners">
        <div class="banner banner-pink">
          <div class="banner-text">
            <span class="banner-tag">🔥 Oferta del día</span>
            <h3>Hasta 40% OFF<br>en Skincare</h3>
            <a routerLink="/productos" [queryParams]="{category: 'skincare'}">Aprovechar →</a>
          </div>
          <div class="banner-emoji">✨</div>
        </div>
        <div class="banner banner-gold">
          <div class="banner-text">
            <span class="banner-tag">🆕 Nuevo ingreso</span>
            <h3>Fragancias<br>Exclusivas</h3>
            <a routerLink="/productos" [queryParams]="{category: 'fragancias'}">Descubrir →</a>
          </div>
          <div class="banner-emoji">🌸</div>
        </div>
        <div class="banner banner-dark">
          <div class="banner-text">
            <span class="banner-tag">💎 Premium</span>
            <h3>Kit completo<br>de maquillaje</h3>
            <a routerLink="/productos" [queryParams]="{category: 'maquillaje'}">Ver kits →</a>
          </div>
          <div class="banner-emoji">💄</div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .home { padding-bottom: 3rem; }

    /* ══════════ SLIDER ══════════ */
    .slider {
      position: relative;
      height: 520px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .slides-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .slide {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      padding: 3rem 4rem;
      opacity: 0;
      transform: translateX(60px);
      transition: opacity 0.6s ease, transform 0.6s ease;
      pointer-events: none;

      &.active {
        opacity: 1;
        transform: translateX(0);
        pointer-events: all;
        z-index: 2;
      }

      &.prev {
        opacity: 0;
        transform: translateX(-60px);
        z-index: 1;
      }
    }

    .slide-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    .slide-particles {
      position: absolute;
      inset: 0;
      z-index: 1;
      overflow: hidden;

      span {
        position: absolute;
        color: var(--accent);
        opacity: 0.15;
        font-size: 1.2rem;
        animation: float 6s infinite ease-in-out;

        &:nth-child(1)  { top: 10%; left: 5%;  animation-delay: 0s;   font-size: 0.8rem; }
        &:nth-child(2)  { top: 20%; left: 15%; animation-delay: 0.5s; font-size: 1.4rem; }
        &:nth-child(3)  { top: 60%; left: 8%;  animation-delay: 1s;   }
        &:nth-child(4)  { top: 80%; left: 20%; animation-delay: 1.5s; font-size: 0.6rem; }
        &:nth-child(5)  { top: 15%; left: 40%; animation-delay: 0.3s; font-size: 1.6rem; }
        &:nth-child(6)  { top: 70%; left: 35%; animation-delay: 2s;   font-size: 0.9rem; }
        &:nth-child(7)  { top: 40%; left: 60%; animation-delay: 0.8s; }
        &:nth-child(8)  { top: 85%; left: 55%; animation-delay: 1.2s; font-size: 1.3rem; }
        &:nth-child(9)  { top: 25%; left: 75%; animation-delay: 0.6s; font-size: 0.7rem; }
        &:nth-child(10) { top: 55%; left: 85%; animation-delay: 1.8s; font-size: 1.5rem; }
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%       { transform: translateY(-20px) rotate(180deg); }
    }

    .slide-content {
      position: relative;
      z-index: 3;
      max-width: 560px;
    }

    .slide-tag {
      display: inline-block;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      padding: 0.3rem 1rem;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      margin-bottom: 1.2rem;
      backdrop-filter: blur(8px);
    }

    .slide-title {
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 900;
      line-height: 1.1;
      color: white;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
      text-shadow: 0 2px 20px rgba(0,0,0,0.3);
    }

    .slide-highlight {
      color: var(--accent);
      -webkit-text-stroke: 0px;
      filter: drop-shadow(0 0 12px var(--accent));
    }

    .slide-desc {
      color: rgba(255,255,255,0.8);
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 420px;
    }

    .slide-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn-slide-primary {
      background: white;
      color: #1a1a24;
      font-weight: 800;
      padding: 0.85rem 2rem;
      border-radius: 999px;
      font-size: 0.95rem;
      transition: all 0.25s;
      &:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
    }

    .btn-slide-ghost {
      color: rgba(255,255,255,0.85);
      border: 1px solid rgba(255,255,255,0.3);
      padding: 0.85rem 1.8rem;
      border-radius: 999px;
      font-size: 0.95rem;
      backdrop-filter: blur(4px);
      transition: all 0.25s;
      &:hover { background: rgba(255,255,255,0.1); border-color: white; color: white; }
    }

    .slide-visual {
      position: absolute;
      right: 3rem;
      font-size: 14rem;
      opacity: 0.18;
      z-index: 2;
      filter: blur(1px);
      transform: rotate(-10deg);
      transition: transform 0.6s ease;
      pointer-events: none;
    }

    .slide.active .slide-visual {
      transform: rotate(-5deg) scale(1.05);
    }

    /* Controles */
    .slider-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      width: 48px; height: 48px;
      border-radius: 50%;
      font-size: 1.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(8px);
      transition: all 0.2s;
      line-height: 1;

      &:hover { background: rgba(255,255,255,0.25); transform: translateY(-50%) scale(1.1); }
      &.left  { left: 1.5rem; }
      &.right { right: 1.5rem; }
    }

    /* Dots */
    .slider-dots {
      position: absolute;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.5rem;
      z-index: 10;
    }

    .dot {
      width: 8px; height: 8px;
      border-radius: 999px;
      background: rgba(255,255,255,0.35);
      border: none;
      cursor: pointer;
      transition: all 0.3s;

      &.active {
        width: 28px;
        background: white;
      }
    }

    /* Barra de progreso */
    .progress-bar {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 3px;
      background: rgba(255,255,255,0.15);
      z-index: 10;
    }

    .progress-fill {
      height: 100%;
      background: white;
      width: 0;
      animation: progress linear forwards;
      animation-play-state: running;
    }

    @keyframes progress {
      from { width: 0; }
      to   { width: 100%; }
    }

    /* ══════════ CATEGORÍAS RÁPIDAS ══════════ */
    .quick-cats {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .cat-pill {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text-soft);
      padding: 0.5rem 1.1rem;
      border-radius: 999px;
      font-size: 0.88rem;
      font-weight: 500;
      transition: all 0.2s;
      white-space: nowrap;

      &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
        background: rgba(232,160,191,0.08);
        transform: translateY(-2px);
      }
    }

    /* ══════════ BANNERS ══════════ */
    .banners {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }

    .banner {
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      transition: transform 0.25s, box-shadow 0.25s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
      }

      &.banner-pink {
        background: linear-gradient(135deg, #c9748f 0%, #e8a0bf 100%);
      }
      &.banner-gold {
        background: linear-gradient(135deg, #8b6914 0%, #f0c060 100%);
      }
      &.banner-dark {
        background: linear-gradient(135deg, #2d1f3d 0%, #5c3d7a 100%);
        border: 1px solid rgba(232,160,191,0.2);
      }
    }

    .banner-text {
      z-index: 1;

      .banner-tag {
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.8);
        margin-bottom: 0.5rem;
      }

      h3 {
        font-size: 1.15rem;
        font-weight: 800;
        color: white;
        line-height: 1.3;
        margin-bottom: 0.9rem;
      }

      a {
        display: inline-block;
        background: rgba(255,255,255,0.2);
        color: white;
        font-size: 0.82rem;
        font-weight: 700;
        padding: 0.4rem 1rem;
        border-radius: 999px;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255,255,255,0.3);
        transition: all 0.2s;

        &:hover { background: rgba(255,255,255,0.35); }
      }
    }

    .banner-emoji {
      font-size: 4rem;
      opacity: 0.3;
      filter: blur(1px);
    }

    /* Responsive */
    @media (max-width: 900px) {
      .slider { height: 420px; }
      .slide  { padding: 2rem; }
      .banners { grid-template-columns: 1fr; }
    }

    @media (max-width: 600px) {
      .slider { height: 380px; border-radius: 0; margin: 0 -1rem 1.5rem; }
      .slide-visual { display: none; }
      .banners { grid-template-columns: repeat(2, 1fr); }
      .banner:last-child { grid-column: span 2; }
    }
  `]
})
export class Home implements OnInit, OnDestroy {

  duration = 5000;
  currentSlide = signal(0);
  prevSlide = signal(-1);
  particles = Array(10).fill(0);
  private timer: any;

  slides: Slide[] = [
    {
      tag: '🔥 Ofertas de temporada',
      title: 'Brilla con',
      highlight: 'hasta 40% OFF',
      description: 'Las mejores marcas de skincare y maquillaje con descuentos increíbles por tiempo limitado.',
      cta: 'Ver ofertas',
      link: '/productos',
      emoji: '✨',
      gradient: 'linear-gradient(135deg, #1a0a2e 0%, #6b2d6b 50%, #c9748f 100%)',
      accentColor: '#f0c060'
    },
    {
      tag: '🆕 Nueva colección',
      title: 'Paletas Rose',
      highlight: 'Gold 2026',
      description: 'Tonos cálidos y dorados para un maquillaje irresistible. Edición limitada disponible ahora.',
      cta: 'Ver colección',
      link: '/productos',
      emoji: '💄',
      gradient: 'linear-gradient(135deg, #2d0a0a 0%, #8b2020 50%, #e8605a 100%)',
      accentColor: '#f0c060'
    },
    {
      tag: '🌸 Skincare premium',
      title: 'Tu piel merece',
      highlight: 'lo mejor',
      description: 'Sérum, cremas y mascarillas con ingredientes naturales. Cuida tu piel con los mejores productos.',
      cta: 'Ver skincare',
      link: '/productos',
      emoji: '🌿',
      gradient: 'linear-gradient(135deg, #0a1f1a 0%, #1a5c4a 50%, #3aab7a 100%)',
      accentColor: '#a0e8c0'
    },
    {
      tag: '💎 Exclusivo online',
      title: 'Fragancias',
      highlight: 'irresistibles',
      description: 'Perfumes de autor con notas únicas. Encuentra tu firma olfativa entre nuestra colección selecta.',
      cta: 'Explorar',
      link: '/productos',
      emoji: '🌸',
      gradient: 'linear-gradient(135deg, #0f0f2e 0%, #1a1a6b 50%, #6060c9 100%)',
      accentColor: '#e8a0bf'
    }
  ];

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  startAutoplay() {
    this.timer = setInterval(() => this.next(), this.duration);
  }

  stopAutoplay() {
    if (this.timer) clearInterval(this.timer);
  }

  next() {
    this.prevSlide.set(this.currentSlide());
    this.currentSlide.set((this.currentSlide() + 1) % this.slides.length);
    this.restartProgress();
  }

  prev() {
    this.prevSlide.set(this.currentSlide());
    this.currentSlide.set((this.currentSlide() - 1 + this.slides.length) % this.slides.length);
    this.restartProgress();
  }

  goTo(index: number) {
    this.prevSlide.set(this.currentSlide());
    this.currentSlide.set(index);
    this.stopAutoplay();
    this.startAutoplay();
    this.restartProgress();
  }

  restartProgress() {
    const bar = document.querySelector('.progress-fill') as HTMLElement;
    if (bar) {
      bar.style.animation = 'none';
      bar.offsetHeight; // reflow
      bar.style.animation = `progress ${this.duration}ms linear forwards`;
    }
  }
}