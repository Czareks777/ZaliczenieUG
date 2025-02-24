import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeamMember {
  id: number;
  teamId: number;
  name: string;
  surname: string;
  position: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'https://localhost:5001/api/team';

  constructor(private http: HttpClient) {}

  getTeamMembers(teamId: number = 1): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.apiUrl}/${teamId}/members`);
  }

  addTeamMember(member: { userId: number; position: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/add-member`, member, { responseType: 'text' });
  }

  removeTeamMember(userId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/remove-member/${userId}`, {}, { responseType: 'text' });
  }
}
