import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { TeamSearchComponent } from "../team-search/team-search.component";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [TeamSearchComponent, CommonModule]
})
export class DashboardComponent implements OnInit {
  userName: string = 'Nieznany użytkownik';
  recentTasks: any[] = [];  // tablica na 3 ostatnie zadania

  constructor(
    private router: Router, 
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Ustawiamy nazwę użytkownika
    this.userName = this.authService.getUserName();

    // Pobieramy 3 ostatnie zadania przypisane do zalogowanego usera
    this.http.get<any[]>('https://localhost:5001/api/tasks/recent-assigned')
      .subscribe({
        next: (tasks) => {
          this.recentTasks = tasks;
        },
        error: (err) => {
          console.error('Błąd pobierania ostatnich zadań:', err);
        }
      });
  }
  getStatusString(status: number | string): string {
    if (typeof status === 'number') {
      switch (status) {
        case 0: return 'issue';
        case 1: return 'inprogress';
        case 2: return 'done';
        default: return 'unknown';
      }
    } else {
      // status jest stringiem, np. 'Issue', 'Done'
      return status.toLowerCase();
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToTeam() {
    this.router.navigate(['/team']);
  }

  navigateToChat() {
    this.router.navigate(['/chat']);
  }

  navigateToCalendar() {
    this.router.navigate(['/calendar']);
  }

  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
