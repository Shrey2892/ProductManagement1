import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { User } from '../../models/User';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { CartItemService } from '../../services/cartitem.service';
import Swal from 'sweetalert2';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-product-layout',
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
  templateUrl: './product-layout.component.html',
  styleUrl: './product-layout.component.css'
})
export class ProductLayoutComponent implements OnInit {
   currentYear: number = new Date().getFullYear();
  searchQuery = '';
    filteredProducts: Product[] = [];
    products: Product[] = [];
    
     user?: User;
    backendBaseUrl = 'http://localhost:5259/'; 
    cartCount: number = 0;
    wishlistCount: number = 0;

    get isAdmin(): boolean {
      return this.user?.role === 'Admin';
    }

    get isUser(): boolean {
      return this.user?.role === 'User';
    }
    constructor(
    private service: ProductService,
    private router: Router,
    private userService: AuthService, 
    private wishlistService:WishlistService,
    private cartService:CartItemService
  ) {}


  ngOnInit(): void {
  this.userService.getProfile().subscribe({
    next: (res: User) => {
      this.user = res;   // now user gets the actual object
      this.loadCounts();
    },
    error: (err) => {
      console.error('Error fetching user profile', err);
      this.user = undefined;
    }
  });
}

  private loadCounts(): void {
    if (!this.user) return;

    // cart count
    // cart count - subscribe to shared cart count observable so UI updates in real time
    this.cartService.cartCount$.subscribe({
      next: (count: number) => this.cartCount = count,
      error: (err) => {
        console.warn('Failed to load cart count', err);
        this.cartCount = 0;
      }
    });

    // wishlist count - subscribe to shared count observable so UI updates in real time
    this.wishlistService.wishlistCount$.subscribe({
      next: (count: number) => this.wishlistCount = count,
      error: (err) => {
        console.warn('Failed to load wishlist count', err);
        this.wishlistCount = 0;
      }
    });
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
  }

  get avatarUrl(): string | null {
    if (!this.user || !this.user.imagePath) return null;
    return this.backendBaseUrl + this.user.imagePath;
  }

  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  logout() {
      if (this.userService.isUser()) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you really want to log out? Your wishlist data will be lost.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, log out',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            
            this.userService.logout();
            // clear server-side cart and wishlist; subscribe to ensure requests are sent
            this.cartService.clearCart().subscribe({next:()=>{}, error:()=>{}});
            this.wishlistService.clearWishlist().subscribe({next:()=>{}, error:()=>{}});
            Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
            this.router.navigate(['login']);
          }
        });
      } else {
        
        this.userService.logout();
        this.router.navigate(['login']);
        
      }
    }


}
