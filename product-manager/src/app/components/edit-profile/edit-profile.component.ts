import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductLayoutComponent } from '../product-layout/product-layout.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-edit-profile',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule, ProductLayoutComponent],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user!: User;
  selectedFile?: File;
  imagePreview?: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (user: User) => {
        this.user = user;
        this.profileForm = this.fb.group({
          username: [user.username],
          image: [null]
        });

        if (user.imagePath) {
          this.imagePreview = `http://localhost:5259/${user.imagePath}`;
        }
      },
      error: (err) => {
        console.error('Error loading profile', err);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.profileForm) return;

    const formData = new FormData();
    formData.append('Username', this.profileForm.get('username')?.value);
    if (this.selectedFile) {
      formData.append('ProfileImage', this.selectedFile);
    }

    this.authService.updateProfile(formData).subscribe({
      next: (res) => {
        // If username changed → force re-login
        if (this.user && this.user.username !== res.username) {
          Swal.fire({
            icon: 'info',
            title: 'Username Changed',
            text: 'Your username has been updated. Please log in again.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.authService.logout();
            this.router.navigate(['login']);
          });
          return;
        }

        // If only profile image updated
        if (res.imagePath) {
          this.imagePreview = `http://localhost:5259${res.imagePath}`;
        }
        this.user = res;

        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile was updated successfully!',
          confirmButtonColor: '#3085d6',
        });
      },
      error: (err) => {
        console.error('Error updating profile', err);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Something went wrong while updating your profile.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }
}
