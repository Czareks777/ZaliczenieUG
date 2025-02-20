import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/Auth/login';
  private tokenKey = 'token';
  private usernameKey = 'username';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return new Observable(observer => {
      this.http.post<{ token: string }>(this.apiUrl, { username, password }).subscribe(
        response => {
          console.log('Token zapisany:', this.getToken());
          this.saveToken(response.token);
          observer.next(response);
          observer.complete();
        },
        error => observer.error(error)
      );
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /** 🔹 Dekodowanie tokena JWT i zapisanie nazwy użytkownika */
  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken); // 🔍 Debugging
  
      // Pobranie imienia i nazwiska
      const fullName = `${decodedToken["name"]} ${decodedToken["surname"]}`.trim();
      
      localStorage.setItem(this.usernameKey, fullName);
    } catch (error) {
      console.error('Błąd dekodowania tokena:', error);
    }
  }
  

  /** 🔹 Pobranie zapisanej nazwy użytkownika */
 

  getUserName(): string {
    const fullName = localStorage.getItem(this.usernameKey);
    if (fullName) {
      return fullName;
    }
  
    // Jeśli nie ma w localStorage, dekodujemy token
    const token = this.getToken();
    if (!token) return 'Nieznany użytkownik';
  
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken); // 🔍 Debugging
  
      return `${decodedToken["name"]} ${decodedToken["surname"]}`.trim() || 'Nieznany użytkownik';
    } catch (error) {
      console.error('Błąd dekodowania tokena:', error);
      return 'Nieznany użytkownik';
    }
  }
  
  
  
}
