import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductLayoutComponent],
  templateUrl: './product-create.component.html',
  styleUrl:'./product-create.component.css'
   
})
export class ProductCreateComponent {
  name = '';
  description = '';
  price: number = 0;
  stockQuantity: number = 0;
  sku = '';
  category = '';
  imageUrl = '';
  isActive = true;

  constructor(private service: ProductService, private router: Router) {}

  submit() {
    const productData: Omit<Product, 'id' | 'createdAt'> = {
      name: this.name,
      description: this.description,
      price: this.price,
      stockQuantity: this.stockQuantity,
      sku: this.sku,
      category: this.category,
      imageUrl: this.imageUrl,
      isActive: this.isActive
    };

    this.service.create(productData).subscribe({
      next: () => this.router.navigate(['/products']),
      error: err => alert(err.error)
    });
  }
}
