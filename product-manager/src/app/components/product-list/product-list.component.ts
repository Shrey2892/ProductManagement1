// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterLink } from '@angular/router';
// import { ProductService } from '../../services/product.service';
// import { Product } from '../../models/product';
// import { User } from '../../models/User';
// import { AuthService } from '../../services/auth.service';
// import { FormsModule } from '@angular/forms';
// import { WishlistService } from '../../services/wishlist.service';
// // ❌ Removed CartService
// import { CartItemService } from '../../services/cartitem.service'; // ✅ Using CartItemService instead
// import { ProductLayoutComponent } from '../product-layout/product-layout.component';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-product-list',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './product-list.component.html',
//   styleUrls: ['./product-list.component.css']
// })
// export class ProductListComponent implements OnInit {
//   currentPage: number = 1;
// itemsPerPage: number = 6;  // adjust as needed
// paginatedProducts: Product[] = [];
//   cartCount: number = 0;
//   searchQuery = '';
//   filteredProducts: Product[] = [];
//   products: Product[] = [];
//   user?: User;
//   wishlistCount: number = 0;

//   backendBaseUrl = 'http://localhost:5259';

//   constructor(
//     private service: ProductService,
//     private router: Router,
//     public userService: AuthService,
//     public wishlistService: WishlistService,
//     private cartItemService: CartItemService // ✅ Replaced CartService with CartItemService
//   ) {}

//   ngOnInit() {
//     this.service.getAll().subscribe((data) => {
//       this.products = data;
//       this.filteredProducts = data;
//        this.currentPage = 1;
//     this.updatePagination(); 
//     });

//     this.userService.getProfile().subscribe({
//       next: (profile) => {
//         this.user = profile;
//         console.log('Loaded user profile →', this.user);
//       },
//       error: (err) => console.error('Failed to load user profile', err)
//     });

//     // ✅ Fetch cart count from API
//     this.cartItemService.getCart().subscribe({
//       next: (items) => {
//         this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
//       },
//       error: (err) => {
//         console.error('Failed to load cart items', err);
//       }
//     });
//   }

//   get avatarUrl(): string | null {
//     if (!this.user || !this.user.imagePath) return null;
//     return this.backendBaseUrl + this.user.imagePath;
//   }

//   logout() {
//     if (this.userService.isUser()) {
//       Swal.fire({
//         title: 'Are you sure?',
//         text: 'Do you really want to log out? Your wishlist data will be lost.',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, log out',
//         cancelButtonText: 'Cancel'
//       }).then((result) => {
//         if (result.isConfirmed) {
//           this.userService.logout();
//           this.cartItemService.clearCart().subscribe(); // ✅ Clear server-side cart
//           this.wishlistService.clearWishlist();
//           Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
//           this.router.navigate(['login']);
//         }
//       });
//     } else {
//       this.userService.logout();
//       this.router.navigate(['login']);
//     }
//   }

//   view(id: number) {
//     this.router.navigate(['/products', id]);
//   }

//   edit(id: number) {
//     if (!this.isAdmin) {
//       alert('You do not have permission to edit products.');
//       return;
//     }
//     this.router.navigate(['/update-product', id]);
//   }

//   remove(id: number) {
//     if (!this.isAdmin) {
//       alert('You do not have permission to delete products.');
//       return;
//     }
//     this.router.navigate(['/delete-product', id]);
//   }

//   goToCreate() {
//     this.router.navigate(['/create-product']);
//   }

//   goToEditProfile() {
//     this.router.navigate(['/edit-profile']);
//   }

//   get isAdmin(): boolean {
//     return this.user?.role === 'Admin';
//   }

//   get isUser(): boolean {
//     return this.user?.role === 'User';
//   }

//   get totalPages(): number {
//   return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
// }


//   onSearch() {
//     const query = this.searchQuery.trim().toLowerCase();
//     if (!query) {
//       this.filteredProducts = this.products;
//     } else {
//       this.filteredProducts = this.products.filter(p =>
//         (p.category && p.category.toLowerCase().includes(query)) ||
//         (p.name && p.name.toLowerCase().includes(query))
//       );
//     }
//     this.currentPage = 1;      // reset to first page
//   this.updatePagination(); 
//   }

//   // ✅ Updated to use CartItemService and sync count with backend
//   addToCart(product: Product) {
//     this.cartItemService.addToCart(product.id).subscribe({
//       next: () => {
//         this.cartItemService.getCart().subscribe({
//           next: (items) => {
//             this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
//             console.log('Cart now:', items);
//           }
//         });
//       },
//       error: (err) => {
//         console.error('Failed to add to cart', err);
//       }
//     });
//   }

//   toggleWishlist(product: Product): void {
//     if (this.wishlistService.isInWishlist(product.id)) {
//       this.wishlistService.removeFromWishlist(product.id);
//     } else {
//       this.wishlistService.addToWishlist(product);
//     }
//   }

//   isInWishlist(productId: number): boolean {
//     return this.wishlistService.isInWishlist(productId);
//   }

//   updatePagination() {
//   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//   const endIndex = startIndex + this.itemsPerPage;
//   this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
// }

// nextPage() {
//   if (this.currentPage * this.itemsPerPage < this.filteredProducts.length) {
//     this.currentPage++;
//     this.updatePagination();
//   }
// }

// prevPage() {
//   if (this.currentPage > 1) {
//     this.currentPage--;
//     this.updatePagination();
//   }
// }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../services/wishlist.service';
import { CartItemService } from '../../services/cartitem.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 6;
  paginatedProducts: Product[] = [];
  cartCount: number = 0;
  searchQuery = '';
  filteredProducts: Product[] = [];
  products: Product[] = [];
  user?: User;
  wishlistCount: number = 0;
  wishlistProductIds: Set<number> = new Set(); // ✅ Track wishlist items

  backendBaseUrl = 'http://localhost:5259/';

  constructor(
    private service: ProductService,
    private router: Router,
    public userService: AuthService,
    public wishlistService: WishlistService,
    private cartItemService: CartItemService
  ) {}

  ngOnInit() {
    this.service.getAll().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
      this.currentPage = 1;
      this.updatePagination();
    });

    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        console.log('Loaded user profile →', this.user);
      },
      error: (err) => console.error('Failed to load user profile', err)
    });

    // ✅ Fetch cart count from API
    this.cartItemService.getCart().subscribe({
      next: (items) => {
        this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
      },
      error: (err) => {
        console.error('Failed to load cart items', err);
      }
    });

    // ✅ Load wishlist items
    this.loadWishlist();
  }

  // ✅ Load wishlist and populate the Set
  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistProductIds = new Set(items.map(item => item.productId));
        this.wishlistCount = items.length;
      },
      error: (err) => {
        console.error('Failed to load wishlist', err);
      }
    });
  }

  get avatarUrl(): string | null {
    if (!this.user || !this.user.imagePath) return null;
    return this.backendBaseUrl + this.user.imagePath;
  }

  logout() {
    if (this.userService.isUser()) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.logout();
          this.cartItemService.clearCart().subscribe();
          this.wishlistService.clearWishlist().subscribe(); // ✅ Updated to use Observable
          Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
          this.router.navigate(['login']);
        }
      });
    } else {
      this.userService.logout();
      this.router.navigate(['login']);
    }
  }

  view(id: number) {
    this.router.navigate(['/products', id]);
  }

  edit(id: number) {
    if (!this.isAdmin) {
      alert('You do not have permission to edit products.');
      return;
    }
    this.router.navigate(['/update-product', id]);
  }

  remove(id: number) {
    if (!this.isAdmin) {
      alert('You do not have permission to delete products.');
      return;
    }
    this.router.navigate(['/delete-product', id]);
  }

  goToCreate() {
    this.router.navigate(['/create-product']);
  }

  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  get isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }

  get isUser(): boolean {
    return this.user?.role === 'User';
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  onSearch() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p =>
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.name && p.name.toLowerCase().includes(query))
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  addToCart(product: Product) {
    this.cartItemService.addToCart(product.id).subscribe({
      next: () => {
        this.cartItemService.getCart().subscribe({
          next: (items) => {
            this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
            console.log('Cart now:', items);
          }
        });
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
      }
    });
  }

  // ✅ Fixed: Now uses product ID and API calls
  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product.id)) {
      // Remove from wishlist
      this.wishlistService.removeFromWishlist(product.id).subscribe({
        next: () => {
          this.wishlistProductIds.delete(product.id);
          this.wishlistCount--;
          Swal.fire({
            icon: 'success',
            title: 'Removed from Wishlist',
            text: `${product.name} has been removed from your wishlist.`,
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error('Failed to remove from wishlist', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to remove from wishlist. Please try again.',
          });
        }
      });
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist(product.id).subscribe({
        next: () => {
          this.wishlistProductIds.add(product.id);
          this.wishlistCount++;
          Swal.fire({
            icon: 'success',
            title: 'Added to Wishlist',
            text: `${product.name} has been added to your wishlist.`,
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error('Failed to add to wishlist', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || 'Failed to add to wishlist. Please try again.',
          });
        }
      });
    }
  }

  // ✅ Fixed: Now checks the Set synchronously
  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds.has(productId);
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.filteredProducts.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}
