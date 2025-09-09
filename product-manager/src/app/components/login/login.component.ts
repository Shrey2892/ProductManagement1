import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {

        if (res.role === 'User' && !res.isApproved) {
  Swal.fire({
    icon: 'warning',
    title: 'Approval Pending',
    text: 'Your account has not yet been approved by the administrator.'
  });
  return;
}
        // ✅ check restriction
        if (res.isRestricted) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('isRestricted');
          localStorage.setItem('isApproved', res.isApproved);
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Your account has been restricted by the administrator.',
          });
          return; // ❌ stop login flow
        }

        // ✅ store token, role, and restriction flag
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('isRestricted', res.isRestricted);

        // success popup
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome, ${this.username}!`,
          timer: 2000,
          showConfirmButton: false
        });

        // navigate to products after short delay
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 2000);
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: err.error || 'Invalid credentials'
        });
      }
    });
  }

  togglePassword() {
  this.showPassword = !this.showPassword;
}
}
