import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamSearchComponent } from '../team-search/team-search.component';
import { AuthService } from '../app/services/auth.service';  // <-- wstrzyknięcie
import { UserService } from '../app/services/user.service';  // <-- wstrzyknięcie jeśli potrzebne

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  standalone: true,
  imports: [FullCalendarModule, FormsModule, CommonModule, TeamSearchComponent],
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  // Domyślna wartość
  userName: string = 'Nieznany użytkownik';

  newEventTitle: string = '';
  newEventDate: string = '';
  newEventDescription: string = '';

  selectedEvent: any = null;
  isEditModalVisible: boolean = false;

  tooltipContent: string = '';
  tooltipPosition = { top: 0, left: 0 };
  tooltipVisible: boolean = false;

  calendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    editable: true,
    selectable: true,
    events: [
      { title: 'Event 1', date: '2024-06-01', description: 'Opis wydarzenia 1' },
      { title: 'Event 2', date: '2024-06-05', description: 'Opis wydarzenia 2' },
    ],
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next today',
    },
    height: '100%',
    eventClick: this.handleEventClick.bind(this),
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventMouseLeave: this.handleEventMouseLeave.bind(this),
  };

  // Wstrzykujemy AuthService i (opcjonalnie) UserService
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService  // <-- jeśli chcesz też pobrać np. teamId
  ) {}

  // Analogicznie do TasksComponent
  ngOnInit(): void {
    // Jeśli w authService masz metodę, która zwraca np. "Jan Kowalski"
    this.userName = this.authService.getUserName();

    // (Opcjonalnie) Jeśli potrzebujesz pobrać coś więcej z serwera:
    /*
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        // Sklejamy name i surname
        this.userName = `${user.name} ${user.surname}`;
      },
      error: (err) => {
        console.error('Błąd pobierania użytkownika:', err);
      }
    });
    */
  }

  logout() {
    this.router.navigate(['/login']);
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

  addEvent(event: Event) {
    event.preventDefault();
    if (this.newEventTitle && this.newEventDate) {
      this.calendarOptions.events = [
        ...this.calendarOptions.events,
        {
          title: this.newEventTitle,
          date: this.newEventDate,
          description: this.newEventDescription
        },
      ];
      this.newEventTitle = '';
      this.newEventDate = '';
      this.newEventDescription = '';
      alert('Wydarzenie zostało dodane!');
    } else {
      alert('Proszę wypełnić wszystkie pola!');
    }
  }

  handleEventClick(arg: any) {
    this.selectedEvent = arg.event;
    this.newEventTitle = arg.event.title;
    this.newEventDate = arg.event.startStr;
    this.newEventDescription = arg.event.extendedProps.description || '';
    this.isEditModalVisible = true;
  }

  handleEventMouseEnter(info: any) {
    const description = info.event.extendedProps.description;
    if (description) {
      this.tooltipContent = description;
      const rect = info.el.getBoundingClientRect();
      this.tooltipPosition = {
        top: rect.top + window.scrollY - 40,
        left: rect.left + window.scrollX + rect.width / 2,
      };
      this.tooltipVisible = true;
    }
  }

  handleEventMouseLeave() {
    this.tooltipVisible = false;
    this.tooltipContent = '';
  }

  saveEvent() {
    if (this.selectedEvent) {
      this.selectedEvent.setProp('title', this.newEventTitle);
      this.selectedEvent.setStart(this.newEventDate);
      this.selectedEvent.setExtendedProp('description', this.newEventDescription);
      this.isEditModalVisible = false;
      alert('Wydarzenie zostało zaktualizowane!');
    }
  }

  deleteEvent() {
    if (this.selectedEvent) {
      this.selectedEvent.remove();
      this.isEditModalVisible = false;
      alert('Wydarzenie zostało usunięte!');
    }
  }

  closeEditModal() {
    this.isEditModalVisible = false;
  }
}
