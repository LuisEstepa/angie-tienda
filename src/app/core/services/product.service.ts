// src/app/core/services/product.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, Category } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private apiUrl = environment.apiUrl;

  // Datos de ejemplo (reemplazar con llamadas reales a tu API)
  private mockProducts: Product[] = [
  {
    id: 1,
    name: 'Base de Maquillaje HD',
    description: 'Cobertura total de larga duración con efecto mate. SPF 15.',
    price: 89900,
    originalPrice: 120000,
    image: 'https://images.unsplash.com/photo-1631214524020-3c69b3f4c2a3?w=400&h=400&fit=crop',
    category: 'maquillaje',
    stock: 20,
    rating: 4.8,
    reviewCount: 312,
    tags: ['oferta', 'destacado']
  },
  {
    id: 2,
    name: 'Paleta de Sombras Rose Gold',
    description: '18 tonos cálidos y brillantes, altamente pigmentados.',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop',
    category: 'maquillaje',
    stock: 12,
    rating: 4.9,
    reviewCount: 528,
    tags: ['destacado', 'nuevo']
  },
  {
    id: 3,
    name: 'Labial Mate Terciopelo',
    description: 'Acabado mate aterciopelado de 12 horas. No reseca.',
    price: 42000,
    originalPrice: 55000,
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2177?w=400&h=400&fit=crop',
    category: 'maquillaje',
    stock: 35,
    rating: 4.6,
    reviewCount: 189,
    tags: ['oferta']
  },
  {
    id: 4,
    name: 'Sérum Vitamina C',
    description: 'Ilumina y unifica el tono. Antioxidante con ácido hialurónico.',
    price: 198000,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    category: 'skincare',
    stock: 18,
    rating: 4.9,
    reviewCount: 743,
    tags: ['destacado', 'nuevo']
  },
  {
    id: 5,
    name: 'Crema Hidratante 24H',
    description: 'Hidratación profunda con ceramidas y manteca de karité.',
    price: 87000,
    originalPrice: 105000,
    image: 'https://images.unsplash.com/photo-1601049541271-ea01c1f85c20?w=400&h=400&fit=crop',
    category: 'skincare',
    stock: 25,
    rating: 4.7,
    reviewCount: 421,
    tags: ['oferta']
  },
  {
    id: 6,
    name: 'Mascarilla de Arcilla Rosa',
    description: 'Limpia poros en profundidad. Suaviza y reafirma la piel.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
    category: 'skincare',
    stock: 30,
    rating: 4.5,
    reviewCount: 267,
    tags: ['nuevo']
  },
  {
    id: 7,
    name: 'Perfume Bloom Floral',
    description: 'Fragancia floral con notas de jazmín, rosa y sándalo.',
    price: 320000,
    originalPrice: 389000,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop',
    category: 'fragancias',
    stock: 8,
    rating: 4.9,
    reviewCount: 634,
    tags: ['oferta', 'destacado']
  },
  {
    id: 8,
    name: 'Aceite Capilar Argan',
    description: 'Repara y brilla el cabello dañado. Libre de sulfatos.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=400&h=400&fit=crop',
    category: 'cabello',
    stock: 22,
    rating: 4.7,
    reviewCount: 358,
    tags: ['nuevo']
  },
  {
    id: 9,
    name: 'Mascarilla Capilar Nutritiva',
    description: 'Tratamiento intensivo con proteínas de seda y keratina.',
    price: 58000,
    originalPrice: 72000,
    image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&h=400&fit=crop',
    category: 'cabello',
    stock: 40,
    rating: 4.4,
    reviewCount: 195,
    tags: ['oferta']
  },
  {
    id: 10,
    name: 'Brocha Kabuki Profesional',
    description: 'Cerdas sintéticas ultrasuaves. Perfecta para base y contorno.',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
    category: 'herramientas',
    stock: 15,
    rating: 4.6,
    reviewCount: 142,
    tags: ['nuevo']
  },
  {
    id: 11,
    name: 'Rizador Cerámico 32mm',
    description: 'Tecnología cerámica tourmaline. Temperatura regulable 150-230°C.',
    price: 215000,
    originalPrice: 269000,
    image: 'https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=400&h=400&fit=crop',
    category: 'herramientas',
    stock: 10,
    rating: 4.8,
    reviewCount: 287,
    tags: ['oferta', 'destacado']
  },
  {
    id: 12,
    name: 'Kit Uñas Gel Completo',
    description: 'Lámpara UV + 12 colores de gel + base y top coat.',
    price: 189000,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop',
    category: 'uñas',
    stock: 6,
    rating: 4.5,
    reviewCount: 98,
    tags: ['nuevo', 'destacado']
  }
];

  constructor(private http: HttpClient) {}

  getProducts(category?: string): Observable<Product[]> {
    // Cuando tengas una API real:
    // return this.http.get<Product[]>(`${this.apiUrl}/products`);
    const filtered = category
      ? this.mockProducts.filter(p => p.category === category)
      : this.mockProducts;
    return of(filtered);
  }

  getProductById(id: number): Observable<Product | undefined> {
    // return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
    return of(this.mockProducts.find(p => p.id === id));
  }

  getCategories(): Observable<Category[]> {
    return of([
      { id: 1, name: 'maquillaje', slug: 'maquillaje', icon: '💄' },
      { id: 2, name: 'skincare', slug: 'skincare', icon: '✨' },
      { id: 3, name: 'fragancias', slug: 'fragancias', icon: '🌸' },
      { id: 4, name: 'cabello', slug: 'cabello', icon: '💇' },
      { id: 5, name: 'uñas', slug: 'uñas', icon: '💅' },
      { id: 6, name: 'herramientas', slug: 'herramientas', icon: '🪄' },
    ]);
  }

  searchProducts(query: string): Observable<Product[]> {
    const results = this.mockProducts.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    return of(results);
  }
  addProduct(product: Product): void {
  const newProduct = { ...product, id: Date.now() };
  this.mockProducts.push(newProduct);
  }

  updateProduct(product: Product): void {
    const index = this.mockProducts.findIndex(p => p.id === product.id);
    if (index !== -1) this.mockProducts[index] = product;
  }

  deleteProduct(id: number): void {
    this.mockProducts = this.mockProducts.filter(p => p.id !== id);
  }
}
