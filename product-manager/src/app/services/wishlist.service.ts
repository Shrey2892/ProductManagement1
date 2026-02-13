// import { Injectable } from '@angular/core';
// import { Product } from '../models/product';

// @Injectable({
//   providedIn: 'root'
// })
// export class WishlistService {
//   private wishlistKey = 'wishlist';

//   constructor() {}

//   getWishlist(): Product[] {
//     const data = localStorage.getItem(this.wishlistKey);
//     return data ? JSON.parse(data) : [];
//   }

//   addToWishlist(product: Product): void {
//     const wishlist = this.getWishlist();
//     if (!wishlist.find(p => p.id === product.id)) {
//       wishlist.push(product);
//       localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
//     }
//   }

//   removeFromWishlist(productId: number): void {
//     let wishlist = this.getWishlist();
//     wishlist = wishlist.filter(p => p.id !== productId);
//     localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
//   }

//   isInWishlist(productId: number): boolean {
//     return this.getWishlist().some(p => p.id === productId);
//   }

//   clearWishlist(): void {
//     localStorage.removeItem(this.wishlistKey);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:5259/api/wishlist';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getWishlist(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { productId },
      { headers: this.getHeaders() }
    );
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${productId}`,
      { headers: this.getHeaders() }
    );
  }

  isInWishlist(productId: number): Observable<{ isInWishlist: boolean }> {
    return this.http.get<{ isInWishlist: boolean }>(
      `${this.apiUrl}/check/${productId}`,
      { headers: this.getHeaders() }
    );
  }

  clearWishlist(): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/clear`,
      { headers: this.getHeaders() }
    );
  }
}