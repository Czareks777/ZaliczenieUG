import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  teammates: { id: number; name: string }[] = [];
  selectedTeammate: { id: number; name: string } | null = null;

  messages: ChatMessage[] = [];
  newMessage: string = '';

  showGroupChatModal: boolean = false;
  groupChatTitle: string = '';
  selectedTeammates: any[] = [];

  private messageSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,            // <-- Wstrzykujemy ActivatedRoute
    private router: Router,
    private chatService: ChatService,
    private teamService: TeamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.chatService.startConnection(this.userName);

    // 1) Najpierw pobieramy listę teammate'ów
    this.teamService.getTeamMembers(1).subscribe({
      next: (members: TeamMember[]) => {
        const myId = this.authService.getCurrentUserId();
        this.teammates = members
          .filter(m => m.id !== myId)
          .map(member => ({
            id: member.id,
            name: `${member.name} ${member.surname}`
          }));

        // 2) Teraz sprawdzamy, czy w queryParams mamy userId
        this.route.queryParamMap.subscribe(params => {
          const userIdParam = params.get('userId');
          if (userIdParam) {
            const parsedId = parseInt(userIdParam, 10);
            // Szukamy w this.teammates
            const found = this.teammates.find(t => t.id === parsedId);
            if (found) {
              this.selectTeammate(found);
            }
          }
        });
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

  selectTeammate(teammate: { id: number; name: string }): void {
    this.selectedTeammate = teammate;

    // Pobieramy historię
    this.chatService.getMessages(this.userName, teammate.name).subscribe({
      next: (msgs) => {
        this.messages = msgs.map(m => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      },
      error: (err) => {
        console.error('Błąd pobierania wiadomości:', err);
        alert('Nie udało się pobrać historii czatu');
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage || !this.selectedTeammate) return;

    this.chatService.sendMessage(this.userName, this.selectedTeammate.name, this.newMessage)
      .then(() => {
        // Nie dodajemy lokalnie, bo i tak przyjdzie z serwera
        this.newMessage = '';
      });
  }

  // Modal czatu grupowego, itp.
  openGroupChatModal(): void { this.showGroupChatModal = true; }
  closeGroupChatModal(): void { this.showGroupChatModal = false; }
  createGroupChat(): void {
    if (!this.groupChatTitle.trim() || this.selectedTeammates.length === 0) {
      alert('Podaj tytuł czatu i wybierz uczestników.');
      return;
    }
    alert(`Stworzono czat: "${this.groupChatTitle}" z ${this.selectedTeammates.length} uczestnikami.`);
    this.closeGroupChatModal();
  }

  // Nawigacja
  logout(): void { this.router.navigate(['/login']); }
  navigateToCalendar(): void { this.router.navigate(['/calendar']); }
  navigateToTeam(): void { this.router.navigate(['/team']); }
  navigateToTasks(): void { this.router.navigate(['/tasks']); }
  navigateToChat(): void { this.router.navigate(['/chat']); }
  navigateToDashboard(): void { this.router.navigate(['/dashboard']); }
}
