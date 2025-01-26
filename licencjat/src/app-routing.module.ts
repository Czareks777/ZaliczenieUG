import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordSuccessComponent } from './password-success/password-success.component';
import { EmailCodeComponent } from './email-code/email-code.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { path: 'forgot-password', component: EmailCodeComponent }, 
  { path: 'reset-password', component: ResetPasswordComponent }, 
  { path: 'password-success', component: PasswordSuccessComponent }, 
  { path: 'dashboard', component: DashboardComponent }, 
  { path: 'team', component: TeamComponent },
  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
