// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  surname: string;
  position: string;
  teamId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users'; // dostosuj URL

  constructor(private http: HttpClient) {}

  // Pobiera wszystkich użytkowników
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Metoda do pobierania aktualnie zalogowanego użytkownika
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/current`);
  }
}
