import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  isSubmitting = false;
  selectedFile?: File;
  role = 'User';
  showPassword = false;
  showConfirmPassword = false;

  passwordError: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  get passwordMismatch(): boolean {
    return this.password !== this.confirmPassword;
  }

  validatePassword(password: string): boolean {
    const requirements = [
      { regex: /.{8,}/, message: 'At least 8 characters' },
      { regex: /[A-Z]/, message: 'At least one uppercase letter' },
      { regex: /[a-z]/, message: 'At least one lowercase letter' },
      { regex: /\d/, message: 'At least one number' },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'At least one special character' }
    ];

    const unmet = requirements.filter(r => !r.regex.test(password)).map(r => r.message);

    if (unmet.length > 0) {
      this.passwordError = 'Password must have: ' + unmet.join(', ');
      return false;
    }

    this.passwordError = '';
    return true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  register() {
    if (this.isSubmitting) return;

    if (!this.validatePassword(this.password)) {
      return; // stop if password is weak
    }

    if (this.passwordMismatch) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.'
      });
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('role', this.role);

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.auth.registerWithImage(formData).subscribe({
      next: (res) => {
        const message = typeof res === 'string' ? res : 'Registration successful!';
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: message,
          confirmButtonText: 'Go to Email verification'
        }).then(() => {
          this.router.navigate(['verify']);
        });
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Registration error:', err);

        let message = 'Registration failed.';
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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
