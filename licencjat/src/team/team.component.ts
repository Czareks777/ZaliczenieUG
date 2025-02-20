import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeamSearchComponent } from "../team-search/team-search.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, TeamSearchComponent,FormsModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent {
  userName: string = 'Name Surname';

  teamMembers = [
    { name: 'Anna Kowalska', position: 'Frontend Developer' },
    { name: 'Jan Nowak', position: 'Backend Developer' },
    { name: 'Katarzyna Lis', position: 'UX Designer' },
    { name: 'Marek Wiśniewski', position: 'Project Manager' },
    { name: 'Piotr Adamski', position: 'QA Specialist' },
    { name: 'Ewa Zielińska', position: 'Business Analyst' },
    { name: 'Tomasz Kwiatkowski', position: 'DevOps Engineer' },
    { name: 'Magdalena Nowak', position: 'Scrum Master' },
    { name: 'Krzysztof Wójcik', position: 'Support Specialist' },
    { name: 'Natalia Lewandowska', position: 'Product Owner' },
  ];

  nonTeamMembers = [
    { name: 'Ewa Zielińska' },
    { name: 'Tomasz Kwiatkowski' },
    { name: 'Magdalena Nowak' },
    { name: 'Krzysztof Wójcik' },
    { name: 'Natalia Lewandowska' }
  ];

  jobPositions = [
    'Frontend Developer',
    'Backend Developer',
    'UX Designer',
    'Project Manager',
    'QA Specialist',
    'Business Analyst',
    'DevOps Engineer',
    'Scrum Master',
    'Support Specialist',
    'Product Owner'
  ];

  currentPage: number = 1;
  itemsPerPage: number = 5;
 showAddMemberModal: boolean = false;
  selectedNewMember: string = '';
  selectedNewMemberPosition: string = '';

  constructor(private router: Router) {}

  get paginatedMembers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.teamMembers.slice(startIndex, endIndex);
  }
  openAddMemberModal(): void {
    this.showAddMemberModal = true;
    this.selectedNewMember = this.nonTeamMembers[0]?.name || '';
    this.selectedNewMemberPosition = this.jobPositions[0];
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

  removeFromTeam(member: any): void {
    this.teamMembers = this.teamMembers.filter(m => m !== member);
    alert(`${member.name} został(a) usunięty(a) z zespołu.`);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  navigateToCalendar(): void {
    this.router.navigate(['/calendar']);
  }

  navigateToTeam(): void {
    this.router.navigate(['/team']);
  }

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }
  addMemberToTeam(): void {
    if (!this.selectedNewMember || !this.selectedNewMemberPosition) {
      alert('Wybierz pracownika oraz stanowisko!');
      return;
    }

    const newMember = {
      name: this.selectedNewMember,
      position: this.selectedNewMemberPosition
    };

    this.teamMembers.push(newMember);
    this.nonTeamMembers = this.nonTeamMembers.filter(m => m.name !== this.selectedNewMember);
    
    alert(`${newMember.name} został(a) dodany(a) do zespołu na stanowisko ${newMember.position}.`);
    
    
  }
  closeAddMemberModal(): void {
    this.showAddMemberModal = false;
  }
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  addToTeam(): void {
    const newMember = {
      name: `Nowy Członek ${this.teamMembers.length + 1}`,
      position: 'Nowa Rola'
    };
    
    this.teamMembers.push(newMember);
    alert(`${newMember.name} został(a) dodany(a) do zespołu.`);
  }
}
