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
import { environment } from '../../../environments/environment';

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
  wishlistProductIds: Set<number> = new Set();

  // ✅ Category state
  selectedCategory: string = 'All';
  allCategories: string[] = [];

  backendBaseUrl = environment.apiBaseUrl;

  // ✅ Master category map (source of truth for all possible categories)
  private readonly allPossibleCategories: string[] = [
    'Electronics', 'Accessories', 'Headphones', 'Gaming', 'Clothing', 'Footwear', 'Home', 'Furniture',
    'Kitchen', 'Appliances', 'Decor', 'Beauty', 'Sports', 'Fitness',
    'Grocery', 'Books', 'Stationery'
  ];

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
      this.refreshFilteredProducts();
    });

    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.refreshFilteredProducts();
      },
      error: (err) => console.error('Failed to load user profile', err)
    });

    this.cartItemService.getCart().subscribe({
      next: (items) => {
        this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
      },
      error: (err) => console.error('Failed to load cart items', err)
    });

    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistProductIds = new Set(items.map(item => item.productId));
        this.wishlistCount = items.length;
      },
      error: (err) => console.error('Failed to load wishlist', err)
    });
  }

  get avatarUrl(): string | null {
    if (!this.user || !this.user.imagePath) return null;
    return `${this.backendBaseUrl}/${this.user.imagePath}`;
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
          this.wishlistService.clearWishlist().subscribe();
          Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
          this.router.navigate(['login']);
        }
      });
    } else {
      this.userService.logout();
      this.router.navigate(['login']);
    }
  }

  view(id: number) { this.router.navigate(['/products', id]); }

  edit(id: number) {
    if (!this.isAdmin) { alert('No permission.'); return; }
    this.router.navigate(['/update-product', id]);
  }

  remove(id: number) {
    if (!this.isAdmin) { alert('No permission.'); return; }
    this.router.navigate(['/delete-product', id]);
  }

  goToCreate() { this.router.navigate(['/create-product']); }
  goToEditProfile() { this.router.navigate(['/edit-profile']); }

  get isAdmin(): boolean { return this.user?.role === 'Admin'; }
  get isUser(): boolean { return this.user?.role === 'User'; }

  get totalPages(): number {
    return Math.ceil(this.displayedProducts.length / this.itemsPerPage);
  }

  // ✅ Products shown after category filter
  get displayedProducts(): Product[] {
    if (this.selectedCategory === 'All') return this.filteredProducts;
    return this.filteredProducts.filter(p => p.category === this.selectedCategory);
  }

  // Removed getCategoryCount - no longer needed as we show all categories regardless of count

  // ✅ Map category name to a Bootstrap Icon class
  getCategoryIcon(category: string): string {
    const map: Record<string, string> = {
      // Electronics & Tech
      'electronics':      'bi bi-cpu-fill',
      'phones':           'bi bi-phone-fill',
      'accessories':      'bi bi-headset',
      'headphones':       'bi bi-headphones',
      'cameras':          'bi bi-camera-fill',
      'tv':               'bi bi-tv-fill',
      'gaming':           'bi bi-controller',
      // Fashion
      'fashion':          'bi bi-bag-heart-fill',
      'clothing':         'bi bi-tags-fill',
      'men':              'bi bi-person-fill',
      'women':            'bi bi-person-dress',
      'shoes':            'bi bi-bag-fill',
      'footwear':         'bi bi-person-walking',
      // Home & Living
      'home':             'bi bi-house-heart-fill',
      'furniture':        'bi bi-easel-fill',
      'kitchen':          'bi bi-cup-hot-fill',
      'appliances':       'bi bi-plug-fill',
      'decor':            'bi bi-lamp-fill',
      // Beauty & Health
      'beauty':           'bi bi-stars',
      //'skincare':         'bi bi-droplet-fill',
      //'health':           'bi bi-heart-pulse-fill',
      'sports':           'bi bi-trophy-fill',
      'fitness':          'bi bi-bicycle',
      // Food & Grocery
      'grocery':          'bi bi-basket-fill',
      // Books & Stationery
      'books':            'bi bi-book-fill',
      'stationery':       'bi bi-pencil-fill',
      // Toys & Kids
    };

    const key = category.toLowerCase().trim();
    // Exact match first
    if (map[key]) return map[key];
    // Partial match
    for (const [k, v] of Object.entries(map)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
    // Fallback
    return 'bi bi-tag-fill';
  }

  // ✅ Select a category pill
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.updatePagination();
  }

  onSearch() {
    this.selectedCategory = 'All'; // reset category on search
    this.refreshFilteredProducts(this.searchQuery);
  }

  refreshFilteredProducts(query?: string) {
    const q = query?.trim().toLowerCase();

    // Admins see all products; users see only active ones
    let base = this.products.filter(p => this.isAdmin ? true : p.isActive);

    if (q) {
      base = base.filter(p =>
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q))
      );
    }

    this.filteredProducts = base;

    // Always show all possible categories, regardless of current filter
    this.allCategories = [...this.allPossibleCategories];

    this.currentPage = 1;
    this.updatePagination();
  }

  addToCart(product: Product) {
    this.cartItemService.addToCart(product.id).subscribe({
      next: () => {
        this.cartItemService.getCart().subscribe({
          next: (items) => {
            this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
          }
        });
      },
      error: (err) => console.error('Failed to add to cart', err)
    });
  }

  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id).subscribe({
        next: () => {
          this.wishlistProductIds.delete(product.id);
          this.wishlistCount--;
          Swal.fire({ icon: 'success', title: 'Removed from Wishlist', text: `${product.name} removed.`, timer: 1500, showConfirmButton: false });
        },
        error: (err) => console.error('Failed to remove from wishlist', err)
      });
    } else {
      this.wishlistService.addToWishlist(product.id).subscribe({
        next: () => {
          this.wishlistProductIds.add(product.id);
          this.wishlistCount++;
          Swal.fire({ icon: 'success', title: 'Added to Wishlist', text: `${product.name} added.`, timer: 1500, showConfirmButton: false });
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || 'Failed to add to wishlist.' });
        }
      });
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds.has(productId);
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedProducts = this.displayedProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
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
