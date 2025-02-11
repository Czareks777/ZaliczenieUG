import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api/chat';

  constructor(private http: HttpClient) {}

  getMessages(sender: string, receiver: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${sender}/${receiver}`);
  }

  sendMessage(message: any) {
    return this.http.post(this.apiUrl, message);
  }
}
