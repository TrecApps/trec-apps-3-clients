import { Routes } from '@angular/router';
import { ProfileComponent } from './components/routes/profile/profile.component';

export const routes: Routes = [
    { path: 'profile', component: ProfileComponent},
    { path: '',   redirectTo: '/profile', pathMatch: 'full'}
];
