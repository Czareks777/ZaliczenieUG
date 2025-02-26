import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TeamSearchComponent } from '../team-search/team-search.component';
import { UserService, User } from '../app/services/user.service';
import { TeamService, TeamMember } from '../app/services/team.service';
import { AuthService } from '../app/services/auth.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamSearchComponent],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  userName: string = 'Nieznany użytkownik';
  teamMembers: TeamMember[] = [];
  nonTeamMembers: User[] = [];

  // Stanowiska
  jobPositions: string[] = [
    'Frontend Developer', 'Backend Developer', 'UX Designer', 
    'Project Manager', 'QA Specialist', 'Business Analyst', 
    'DevOps Engineer', 'Scrum Master', 'Support Specialist', 'Product Owner'
  ];

  // Paginacja
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Modal
  showAddMemberModal: boolean = false;
  selectedNewMemberId: number | null = null;
  selectedNewMemberPosition: string = '';

  // Tu będziemy trzymać ID zespołu aktualnie zalogowanego użytkownika
  currentUserTeamId: number | null = null;

  constructor(
    private router: Router, 
    private userService: UserService, 
    private teamService: TeamService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Ustawiamy nazwę zalogowanego użytkownika (np. Anna Kowalska)
    this.userName = this.authService.getUserName();

    // 1. Najpierw pobierz dane zalogowanego użytkownika z backendu lub z tokena
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        // Zapisujemy teamId zalogowanego użytkownika
        this.currentUserTeamId = user.teamId || null;

        // 2. Jeśli user nie ma zespołu, to wyświetlamy puste tablice
        if (!this.currentUserTeamId) {
          this.teamMembers = [];
          this.nonTeamMembers = [];
          return;
        }

        // 3. Wczytujemy członków zespołu (zwróć uwagę, że przekazujemy currentUserTeamId!)
        this.teamService.getTeamMembers(this.currentUserTeamId).subscribe({
          next: (members) => {
            // 🔹 Wykluczamy zalogowanego usera
            const myId = this.authService.getCurrentUserId();
            this.teamMembers = members.filter(m => m.id !== myId);

            // 4. Teraz wczytujemy wszystkich użytkowników i filtrujemy tych, którzy są w zespole
            this.userService.getAllUsers().subscribe({
              next: (users) => {
                this.nonTeamMembers = users.filter(
                  (u) => !this.teamMembers.some((m) => m.id === u.id)
                );
              },
              error: (err) => console.error('Błąd pobierania wszystkich użytkowników:', err)
            });
          },
          error: (err) => console.error('Błąd pobierania członków zespołu:', err)
        });
      },
      error: (err) => {
        console.error('Błąd pobierania aktualnie zalogowanego użytkownika:', err);
      }
    });
  }

  // Otwieramy modal
  openAddMemberModal(): void {
    this.showAddMemberModal = true;
    // Jeśli mamy jakichś "wolnych" użytkowników, wybierz pierwszego z listy
    this.selectedNewMemberId = this.nonTeamMembers[0]?.id || null;
    this.selectedNewMemberPosition = this.jobPositions[0];
  }
  goToChat(member: TeamMember): void {
    // Najlepiej przekazać np. ID użytkownika w queryParams
    this.router.navigate(['/chat'], {
      queryParams: { userId: member.id }
    });
  }
  // Zamykamy modal
  closeAddMemberModal(): void {
    this.showAddMemberModal = false;
  }

  // Dodawanie użytkownika do zespołu
  addMemberToTeam(): void {
    if (!this.selectedNewMemberId) {
      alert('Wybierz pracownika!');
      return;
    }
    if (!this.currentUserTeamId) {
      alert('Nie należysz do żadnego zespołu!');
      return;
    }

    const newMember = {
      userId: this.selectedNewMemberId,
      position: this.selectedNewMemberPosition
    };

    this.teamService.addTeamMember(newMember).subscribe({
      next: (responseText) => {
        alert(responseText);
        // Po dodaniu użytkownika ponownie ładujemy listę członków i "wolnych" użytkowników
        this.reloadTeamData();
        this.closeAddMemberModal();
      },
      error: (err) => {
        console.error('Błąd:', err);
        const errorMsg = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        alert('Błąd dodawania do zespołu: ' + errorMsg);
      }
    });
  }

  // Usuwanie członka z zespołu
  removeFromTeam(member: TeamMember): void {
    this.teamService.removeTeamMember(member.id).subscribe({
      next: (responseText) => {
        alert(responseText);
        // Po usunięciu ponownie ładujemy listy
        this.reloadTeamData();
      },
      error: (error) => {
        console.error('Błąd usuwania członka zespołu:', error);
      }
    });
  }

  // Metoda pomocnicza, by po dodaniu/usunięciu odświeżyć dane
  private reloadTeamData(): void {
    if (!this.currentUserTeamId) return;

    this.teamService.getTeamMembers(this.currentUserTeamId).subscribe({
      next: (members) => {
        // 🔹 Ponownie wykluczamy zalogowanego usera
        const myId = this.authService.getCurrentUserId();
        this.teamMembers = members.filter(m => m.id !== myId);

        this.userService.getAllUsers().subscribe({
          next: (users) => {
            this.nonTeamMembers = users.filter(
              (u) => !this.teamMembers.some((m) => m.id === u.id)
            );
          },
          error: (err) => console.error('Błąd pobierania wszystkich użytkowników:', err)
        });
      },
      error: (err) => console.error('Błąd pobierania członków zespołu:', err)
    });
  }

  // Paginacja (jak w Twoim przykładzie)
  get paginatedMembers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.teamMembers.slice(startIndex, startIndex + this.itemsPerPage);
  }
  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.teamMembers.length) {
      this.currentPage++;
    }
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  get totalPages(): number {
    return Math.ceil(this.teamMembers.length / this.itemsPerPage);
  }
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Nawigacja
  logout(): void {
    this.router.navigate(['/login']);
  }
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  navigateToCalendar(): void {
    this.router.navigate(['/calendar']);
  }
  navigateToTeam(): void {
    this.router.navigate(['/team']);
  }
  navigateToChat(): void { this.router.navigate(['/chat']); }
  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }
}
