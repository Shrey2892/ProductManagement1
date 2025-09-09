import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-not-allowed',
  standalone:true,
  imports: [RouterLink, ProductLayoutComponent],
  templateUrl: './not-allowed.component.html',
  styleUrl: './not-allowed.component.css'
})
export class NotAllowedComponent {

}
