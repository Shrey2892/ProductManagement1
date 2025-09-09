import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from './models/product';
import { FooterComponent } from './components/footer/footer.component';
import { Router, NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showFooter = true;
  title = 'product-manager';
  searchQuery = '';
   filteredProducts: Product[] = [];
   products: Product[] = [];
  onSearch() {
  const query = this.searchQuery.trim().toLowerCase();
  if (!query) {
    this.filteredProducts = this.products;
  } else {
    this.filteredProducts = this.products.filter(p =>
      p.category && p.category.toLowerCase().includes(query)
    );
  }
}

constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide footer on login and register pages
        this.showFooter = !['/login', '/register','/forgot-password','/set-password'].includes(event.urlAfterRedirects);
      });
    }

}
