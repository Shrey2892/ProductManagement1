import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';
import { CartItemService } from '../../services/cartitem.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ProductLayoutComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartItemService: CartItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlist = items;
      },
      error: (err) => {
        console.error('Failed to load wishlist', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load wishlist items.',
        });
      }
    });
  }

  remove(productId: number) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.loadWishlist();
        Swal.fire({
          icon: 'success',
          title: 'Removed',
          text: 'Item removed from wishlist.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Failed to remove from wishlist', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to remove item from wishlist.',
        });
      }
    });
  }

  addToCart(item: any) {
    // ✅ Check if product is inactive
    if (!item.isActive) {
      Swal.fire({
        icon: 'warning',
        title: 'Product Unavailable',
        text: 'This product is no longer available.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // ✅ Check if product is out of stock
    if (item.stock === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Out of Stock',
        text: 'This product is currently out of stock.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    this.cartItemService.addToCart(item.productId).subscribe({
      next: () => {
        this.remove(item.productId);

        Swal.fire({
          title: 'Added to Cart!',
          text: `${item.productName} has been added to your cart.`,
          icon: 'success',
          confirmButtonText: 'Go to Cart',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/cart']);
        });
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'Something went wrong.';
        Swal.fire({
          title: 'Failed to Add to Cart',
          text: errorMsg,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
        console.error('Add to cart failed:', err);
      }
    });
  }

  // ✅ Helper method to check if product is unavailable
  isProductUnavailable(item: any): boolean {
    return !item.isActive || item.stock === 0;
  }
}