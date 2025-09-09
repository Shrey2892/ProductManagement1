import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordError: string = '';

  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    // ✅ grab token from query param
    this.token = (this.route.snapshot.queryParamMap.get('token') || '').replace(/ /g, '+');
  }

  get passwordMismatch(): boolean {
    return this.newPassword !== this.confirmPassword;
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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  setPassword() {
    if (this.isSubmitting) return;

    if (!this.validatePassword(this.newPassword)) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: this.passwordError
      });
      return;
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

    this.authService.setPasswordWithToken(this.token, this.newPassword).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Password Set Successfully',
          text: typeof res === 'string' ? res : 'Your password has been updated.'
        });
        this.isSubmitting = false;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error || 'Something went wrong. Please try again.'
        });
        this.isSubmitting = false;
      }
    });
  }
}
