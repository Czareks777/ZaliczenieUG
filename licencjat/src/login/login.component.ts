import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router) {}

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  login() {
    console.log('Próba nawigacji do dashboard');
    this.router.navigate(['/dashboard']).then(() => {
      console.log('Przekierowano na dashboard');
    }).catch(err => {
      console.error('Błąd podczas nawigacji:', err);
    });
}}