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
      name: 'Zapatillas Urban Runner',
      description: 'Zapatillas deportivas con suela de gel y diseño urbano.',
      price: 89900,
      originalPrice: 120000,
      image: 'https://via.placeholder.com/400x400?text=Zapatillas',
      category: 'calzado',
      stock: 15,
      rating: 4.5,
      reviewCount: 128,
      tags: ['deporte', 'oferta']
    },
    {
      id: 2,
      name: 'Camiseta Premium',
      description: 'Camiseta de algodón 100% con corte slim fit.',
      price: 45000,
      image: 'https://via.placeholder.com/400x400?text=Camiseta',
      category: 'ropa',
      stock: 40,
      rating: 4.2,
      reviewCount: 56,
      tags: ['nuevo']
    },
    {
      id: 3,
      name: 'Mochila Explorer',
      description: 'Mochila resistente al agua, capacidad 30L.',
      price: 135000,
      originalPrice: 159000,
      image: 'https://via.placeholder.com/400x400?text=Mochila',
      category: 'accesorios',
      stock: 8,
      rating: 4.8,
      reviewCount: 234,
      tags: ['destacado', 'oferta']
    },
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
      { id: 1, name: 'Calzado', slug: 'calzado', icon: '👟' },
      { id: 2, name: 'Ropa', slug: 'ropa', icon: '👕' },
      { id: 3, name: 'Accesorios', slug: 'accesorios', icon: '🎒' },
    ]);
  }

  searchProducts(query: string): Observable<Product[]> {
    const results = this.mockProducts.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    return of(results);
  }
}
