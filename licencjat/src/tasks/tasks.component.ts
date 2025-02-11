import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  title: string;
  description: string;
  status: 'Issue' | 'In Progress' | 'Done';
  createdBy: string;
  createdDate: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, CommonModule, FormsModule],
})
export class TasksComponent {
  userName: string = 'Name Surname';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  showModal: boolean = false;

  // Lista użytkowników, w tym "Name Surname"
  teammates = [
    { name: 'Name Surname' }, // ✅ Dodanie użytkownika Name Surname
    { name: 'Anna Kowalska' },
    { name: 'Jan Nowak' },
    { name: 'Katarzyna Lis' },
    { name: 'Marek Wiśniewski' },
    { name: 'Piotr Adamski' }
  ];

  tasks: Task[] = [
    {
      title: 'Zadanie 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      status: 'In Progress',
      createdBy: 'Jan Kowalski',
      createdDate: '2023-01-01',
    },
    {
      title: 'Zadanie 2',
      description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'Issue',
      createdBy: 'Anna Nowak',
      createdDate: '2023-01-02',
    },
    {
      title: 'Zadanie 3',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
      status: 'In Progress',
      createdBy: 'Piotr Wiśniewski',
      createdDate: '2023-01-03',
    }
  ];

  newTask: Task = {
    title: '',
    description: '',
    status: 'In Progress',
    createdBy: this.teammates[0].name, // Domyślnie wybrany "Name Surname"
    createdDate: new Date().toISOString().split('T')[0]
  };

  constructor(private router: Router) {}

  // 🟢 Otwieranie modala
  openModal(): void {
    this.showModal = true;
  }

  // 🟢 Zamknięcie modala
  closeModal(): void {
    this.showModal = false;
  }

  // 🟢 Zapisywanie zadania tylko jeśli przypisane do "Name Surname"
  saveTask(): void {
    if (!this.newTask.title.trim() || !this.newTask.description.trim()) {
      alert('Proszę uzupełnić wszystkie pola!');
      return;
    }

    if (this.newTask.createdBy !== this.userName) {
      alert('To zadanie nie zostało przypisane do Ciebie. Nie zostanie dodane do listy.');
      this.closeModal();
      return;
    }

    const taskToAdd: Task = {
      ...this.newTask,
      createdDate: new Date().toISOString().split('T')[0]
    };

    this.tasks.push(taskToAdd);

    this.newTask = {
      title: '',
      description: '',
      status: 'In Progress',
      createdBy: this.teammates[0].name, // Resetowanie wyboru do "Name Surname"
      createdDate: new Date().toISOString().split('T')[0]
    };

    this.closeModal();
  }

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

  changeStatus(task: Task, newStatus: 'Issue' | 'In Progress' | 'Done'): void {
    if (newStatus === 'Done') {
      this.tasks = this.tasks.filter(t => t !== task);
    } else {
      task.status = newStatus;
    }
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToChat(): void {
    this.router.navigate(['/chat']);
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

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }
}
