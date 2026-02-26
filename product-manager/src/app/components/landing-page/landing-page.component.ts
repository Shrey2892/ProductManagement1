import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  toastMessage = '';
  toastVisible = false;
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  showToast(message: string): void {
    this.toastMessage = message;
    this.toastVisible = true;

    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }

    this.toastTimeoutId = setTimeout(() => {
      this.toastVisible = false;
    }, 2800);
  }
}
