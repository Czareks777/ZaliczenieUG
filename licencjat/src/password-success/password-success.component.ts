import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-success',
  templateUrl: './password-success.component.html',
  styleUrls: ['./password-success.component.scss']
})
export class PasswordSuccessComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/']);
  }
}
