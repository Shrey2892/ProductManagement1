import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductLayoutComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  inWishlist = false;
  wishlistLoading = false;
  quantity: number = 1;

  // reviews state
  reviews: Array<{ author: string; rating: number; text: string; date: string }> = [];
  newReview = { author: '', rating: 5, text: '' };

  constructor(
    private route: ActivatedRoute,
    private service: ProductService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id).subscribe((data) => {
      this.product = data;
      this.checkWishlist();
      this.quantity = this.product?.stockQuantity && this.product.stockQuantity > 0 ? 1 : 0;
      // load initial example reviews (replace with API call if available)
      this.reviews = [
        { author: 'Rohit', rating: 5, text: 'Great product — value for money and fast delivery.', date: '2026-02-10' },
        { author: 'Anita', rating: 4, text: 'Good quality, but packaging could be better.', date: '2026-01-28' }
      ];
    });
  }

  addToCart(): void {
    // placeholder: integrate with cart service later
    console.log('Add to cart:', this.product?.id ?? this.product?.name, 'quantity:', this.quantity);
  }

  incrementQuantity(): void {
    if (!this.product) return;
    if (this.quantity < (this.product.stockQuantity || 1)) this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }

  submitReview(): void {
    const text = (this.newReview.text || '').trim();
    const author = (this.newReview.author || 'Anonymous').trim();
    if (!text) return;

    const r = {
      author,
      rating: this.newReview.rating || 5,
      text,
      date: new Date().toISOString().split('T')[0]
    };

    // Append locally; replace with API call when available
    this.reviews.unshift(r);
    this.newReview = { author: '', rating: 5, text: '' };
    console.log('Submitted review', r);
  }

  averageRating(): number {
    if (!this.reviews.length) return 0;
    const sum = this.reviews.reduce((s, r) => s + r.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  private checkWishlist(): void {
    if (!this.product || !this.product.id) return;
    this.wishlistService.isInWishlist(this.product.id).subscribe({
      next: (res) => this.inWishlist = !!res?.isInWishlist,
      error: (err) => {
        console.warn('Could not check wishlist status', err);
        this.inWishlist = false;
      }
    });
  }

  toggleWishlist(): void {
    if (!this.product || !this.product.id) return;
    this.wishlistLoading = true;

    if (this.inWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id).subscribe({
        next: () => {
          this.inWishlist = false;
          this.wishlistLoading = false;
        },
        error: (err) => {
          console.error('Failed to remove from wishlist', err);
          this.wishlistLoading = false;
        }
      });
    } else {
      this.wishlistService.addToWishlist(this.product.id).subscribe({
        next: () => {
          this.inWishlist = true;
          this.wishlistLoading = false;
        },
        error: (err) => {
          console.error('Failed to add to wishlist', err);
          this.wishlistLoading = false;
        }
      });
    }
  }
}
