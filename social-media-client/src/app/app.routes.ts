import { Routes } from '@angular/router';
import { ProfileComponent } from './components/routes/profile/profile.component';
import { LoginComponent } from './components/routes/login/login.component';
import { HomeComponent } from './components/routes/home/home.component';
import { SplashComponent } from './components/routes/splash/splash.component';
import { ConversationsComponent } from './components/routes/conversations/conversations.component';
import { ConnectionRouteComponent } from './components/routes/connection-route/connection-route.component';
import { NotificationRouteComponent } from './components/routes/notification-route/notification-route.component';

export const routes: Routes = [
    { path: 'profile', component: ProfileComponent },
    { path: 'home', component: HomeComponent },
    { path: 'logon', component: LoginComponent },
    { path: 'messages', component: ConversationsComponent},
    { path: 'splash', component: SplashComponent},
    { path: 'connections', component: ConnectionRouteComponent},
    { path: 'notifications', component: NotificationRouteComponent},
    { path: '',   redirectTo: '/splash', pathMatch: 'full'}
];
