import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Ważne
  imports: [RouterModule], // ✅ Dodaj RouterModule
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {   
};
