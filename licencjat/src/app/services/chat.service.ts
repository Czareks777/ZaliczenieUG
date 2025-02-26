import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
export interface ChatMessage {
  sender: string;
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  // Zmieniamy typ na ChatMessage | null, aby móc przekazać null
  private messageReceivedSource = new BehaviorSubject<ChatMessage | null>(null);
  public messageReceived$ = this.messageReceivedSource.asObservable();

  constructor(private http: HttpClient) { }

  public startConnection(username: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:5001/chathub?username=${username}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR: połączenie nawiązane'))
      .catch(err => console.error('SignalR: błąd połączenia', err));

    this.hubConnection.on('ReceiveMessage', (sender: string, message: string, timestamp: string) => {
      console.log('SignalR: otrzymano wiadomość', sender, message, timestamp);
      this.messageReceivedSource.next({ 
        sender, 
        content: message, 
        timestamp: new Date(timestamp)
      });
    });
  }
  public getMessages(user1: string, user2: string): Observable<ChatMessage[]> {
    // Dopasuj URL do swojego
    return this.http.get<ChatMessage[]>(`https://localhost:5001/api/chat/${user1}/${user2}`);
  }
  public sendMessage(sender: string, receiver: string, message: string): Promise<void> {
    return this.hubConnection.invoke('SendMessage', sender, receiver, message)
      .catch(err => console.error('SignalR: błąd wysyłania wiadomości', err));
  }
}
