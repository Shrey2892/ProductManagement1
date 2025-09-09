import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from '../../models/product';
import { User } from '../../models/User';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-product-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './product-layout.component.html',
  styleUrl: './product-layout.component.css'
})
export class ProductLayoutComponent {
   currentYear: number = new Date().getFullYear();
  searchQuery = '';
    filteredProducts: Product[] = [];
    products: Product[] = [];
    
     user?: User;
    backendBaseUrl = 'http://localhost:5237'; 
    constructor(
    private service: ProductService,
    private router: Router,
    private userService: AuthService, 
    private wishlistService:WishlistService,
    private cartService:CartService
  ) {}


  ngOnInit(): void {
  this.userService.getProfile().subscribe({
    next: (res: User) => {
      this.user = res;   // now user gets the actual object
    },
    error: (err) => {
      console.error('Error fetching user profile', err);
      this.user = undefined;
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
            this.cartService.clearCart(); 
            this.wishlistService.clearWishlist();
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
