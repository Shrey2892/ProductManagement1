// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CartItem } from '../models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartItemService {
  private apiUrl = 'http://localhost:5237/api/Cart'; // ✅ your cart controller base URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

   getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}`, this.getAuthHeaders());
  }

  addToCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add/${productId}`, {}, this.getAuthHeaders());
  }

  // Use productId instead of cart item id
  // removeFromCart(productId: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/remove/${productId}`, this.getAuthHeaders());
  // }

//   removeFromCart(productId: number) {
//   return this.http.delete(`http://localhost:5237/api/Cart/remove/${productId}`, { responseType: 'text' });
// }

removeFromCart(productId: number) {
  const headers = this.getAuthHeaders().headers;  // extract headers from your existing method
  return this.http.delete(
    `http://localhost:5237/api/Cart/remove/${productId}`,
    { headers, responseType: 'text' }
  );
}



  // Replace with separate methods
  // increaseQuantity(productId: number): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/increase/${productId}`, {}, this.getAuthHeaders());
  // }

  increaseQuantity(productId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/increase/${productId}`, {}, { 
    headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` }),
    responseType: 'text'  // tell Angular to expect plain text response
  });
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
  );
}


  // Add missing methods
  getTotalPrice(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`, this.getAuthHeaders());
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, this.getAuthHeaders());
  }

//   checkout(): Observable<any> {
//   return this.http.post(`${this.apiUrl}/checkout`,this.getAuthHeaders()); // no user ID needed
// }

checkout(): Observable<any> {
  return this.http.post(`${this.apiUrl}/checkout`, {}, this.getAuthHeaders());
}


checkoutSelected(productIds: number[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/checkout-selected`, productIds, this.getAuthHeaders());
}



}



