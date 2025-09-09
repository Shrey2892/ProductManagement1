import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistKey = 'wishlist';

  constructor() {}

  getWishlist(): Product[] {
    const data = localStorage.getItem(this.wishlistKey);
    return data ? JSON.parse(data) : [];
  }

  addToWishlist(product: Product): void {
    const wishlist = this.getWishlist();
    if (!wishlist.find(p => p.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
    }
  }

  removeFromWishlist(productId: number): void {
    let wishlist = this.getWishlist();
    wishlist = wishlist.filter(p => p.id !== productId);
    localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
  }

  isInWishlist(productId: number): boolean {
    return this.getWishlist().some(p => p.id === productId);
  }

  clearWishlist(): void {
    localStorage.removeItem(this.wishlistKey);
  }
}
