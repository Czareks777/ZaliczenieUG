// tasks.component.ts
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamSearchComponent } from '../team-search/team-search.component';
import { TasksService } from '../app/services/tasks.service';
import { AuthService } from '../app/services/auth.service';
import { User } from '../app/services/user.service';
import { UserService } from '../app/services/user.service';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Issue' | 'InProgress' | 'Done';
  createdById: number;
  createdBy?: { name: string; surname: string };
  assignedToId?: number | null;
  createdDate: string;
  assignedTo?: { name: string; surname: string } | null;
}

interface TaskCreateDto {
  title: string;
  description: string;
  status: 'Issue' | 'InProgress' | 'Done';
  createdById: number;
  assignedToId?: number | null;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, CommonModule, FormsModule, TeamSearchComponent],
})
export class TasksComponent {
  userName: string = 'Nieznany użytkownik';
  tasks: Task[] = [];

  // 🔹 Filtr statusu (domyślnie pusty → pokazuje wszystkie)
  filterStatus: '' | 'Issue' | 'InProgress' | 'Done' = '';

  // 🔹 Paginacja
  currentPage: number = 1;
  itemsPerPage: number = 3;

  // 🔹 Modal
  showModal: boolean = false;

  // 🔹 Lista użytkowników do selecta (bez siebie)
  users: User[] = [];

  // 🔹 Lista wszystkich członków zespołu (łącznie z zalogowanym)
  allTeamMembers: User[] = [];

  selectedUserId: number | null = null;

  // 🔹 Nowe zadanie (domyślnie InProgress)
  newTask: TaskCreateDto = {
    title: '',
    description: '',
    status: 'InProgress',
    createdById: 0,
    assignedToId: null
  };

  constructor(
    private router: Router,
    private tasksService: TasksService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userName = this.authService.getUserName();
    // Najpierw pobierz użytkowników
    this.loadUsers(() => {
      // Dopiero wtedy pobierz zadania
      this.loadTasks();
    });
  }

  private loadTasks(): void {
    this.tasksService.getMyTasks().subscribe({
      next: (data) => {
        console.log('Pobrane zadania z serwera:', data);

        this.tasks = data.map(task => {
          // Normalizujemy status
          const normalized = this.normalizeStatus(task.status);
          return {
            ...task,
            status: normalized,
            // 🔹 Teraz szukamy assignedTo w ALLTeamMembers (łącznie z zalogowanym userem)
            assignedTo: this.allTeamMembers.find(u => u.id === task.assignedToId) || null
          };
        });

        console.log('Po normalizacji statusów:', this.tasks.map(t => t.status));
      },
      error: (error) => {
        console.error("Błąd pobierania zadań:", error);
        if (error.status === 401) {
          alert('Sesja wygasła! Zaloguj się ponownie.');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private loadUsers(onLoaded?: () => void): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const myId = this.authService.getCurrentUserId();
        const me = users.find(u => u.id === myId);

        if (!me) {
          console.error('Nie znaleziono zalogowanego użytkownika w liście allUsers.');
          this.users = [];
          this.allTeamMembers = [];
          if (onLoaded) onLoaded();
          return;
        }

        if (me.teamId) {
          // 🔹 Zapisz wszystkich członków zespołu (łącznie z nami)
          this.allTeamMembers = users.filter(u => u.teamId === me.teamId);

          // 🔹 Do selecta usuwamy zalogowanego
          this.users = this.allTeamMembers.filter(u => u.id !== myId);
        } else {
          this.users = [];
          this.allTeamMembers = [];
        }

        if (onLoaded) onLoaded();
      },
      error: (error) => {
        console.error("Błąd pobierania użytkowników:", error);
        alert('Nie udało się pobrać listy użytkowników');
      }
    });
  }

  // 🔹 Metoda do otwierania modala
  openModal(): void {
    this.showModal = true;
  }

  // 🔹 Metoda do zamykania modala
  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  // 🔹 Reset formularza po zamknięciu modala
  private resetForm(): void {
    const userId = this.authService.getCurrentUserId() || 0;
    this.newTask = {
      title: '',
      description: '',
      status: 'InProgress',
      createdById: userId,
      assignedToId: null
    };
    this.selectedUserId = null;
  }

  // 🔹 Tworzenie zadania
  saveTask(): void {
    if (!this.newTask.title?.trim() || !this.newTask.description?.trim()) {
      alert('Proszę uzupełnić wszystkie pola!');
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      alert('Błąd autentykacji! Zaloguj się ponownie.');
      this.router.navigate(['/login']);
      return;
    }

    const taskToSend: TaskCreateDto = {
      title: this.newTask.title,
      description: this.newTask.description,
      status: this.newTask.status,
      createdById: userId,
      assignedToId: this.selectedUserId
    };

    this.tasksService.createTask(taskToSend).subscribe({
      next: (savedTask) => {
        // Dodajemy do listy tylko jeśli przypisane do mnie
        if (savedTask.assignedToId === userId) {
          // Znajdujemy assignedTo w allTeamMembers
          const newTask: Task = {
            ...savedTask,
            assignedTo: this.allTeamMembers.find(u => u.id === savedTask.assignedToId) || null
          };
          this.tasks = [...this.tasks, newTask];
        }
        this.closeModal();
      },
      error: (err) => {
        console.error("Pełny błąd:", err.error);
        const errorMessage = err.error?.errors
          ? Object.values(err.error.errors).join('\n')
          : 'Nieznany błąd serwera';
        alert(`Błąd zapisu:\n${errorMessage}`);
      }
    });
  }

  // 🔹 Zmiana statusu
  changeStatus(task: Task, newStatus: 'Issue' | 'InProgress' | 'Done'): void {
    this.tasksService.updateTaskStatus(task.id, newStatus).subscribe({
      next: () => {
        task.status = newStatus;
        this.loadTasks(); // odśwież zadania
      },
      error: (err) => {
        console.error("Błąd aktualizacji statusu:", err);
        alert('Nie udało się zmienić statusu zadania');
      }
    });
  }

  private normalizeStatus(status: string | number): 'Issue' | 'InProgress' | 'Done' {
    if (typeof status === 'number') {
      switch (status) {
        case 0:
          return 'Issue';
        case 2:
          return 'Done';
        default:
          return 'InProgress';
      }
    }
    if (typeof status === 'string') {
      const lower = status.toLowerCase();
      if (lower === 'issue')      return 'Issue';
      if (lower === 'done')       return 'Done';
      return 'InProgress';
    }
    return 'InProgress';
  }

  // 🔹 Właściwość obliczana: filtr + paginacja
  get paginatedAndFilteredTasks(): Task[] {
    let filtered = this.filterStatus
      ? this.tasks.filter(task =>
          task.status.toLowerCase() === this.filterStatus.toLowerCase()
        )
      : this.tasks;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    const totalFiltered = this.filterStatus
      ? this.tasks.filter(t => t.status === this.filterStatus).length
      : this.tasks.length;
    return Math.ceil(totalFiltered / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    const totalFiltered = this.filterStatus
      ? this.tasks.filter(t => t.status === this.filterStatus).length
      : this.tasks.length;

    if (this.currentPage * this.itemsPerPage < totalFiltered) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // 🔹 Wylogowanie
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // 🔹 Nawigacja
  navigateToDashboard(): void { this.router.navigate(['/dashboard']); }
  navigateToCalendar(): void { this.router.navigate(['/calendar']); }
  navigateToTeam(): void { this.router.navigate(['/team']); }
  navigateToChat(): void { this.router.navigate(['/chat']); }
  navigateToTasks(): void { this.router.navigate(['/tasks']); }
}
