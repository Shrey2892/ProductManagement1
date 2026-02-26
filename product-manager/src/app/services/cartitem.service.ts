// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { CartItem } from '../models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartItemService {
  private apiUrl = `${environment.apiBaseUrl}/api/Cart`; // your cart controller base URL
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCount();
  }

  private refreshCount(): void {
    this.getCart().subscribe({ next: items => this.cartCountSubject.next(items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0), error: () => this.cartCountSubject.next(0) });
  }

  // call refresh once on construction
  // (can't call getCart before constructor finishes subscribing elsewhere, but this triggers an initial load)
  ngOnInit(): void { this.refreshCount(); }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}`, this.getAuthHeaders()).pipe(tap(items => this.cartCountSubject.next(items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0)));
  }

  addToCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add/${productId}`, {}, this.getAuthHeaders()).pipe(tap(() => this.refreshCount()));
  }

  // Use productId instead of cart item id
  // removeFromCart(productId: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/remove/${productId}`, this.getAuthHeaders());
  // }

  // removeFromCart(productId: number) {
  //   return this.http.delete(`${this.apiUrl}/remove/${productId}`, { responseType: 'text' });
  // }

  removeFromCart(productId: number) {
    const headers = this.getAuthHeaders().headers;
    return this.http.delete(
      `${this.apiUrl}/remove/${productId}`,
      { headers, responseType: 'text' }
    ).pipe(tap(() => this.refreshCount()));
  }

  // Replace with separate methods
  // increaseQuantity(productId: number): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/increase/${productId}`, {}, this.getAuthHeaders());
  // }

  increaseQuantity(productId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/increase/${productId}`, {}, {
      headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` }),
      responseType: 'text'
    }).pipe(tap(() => this.refreshCount()));
  }

  // decreaseQuantity(productId: number): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/decrease/${productId}`, {}, this.getAuthHeaders());
  // }

  decreaseQuantity(productId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/decrease/${productId}`,
      {},
      {
        headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` }),
        responseType: 'text'
      }
    ).pipe(tap(() => this.refreshCount()));
  }

  // Add missing methods
  getTotalPrice(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`, this.getAuthHeaders());
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, this.getAuthHeaders()).pipe(tap(() => this.refreshCount()));
  }

  // checkout(): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/checkout`, this.getAuthHeaders());
  // }

  checkout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, {}, this.getAuthHeaders());
  }

  // checkoutSelected(productIds: number[]): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/checkout-selected`, productIds, this.getAuthHeaders());
  // }
  // cartitem.service.ts

  checkoutSelected(productIds: number[]): Observable<any> {
    // Wrap the array in an object with productIds property
    const payload = { productIds: productIds };

    return this.http.post(`${this.apiUrl}/checkout-selected`, payload);
  }
}
