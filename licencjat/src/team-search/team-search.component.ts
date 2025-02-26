import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../app/services/auth.service';
import { UserService } from '../app/services/user.service';
import { TeamService, TeamMember } from '../app/services/team.service';
import { Router } from '@angular/router'; // <-- potrzebujemy do nawigacji

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrls: ['./team-search.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TeamSearchComponent implements OnInit {
  isDropdownOpen: boolean = false;
  searchQuery: string = '';

  // Zmieniamy strukturę, by przechowywać id, name i avatar
  teammates: Array<{
    id: number;
    name: string;
    avatar: string;
  }> = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private teamService: TeamService,
    private router: Router            // <-- wstrzykujemy Router
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (currentUser) => {
        if (currentUser.teamId) {
          this.teamService.getTeamMembers(currentUser.teamId).subscribe({
            next: (members: TeamMember[]) => {
              // Wykluczamy zalogowanego
              const filtered = members.filter(m => m.id !== currentUser.id);

              // Każdy element ma teraz id, name, avatar
              this.teammates = filtered.map(m => ({
                id: m.id,
                name: `${m.name} ${m.surname}`,
                avatar: this.getRandomAvatar()
              }));
            },
            error: (err) => {
              console.error('Błąd pobierania członków zespołu:', err);
            }
          });
        } else {
          console.log('Użytkownik nie ma teamId – brak członków zespołu.');
          this.teammates = [];
        }
      },
      error: (err) => {
        console.error('Błąd pobierania aktualnie zalogowanego użytkownika:', err);
      }
    });
  }

  private getRandomAvatar(): string {
    const defaultAvatar = 'https://via.placeholder.com/40/aaaaaa/FFFFFF?text=User';
    return defaultAvatar;
  }

  get filteredTeammates() {
    return this.teammates.filter(member =>
      member.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Po kliknięciu w dropdown-item
  goToChat(member: { id: number; name: string; avatar: string }) {
    // Nawigacja do /chat z queryParam userId
    this.router.navigate(['/chat'], {
      queryParams: { userId: member.id }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    setTimeout(() => {
      this.isDropdownOpen = false;
    }, 200);
  }
}
