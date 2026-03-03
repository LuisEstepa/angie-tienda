// src/app/core/models/product.model.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags?: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}
