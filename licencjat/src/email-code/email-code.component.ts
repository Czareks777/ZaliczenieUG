import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-code',
  templateUrl: './email-code.component.html',
  styleUrls: ['./email-code.component.scss']
})
export class EmailCodeComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/']);
  }

  proceedToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
