import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Task extends TaskCreateDto {
  id: number;
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
@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = 'https://localhost:5001/api/tasks';

  constructor(private http: HttpClient) {}

  /** Pobierz wszystkie zadania */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /** Pobierz ostatnie 3 zadania zalogowanego użytkownika */
  getRecentTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/recent`);
  }


// tasks.service.ts
createTask(task: TaskCreateDto): Observable<Task> {
  return this.http.post<Task>(this.apiUrl, task);
}

  /** Zaktualizuj status zadania */
  updateTaskStatus(id: number, newStatus: 'Issue' | 'InProgress' | 'Done'): Observable<void> {
    // tworzymy ciało żądania jako "Issue", "InProgress" lub "Done" w formacie JSON
    const body = JSON.stringify(newStatus);
  
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/status`,
      body,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // tasks.service.ts
getMyTasks(): Observable<Task[]> {
  return this.http.get<Task[]>(`${this.apiUrl}/my-tasks`);
}

  


}
