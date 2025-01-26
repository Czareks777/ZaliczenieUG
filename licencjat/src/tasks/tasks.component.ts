import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';

interface Task {
  title: string;
  description: string;
  status: 'Error' | 'In Progress' | 'Done';
  createdBy: string;
  createdDate: string; // Nowe pole dla daty
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, CommonModule],
})
export class TasksComponent {
  userName: string = 'Name Surname';
  currentPage: number = 1;
  itemsPerPage: number = 3;

  tasks: Task[] = [
    {
      title: 'Zadanie 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      status: 'In Progress',
      createdBy: 'Jan Kowalski',
      createdDate: '2023-01-01', // Przykładowa data
    },
    {
      title: 'Zadanie 2',
      description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'Error',
      createdBy: 'Anna Nowak',
      createdDate: '2023-01-02', // Przykładowa data
    },
    {
      title: 'Zadanie 3',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
      status: 'In Progress',
      createdBy: 'Piotr Wiśniewski',
      createdDate: '2023-01-03', // Przykładowa data
    },
    {
      title: 'Zadanie 4',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
      status: 'In Progress',
      createdBy: 'Jan Kowalski',
      createdDate: '2023-01-04', // Przykładowa data
    },
    {
      title: 'Zadanie 5',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
      status: 'In Progress',
      createdBy: 'Anna Nowak',
      createdDate: '2023-01-05', // Przykładowa data
    }
  ];

  constructor(private router: Router) {}

  get paginatedTasks(): Task[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.tasks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.tasks.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  changeStatus(task: Task, newStatus: 'Error' | 'In Progress' | 'Done'): void {
    if (newStatus === 'Done') {
      this.tasks = this.tasks.filter(t => t !== task); // Usuń zadanie z listy
    } else {
      task.status = newStatus; // Zaktualizuj status
    }
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  get totalPages(): number {
    return Math.ceil(this.tasks.length / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  navigateToTeam(): void {
    this.router.navigate(['/team']);
  }

  navigateToCalendar(): void {
    this.router.navigate(['/calendar']);
  }
  
  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }
  addTask(): void {
    const newTaskNumber = this.tasks.length + 1; // Oblicz dynamiczny numer zadania
    const newTask: Task = {
      title: `Zadanie ${newTaskNumber}`, // Użyj dynamicznego numeru w tytule
      description: 'Opis nowego zadania',
      status: 'In Progress',
      createdBy: this.userName,
      createdDate: new Date().toISOString().split('T')[0], // Aktualna data w formacie YYYY-MM-DD
    };
    this.tasks.push(newTask); // Dodaj zadanie na koniec listy
    this.goToPage(this.totalPages); // Przejdź do ostatniej strony, aby pokazać nowe zadanie
  }
}