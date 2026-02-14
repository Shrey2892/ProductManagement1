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
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:5259/api/wishlist';
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient) {
    // populate initial count
    this.refreshCount();
  }

  // helper: refresh count from API
  private refreshCount(): void {
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .subscribe({ next: items => this.wishlistCountSubject.next(items?.length || 0), error: () => this.wishlistCountSubject.next(0) });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getWishlist(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(tap(items => this.wishlistCountSubject.next(items?.length || 0)));
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { productId },
      { headers: this.getHeaders() }
    ).pipe(tap(() => this.refreshCount()));
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${productId}`,
      { headers: this.getHeaders() }
    ).pipe(tap(() => this.refreshCount()));
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
    ).pipe(tap(() => this.refreshCount()));
  }

}