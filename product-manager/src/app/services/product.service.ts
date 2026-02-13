import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = ' http://localhost:5259/api/Products';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

//   getAll(): Observable<Product[]> {
//   return this.http.get<Product[]>(this.baseUrl);
// }

getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, this.getAuthHeaders());
  }

//   getById(id: number): Observable<Product> {
//   return this.http.get<Product>(`your-api-url/${id}`);
// }
getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }


  create(data: any) {
    return this.http.post(this.baseUrl, data, this.getAuthHeaders());
  }

  update(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.getAuthHeaders());
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}
