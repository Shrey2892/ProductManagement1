// add-user.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductLayoutComponent],
  templateUrl: './add-user.component.html'
})
export class AddUserComponent {
  username: string = '';
  email: string = '';
  role: string = 'User';
  isSubmitting = false;

  constructor(private authService: AuthService) {}

  addUser() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.authService.addUser({
      username: this.username,
      email: this.email,
      role: this.role
    }).subscribe({
      next: (res: string) => {
        Swal.fire({
          icon: 'success',
          title: 'User Added',
          text: typeof res === 'string' ? res : 'The user has been added successfully.'
        });
        this.isSubmitting = false;

        // clear form after success
        this.username = '';
        this.email = '';
        this.role = 'User';
      },
      error: (err) => {
        let message = 'Failed to add user.';
        if (err.error) {
          if (typeof err.error === 'string') {
            message = err.error;
          } else if (err.error.message) {
            message = err.error.message;
          } else {
            message = JSON.stringify(err.error);
          }
        } else if (err.message) {
          message = err.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message
        });

        this.isSubmitting = false;
      }
    });
  }
}
