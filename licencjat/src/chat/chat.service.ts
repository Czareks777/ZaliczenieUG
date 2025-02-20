import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamSearchComponent } from "../team-search/team-search.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TeamSearchComponent]  
})
export class ChatComponent {
  userName: string = 'Name Surname';

  teammates = [
    { id: 1, name: 'Anna Kowalska' },
    { id: 2, name: 'Jan Nowak' },
    { id: 3, name: 'Katarzyna Lis' },
    { id: 4, name: 'Marek Wiśniewski' },
    { id: 5, name: 'Piotr Adamski' }
  ];
  selectedTeammate: any = null;

  messages = [
    { sender: 'Name Surname', content: 'Cześć, jak się masz?' },
    { sender: 'Anna Kowalska', content: 'Hej! Wszystko w porządku, a u Ciebie?' },
    { sender: 'Name Surname', content: 'Dobrze, dzięki! Masz chwilę na rozmowę?' },
    { sender: 'Anna Kowalska', content: 'Tak, jasne! Co tam?' }
  ];

  newMessage: string = '';

  constructor(private router: Router) {}

  selectTeammate(teammate: any) {
    this.selectedTeammate = teammate;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  navigateToCalendar() {
    this.router.navigate(['/calendar']);
  }

  navigateToTeam() {
    this.router.navigate(['/team']);
  }

  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  sendMessage() {
    if (!this.newMessage || !this.selectedTeammate) return;
    this.messages.push({ sender: this.userName, content: this.newMessage });
    this.newMessage = '';
  }

  createGroupChat() {
    alert("Funkcja tworzenia grupowego czatu!");
  }

  openChatSettings() {
    alert("Otwieranie ustawień czatu...");
  }
}
