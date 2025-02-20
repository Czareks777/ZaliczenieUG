import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { TeamSearchComponent } from "../team-search/team-search.component";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [TeamSearchComponent]
})
export class DashboardComponent implements OnInit {
  userName: string = 'Nieznany użytkownik';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    setTimeout(() => {
      this.userName = this.authService.getUserName();
      console.log("Użytkownik w Dashboard:", this.userName); // 🔍 Debugging
    }, );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToTeam() {
    this.router.navigate(['/team']);
  }

  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }
}
