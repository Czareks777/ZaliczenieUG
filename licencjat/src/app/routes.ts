import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { PasswordSuccessComponent } from '../password-success/password-success.component';
import { EmailCodeComponent } from '../email-code/email-code.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { TeamComponent } from '../team/team.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { TasksComponent } from '../tasks/tasks.component';
import { ChatComponent } from '../chat/chat.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Strona logowania
  { path: 'forgot-password', component: EmailCodeComponent }, // Reset hasła
  { path: 'reset-password', component: ResetPasswordComponent }, // Nowe hasło
  { path: 'password-success', component: PasswordSuccessComponent }, // Sukces resetowania hasła
  { path: 'dashboard', component: DashboardComponent }, // Dashboard
  { path: 'team', component: TeamComponent },
  { path: 'calendar', component: CalendarComponent },
  {path: 'tasks', component: TasksComponent},
  {path: 'chat', component: ChatComponent},
  { path: '**', redirectTo: '' } // Fallback dla nieznanych tras
];
