// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { WishlistService } from '../../services/wishlist.service';
// import { Product } from '../../models/product';
// import { ProductLayoutComponent } from '../product-layout/product-layout.component';
// import { CartItemService } from '../../services/cartitem.service';  // ✅ updated to use CartItemService
// import Swal from 'sweetalert2';  // ✅ SweetAlert2

// @Component({
//   selector: 'app-wishlist',
//   standalone: true,
//   imports: [CommonModule, ProductLayoutComponent],
//   templateUrl: './wishlist.component.html',
//   styleUrls: ['./wishlist.component.css']
// })
// export class WishlistComponent implements OnInit {
//   wishlist: Product[] = [];

//   constructor(
//     private wishlistService: WishlistService,
//     private cartItemService: CartItemService,  // ✅ updated service
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.wishlist = this.wishlistService.getWishlist();
//   }

//   remove(productId: number) {
//     this.wishlistService.removeFromWishlist(productId);
//     this.wishlist = this.wishlistService.getWishlist();
//   }

//   addToCart(product: Product) {
//     this.cartItemService.addToCart(product.id).subscribe({
//       next: () => {
//         this.remove(product.id);  // remove from wishlist on success

//         Swal.fire({
//           title: 'Added to Cart!',
//           text: `${product.name} has been added to your cart.`,
//           icon: 'success',
//           confirmButtonText: 'Go to Cart',
//           confirmButtonColor: '#28a745'
//         }).then(() => {
//           this.router.navigate(['/cart']);
//         });
//       },
//       error: (err) => {
//         const errorMsg = err.error?.message || err.message || 'Something went wrong.';
//         Swal.fire({
//           title: 'Failed to Add to Cart',
//           text: errorMsg,
//           icon: 'error',
//           confirmButtonText: 'OK',
//           confirmButtonColor: '#d33'
//         });
//         console.error('Add to cart failed:', err);
//       }
//     });
//   }
// }

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
  wishlist: any[] = []; // ✅ Changed from Product[] to any[] to match API response

  constructor(
    private wishlistService: WishlistService,
    private cartItemService: CartItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  // ✅ Load wishlist from API
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

  // ✅ Updated to use productId from wishlist item
  remove(productId: number) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.loadWishlist(); // Reload wishlist after removal
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

  // ✅ Updated to use productId from wishlist item
  addToCart(item: any) {
    this.cartItemService.addToCart(item.productId).subscribe({
      next: () => {
        this.remove(item.productId); // Remove from wishlist on success

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
}