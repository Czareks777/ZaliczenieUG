import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Dodaj ten import

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule] // Dodaj FormsModule tutaj
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        console.log('Zalogowano pomyślnie, przekierowanie na dashboard.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Nieprawidłowe dane logowania!';
        console.error('Błąd logowania:', err);
      }
    });
  }
}
