import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { CommonModule } from '@angular/common';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ProductLayoutComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.authService.getAllUsers().subscribe({
        next: (data: User[]) => {
          this.users = data.map(u => ({
            ...u,
            imageUrl: u.imagePath ? `${environment.apiBaseUrl}/${u.imagePath}` : null
          }) as any);
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load users';
          this.loading = false;
        }
      });
    } else {
      this.error = 'You are not authorized to view this page';
      this.loading = false;
    }
  }

  getImageUrl(user: User): string | null {
    return user.imagePath ? `${environment.apiBaseUrl}/${user.imagePath}` : null;
  }

  toggleRestriction(user: User) {
    const restrict = !user.isRestricted;
    this.authService.restrictUser(user.id, restrict).subscribe({
      next: () => {
        user.isRestricted = restrict;
      },
      error: () => {
        this.error = 'Failed to update restriction';
      }
    });
  }


//   toggleApproval(user: User) {
//   const approve = !user.isApproved;
//   this.authService.approveUser(user.id, approve).subscribe({
//     next: () => {
//       user.isApproved = approve;
//     },
//     error: () => {
//       this.error = 'Failed to update approval';
//     }
//   });
// }


approveUser(user: User) {
  this.authService.approveUser(user.id, true).subscribe({
    next: () => {
      user.isApproved = true; // Once approved, stays approved
    },
    error: () => {
      this.error = 'Failed to approve user';
    }
  });
}


}
