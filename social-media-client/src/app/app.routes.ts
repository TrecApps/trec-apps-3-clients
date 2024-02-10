import { Routes } from '@angular/router';
import { ProfileComponent } from './components/routes/profile/profile.component';
import { LoginComponent } from './components/routes/login/login.component';

export const routes: Routes = [
    { path: 'profile', component: ProfileComponent },
    { path: 'logon', component: LoginComponent },
    { path: '',   redirectTo: '/profile', pathMatch: 'full'}
];
