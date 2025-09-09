import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductLayoutComponent],
  templateUrl:'./product-update.component.html'
})
export class ProductUpdateComponent implements OnInit {
  id!: number;
  loaded = false;

  name = '';
  description = '';
  price = 0;
  stockQuantity = 0;
  sku = '';
  category = '';
  imageUrl = '';
  isActive = true;

  constructor(
    private route: ActivatedRoute,
    private service: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(this.id).subscribe((product: Product) => {
      this.name = product.name;
      this.description = product.description;
      this.price = product.price;
      this.stockQuantity = product.stockQuantity;
      this.sku = product.sku;
      this.category = product.category;
      this.imageUrl = product.imageUrl;
      this.isActive = product.isActive;
      this.loaded = true;
    });
  }

  submit() {
    const updatedProduct: Omit<Product, 'id' | 'createdAt'> = {
      name: this.name,
      description: this.description,
      price: this.price,
      stockQuantity: this.stockQuantity,
      sku: this.sku,
      category: this.category,
      imageUrl: this.imageUrl,
      isActive: this.isActive
    };

    this.service.update(this.id, updatedProduct).subscribe({
      next: () => this.router.navigate(['/products']),
      error: err => alert(err.error)
    });
  }
}
