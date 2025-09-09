// src/app/models/product.model.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  sku: string;
  category: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string; // Use string because it's returned as ISO date from backend
}
