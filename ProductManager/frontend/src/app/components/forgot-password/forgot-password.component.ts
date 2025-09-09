import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-forgot-password',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {









  email: string = '';
  otp: string = '';
  newPassword: string = '';
  step: number = 1; // Step 1: request OTP, Step 2: reset password
  message: string = '';

  constructor(private authService: AuthService) {}

  requestOtp() {
    if (!this.email) {
      this.message = 'Please enter your email.';
      return;
    }
    this.authService.requestPasswordReset(this.email).subscribe({
      next: res => {
        this.message = res;
        this.step = 2;
      },
      error: err => this.message = err.error
    });
  }

  resetPassword() {
    if (!this.otp || !this.newPassword) {
      this.message = 'Please enter OTP and new password.';
      return;
    }
    this.authService.resetPassword(this.email, this.otp, this.newPassword).subscribe({
      next: res => {
        this.message = res;
        this.step = 1;
        this.email = '';
        this.otp = '';
        this.newPassword = '';
      },
      error: err => this.message = err.error
    });
  }
}


