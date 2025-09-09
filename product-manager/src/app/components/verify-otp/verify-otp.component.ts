import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent {
  email: string = '';
  otp: string = '';

  constructor(private authService: AuthService, private router:Router) {}

  onSubmit() {
    if (!this.email || !this.otp) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter both Email and OTP.'
      });
      return;
    }

    this.authService.verifyOtp(this.email, this.otp).subscribe({
  next: (res: string) => {
    const message = res || 'Email verified successfully!';

    Swal.fire({
      icon: 'success',
      title: 'Verified!',
      text: message,
      confirmButtonText: 'OK'
    }).then(() => {
      this.router.navigate(['/login']);
    });
  },
  error: (err) => {
    let message = 'Verification failed.';
    if (err.error) {
      if (typeof err.error === 'string') {
        message = err.error;
      } else if (err.error.message) {
        message = err.error.message;
      } else {
        message = JSON.stringify(err.error);
      }
    }
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }
});


  }
}
