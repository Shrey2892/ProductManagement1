import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';

@Component({
  selector: 'app-product-delete',
  standalone: true,
  imports: [CommonModule, ProductLayoutComponent],
  templateUrl:'./product-delete.component.html'
})
export class ProductDeleteComponent implements OnInit {
  id!: number;
  name = '';

  constructor(private route: ActivatedRoute, private service: ProductService, public router: Router) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(this.id).subscribe((product: Product) => this.name = product.name);
  }

  delete() {
    this.service.delete(this.id).subscribe(() => this.router.navigate(['/products']));
  }
}
