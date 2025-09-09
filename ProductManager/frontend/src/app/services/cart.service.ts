import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart';
  private cart: { product: Product, quantity: number }[] = [];

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor() {
    this.loadCart();
  }

  // Load cart from localStorage
  private loadCart() {
    const storedCart = localStorage.getItem(this.cartKey);
    this.cart = storedCart ? JSON.parse(storedCart) : [];
    this.updateCartCount();
  }

  // Save cart to localStorage
  private saveCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    this.updateCartCount();
  }

  // Update BehaviorSubject count
  private updateCartCount() {
    const total = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.next(total);
  }

  getCart() {
    return this.cart;
  }

  addToCart(product: Product) {
    const existingItem = this.cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
    this.saveCart();
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  increaseQuantity(productId: number) {
    const item = this.cart.find(i => i.product.id === productId);
    if (item) {
      item.quantity++;
      this.saveCart();
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.cart.find(i => i.product.id === productId);
    if (item && item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeFromCart(productId);
    }
    this.saveCart();
  }
}
