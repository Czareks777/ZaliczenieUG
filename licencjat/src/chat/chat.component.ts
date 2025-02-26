import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TeamSearchComponent } from '../team-search/team-search.component';
import { ChatService, ChatMessage } from '../app/services/chat.service';
import { TeamService, TeamMember } from '../app/services/team.service';
import { AuthService } from '../app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    TeamSearchComponent
  ]
})
export class ChatComponent implements OnInit, OnDestroy {
  userName: string = '';

  // Tablica członków zespołu pobrana z backendu
  teammates: { id: number; name: string }[] = [];
  selectedTeammate: any = null;

  messages: ChatMessage[] = [];
  newMessage: string = '';

  // Dla czatu grupowego (opcjonalnie)
  showGroupChatModal: boolean = false;
  groupChatTitle: string = '';
  selectedTeammates: any[] = [];

  private messageSubscription!: Subscription;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private teamService: TeamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Pobieramy pełną nazwę użytkownika z AuthService
    this.userName = this.authService.getUserName();

    // Nawiązujemy połączenie przez SignalR, przekazując poprawny userName
    this.chatService.startConnection(this.userName);

    // Pobieramy członków zespołu (w przykładzie zakładamy teamId = 1, 
    // ale możesz to dynamicznie pobrać z tokena lub z getCurrentUser()).
    this.teamService.getTeamMembers(1).subscribe({
      next: (members: TeamMember[]) => {
        // Wykluczamy aktualnie zalogowanego usera
        const myId = this.authService.getCurrentUserId();
        this.teammates = members
          .filter(m => m.id !== myId)
          .map(member => ({
            id: member.id,
            name: `${member.name} ${member.surname}`
          }));
      },
      error: (err) => console.error('Błąd pobierania członków zespołu:', err)
    });

    // Subskrybujemy przychodzące wiadomości
    this.messageSubscription = this.chatService.messageReceived$.subscribe((msg) => {
      if (msg) {
        this.messages.push(msg);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  selectTeammate(teammate: any): void {
    this.selectedTeammate = teammate;
  
    // 1) Pobieramy historię wiadomości
    this.chatService.getMessages(this.userName, teammate.name).subscribe({
      next: (msgs) => {
        // 2) Zamieniamy pole timestamp na Date (bo przyjdzie jako string)
        this.messages = msgs.map(m => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      },
      error: (err) => {
        console.error("Błąd pobierania wiadomości:", err);
        alert("Nie udało się pobrać historii czatu");
      }
    });
  }

  // Wysyłanie wiadomości do wybranego użytkownika
  sendMessage(): void {
    if (!this.newMessage || !this.selectedTeammate) return;

    this.chatService.sendMessage(this.userName, this.selectedTeammate.name, this.newMessage)
    .then(() => {
      this.newMessage = '';
      });
  }

  // Obsługa modala do czatu grupowego
  openGroupChatModal(): void {
    this.showGroupChatModal = true;
  }
  closeGroupChatModal(): void {
    this.showGroupChatModal = false;
  }
  createGroupChat(): void {
    if (!this.groupChatTitle.trim() || this.selectedTeammates.length === 0) {
      alert('Podaj tytuł czatu i wybierz uczestników.');
      return;
    }
    alert(`Stworzono czat: "${this.groupChatTitle}" z ${this.selectedTeammates.length} uczestnikami.`);
    this.closeGroupChatModal();
  }

  // Nawigacja
  logout(): void {
    this.router.navigate(['/login']);
  }
  navigateToCalendar(): void {
    this.router.navigate(['/calendar']);
  }
  navigateToTeam(): void {
    this.router.navigate(['/team']);
  }
  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
