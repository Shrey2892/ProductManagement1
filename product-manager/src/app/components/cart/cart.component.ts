// import { Component } from '@angular/core';
// import { CartService } from '../../services/cart.service';
// import { CommonModule } from '@angular/common';
// import { ProductLayoutComponent } from '../product-layout/product-layout.component';

// @Component({
//   selector: 'app-cart',
//   standalone:true,
//   imports:[CommonModule, ProductLayoutComponent],
//   templateUrl:'./cart.component.html' 
// })
// export class CartComponent {
//   selectedItems: number[] = [];  

//   constructor(public cartService: CartService) {}

//   remove(id: number) {
//     this.cartService.removeFromCart(id);
//     this.selectedItems = this.selectedItems.filter(x => x !== id); 
//   }

//   increaseQuantity(productId: number) {
//     this.cartService.increaseQuantity(productId);
//   }

//   decreaseQuantity(productId: number) {
//     this.cartService.decreaseQuantity(productId);
//   }

//   toggleSelection(productId: number) {
//     if (this.selectedItems.includes(productId)) {
//       this.selectedItems = this.selectedItems.filter(x => x !== productId);
//     } else {
//       this.selectedItems.push(productId);
//     }
//   }

//   getSelectedTotal() {
//     return this.cartService.getCart()
//       .filter(item => this.selectedItems.includes(item.product.id))
//       .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
//   }
// }



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemService } from '../../services/cartitem.service';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';
import { CartItem } from '../../models/CartItem';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ProductLayoutComponent],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  checkoutInProgress = false;
  cartItems: CartItem[] = [];
  selectedItems: number[] = [];  // store selected product IDs
  isLoading = true;

  constructor(private cartItemService: CartItemService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.cartItemService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load cart items', err);
        this.isLoading = false;
      }
    });
  }

  remove(productId: number) {
    this.cartItemService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
        this.selectedItems = this.selectedItems.filter(id => id !== productId);
      },
      error: (err) => console.error('Failed to remove from cart', err)
    });
  }

  increaseQuantity(productId: number) {
    this.cartItemService.increaseQuantity(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to increase quantity', err)
    });
  }

  decreaseQuantity(productId: number) {
    this.cartItemService.decreaseQuantity(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to decrease quantity', err)
    });
  }

  toggleSelection(productId: number) {
    if (this.selectedItems.includes(productId)) {
      this.selectedItems = this.selectedItems.filter(x => x !== productId);
    } else {
      this.selectedItems.push(productId);
    }
  }

  getSelectedTotal(): number {
    return this.cartItems
      .filter(item => this.selectedItems.includes(item.productId))
      .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }










// checkoutSelected() {
//   if (this.selectedItems.length === 0) return;

//   this.checkoutInProgress = true;

//   // Keep unselected items aside
//   const unselectedItems = this.cartItems.filter(
//     item => !this.selectedItems.includes(item.productId)
//   );

//   // Temporarily set cart to only selected items
//   this.cartItems = this.cartItems.filter(item =>
//     this.selectedItems.includes(item.productId)
//   );

//   this.cartItemService.checkout().subscribe({
//     next: () => {
//       Swal.fire({
//         title: 'Checkout Successful!',
//         text: 'Your selected items have been checked out successfully.',
//         icon: 'success',
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#3085d6'
//       }).then(() => {
//         // After checkout, restore unselected items
//         this.cartItems = unselectedItems;
//         this.selectedItems = [];
//         this.checkoutInProgress = false;
//       });
//     },
//     error: (err) => {
//       const errorMsg = err.error?.message || err.error || 'Unknown error';
//       Swal.fire({
//         title: 'Checkout Failed',
//         text: errorMsg,
//         icon: 'error',
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#d33'
//       });
//       this.checkoutInProgress = false;
//     }
//   });
// }







// checkoutSelected() {
//   if (this.selectedItems.length === 0) return;

//   this.checkoutInProgress = true;

//   // Keep a copy of unselected items
//   const unselectedItems = this.cartItems.filter(
//     item => !this.selectedItems.includes(item.productId)
//   );

//   // Temporarily set cart to only selected items (so backend checks them out)
//   const originalCart = [...this.cartItems];
//   this.cartItems = this.cartItems.filter(item =>
//     this.selectedItems.includes(item.productId)
//   );

//   this.cartItemService.checkout().subscribe({
//     next: () => {
//       Swal.fire({
//         title: 'Checkout Successful!',
//         text: 'Your selected items have been checked out successfully.',
//         icon: 'success',
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#3085d6'
//       }).then(() => {
//         // Restore cart to only unselected items
//         this.cartItems = unselectedItems;
//         this.selectedItems = [];
//         this.checkoutInProgress = false;
//       });
//     },
//     error: (err) => {
//       // Restore full cart if checkout fails
//       this.cartItems = originalCart;

//       const errorMsg = err.error?.message || err.error || 'Unknown error';
//       Swal.fire({
//         title: 'Checkout Failed',
//         text: errorMsg,
//         icon: 'error',
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#d33'
//       });
//       this.checkoutInProgress = false;
//     }
//   });
// }

// cart.component.ts
checkoutSelected() {
  if (this.selectedItems.length === 0) {
    Swal.fire({
      title: 'No Items Selected',
      text: 'Please select items to checkout.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return;
  }

  this.checkoutInProgress = true;

  // Don't modify cartItems array, just send selected IDs to backend
  this.cartItemService.checkoutSelected(this.selectedItems).subscribe({
    next: () => {
      Swal.fire({
        title: 'Checkout Successful!',
        text: 'Your selected items have been checked out successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        // Remove only the selected items from the cart
        this.cartItems = this.cartItems.filter(
          item => !this.selectedItems.includes(item.productId)
        );
        this.selectedItems = [];
        this.checkoutInProgress = false;
      });
    },
    error: (err) => {
      const errorMsg = err.error?.message || err.error || 'Unknown error';
      Swal.fire({
        title: 'Checkout Failed',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
      this.checkoutInProgress = false;
    }
  });
}





}
