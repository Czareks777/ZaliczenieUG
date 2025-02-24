import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
const CLAIM_TYPES = {
  NAME_IDENTIFIER: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
};
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
      console.log('Decoded Token:', decodedToken); // Debugowanie
  
      // Sprawdź, czy claimy są poprawnie odczytywane
      const name = decodedToken["name"];
      const surname = decodedToken["surname"];
      
      if (name && surname) {
        const fullName = `${name} ${surname}`.trim();
        localStorage.setItem(this.usernameKey, fullName);
      } else {
        console.error('Brak wymaganych pól w tokenie: name i surname');
      }
    } catch (error) {
      console.error('Błąd dekodowania tokena:', error);
    }
  }
  
// auth.service.ts
getCurrentUser(): { name: string, surname: string } {
  const token = this.getToken();
  if (!token) return { name: '', surname: '' };

  try {
    const decoded: any = jwtDecode(token);
    return { 
      name: decoded['name'] || '',
      surname: decoded['surname'] || '' 
    };
  } catch (e) {
    console.error('Błąd dekodowania tokena:', e);
    return { name: '', surname: '' };
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
  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const decoded: any = jwtDecode(token);
      const userId = parseInt(decoded[CLAIM_TYPES.NAME_IDENTIFIER]);
      return isNaN(userId) ? null : userId;
    } catch (e) {
      console.error('Błąd dekodowania tokena:', e);
      return null;
    }
  }
  
  
}
