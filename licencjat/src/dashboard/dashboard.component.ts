import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [RouterLink]
})
export class DashboardComponent {
  userName: string = 'Name Surname';

  constructor(private router: Router) {}

  logout() {
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
  navigateToTeam() {
    this.router.navigate(['/team']);
  }
  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }
}
