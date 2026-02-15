import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemService } from '../../services/cartitem.service';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';
import { CartItem } from '../../models/CartItem';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ProductLayoutComponent],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  checkoutInProgress = false;
  cartItems: CartItem[] = [];
  selectedItems: number[] = [];
  isLoading = true;

  constructor(private cartItemService: CartItemService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.cartItemService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        // ✅ Remove inactive products from selection
        this.selectedItems = this.selectedItems.filter(id => {
          const item = items.find(i => i.productId === id);
          return item && item.product.isActive;
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load cart items', err);
        this.isLoading = false;
      }
    });
  }

  remove(productId: number) {
    this.cartItemService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
        this.selectedItems = this.selectedItems.filter(id => id !== productId);
        
        Swal.fire({
          icon: 'success',
          title: 'Removed',
          text: 'Item removed from cart.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Failed to remove from cart', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to remove item from cart.'
        });
      }
    });
  }

  increaseQuantity(productId: number) {
    const item = this.cartItems.find(i => i.productId === productId);
    
    // ✅ Check if product is inactive
    if (item && !item.product.isActive) {
      Swal.fire({
        icon: 'warning',
        title: 'Product Unavailable',
        text: 'This product is no longer available.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // ✅ Check if out of stock
    if (item && item.product.stockQuantity === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Out of Stock',
        text: 'This product is currently out of stock.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    this.cartItemService.increaseQuantity(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        console.error('Failed to increase quantity', err);
        const errorMsg = err.error?.message || 'Failed to update quantity';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg
        });
      }
    });
  }

  decreaseQuantity(productId: number) {
    const item = this.cartItems.find(i => i.productId === productId);
    
    // ✅ Check if product is inactive
    if (item && !item.product.isActive) {
      Swal.fire({
        icon: 'warning',
        title: 'Product Unavailable',
        text: 'This product is no longer available.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    this.cartItemService.decreaseQuantity(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        console.error('Failed to decrease quantity', err);
        const errorMsg = err.error?.message || 'Failed to update quantity';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg
        });
      }
    });
  }

  toggleSelection(productId: number) {
    const item = this.cartItems.find(i => i.productId === productId);
    
    // ✅ Prevent selection of inactive or out-of-stock products
    if (item && (!item.product.isActive || item.product.stockQuantity === 0)) {
      Swal.fire({
        icon: 'warning',
        title: item.product.isActive ? 'Out of Stock' : 'Product Unavailable',
        text: item.product.isActive 
          ? 'This product is currently out of stock and cannot be selected for checkout.' 
          : 'This product is no longer available and cannot be selected for checkout.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (this.selectedItems.includes(productId)) {
      this.selectedItems = this.selectedItems.filter(x => x !== productId);
    } else {
      this.selectedItems.push(productId);
    }
  }

  getSelectedTotal(): number {
    return this.cartItems
      .filter(item => this.selectedItems.includes(item.productId))
      .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  // ✅ Helper method to check if product is unavailable
  isProductUnavailable(item: CartItem): boolean {
    return !item.product.isActive || item.product.stockQuantity === 0;
  }

  checkoutSelected() {
    if (this.selectedItems.length === 0) {
      Swal.fire({
        title: 'No Items Selected',
        text: 'Please select items to checkout.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    // ✅ Check if any selected items are inactive or out of stock
    const unavailableItems = this.cartItems.filter(item => 
      this.selectedItems.includes(item.productId) && 
      (!item.product.isActive || item.product.stockQuantity === 0)
    );

    if (unavailableItems.length > 0) {
      const itemNames = unavailableItems.map(i => i.product.name).join(', ');
      Swal.fire({
        title: 'Unable to Checkout',
        text: `The following items are unavailable or out of stock: ${itemNames}. Please remove them from your selection.`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
      return;
    }

    this.checkoutInProgress = true;

    this.cartItemService.checkoutSelected(this.selectedItems).subscribe({
      next: () => {
        Swal.fire({
          title: 'Checkout Successful!',
          text: 'Your selected items have been checked out successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.cartItems = this.cartItems.filter(
            item => !this.selectedItems.includes(item.productId)
          );
          this.selectedItems = [];
          this.checkoutInProgress = false;
        });
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.error || 'Unknown error';
        Swal.fire({
          title: 'Checkout Failed',
          text: errorMsg,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
        this.checkoutInProgress = false;
      }
    });
  }
}