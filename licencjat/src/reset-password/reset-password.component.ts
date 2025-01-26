import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/']);
  }

  resetPassword() {
    // Logika resetowania hasła (np. API call)
    // Po sukcesie przenieś na stronę potwierdzenia
    this.router.navigate(['/password-success']);
  }
}
