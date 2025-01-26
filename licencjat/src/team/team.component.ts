import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
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

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private router: Router) {}

  get paginatedMembers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.teamMembers.slice(startIndex, endIndex);
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

  logout(): void {
    this.router.navigate(['/login']);
  }

  navigateToCalendar(): void {
    this.router.navigate(['/calendar']);
  }

  navigateToTeam(): void {
    this.router.navigate(['/team']);
  }
  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
