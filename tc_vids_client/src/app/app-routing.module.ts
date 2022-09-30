import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { VidOverviewComponent } from './components/vid-overview/vid-overview.component';
import { VidWatchComponent } from './components/vid-watch/vid-watch.component';



const routes: Routes = [
	{ path: 'Home', component: HomeComponent},
  { path: 'Login', component: LoginComponent },
  { path: 'Video', component: VidOverviewComponent },
  { path: 'Watch', component: VidWatchComponent},
  { path: '',   redirectTo: '/Home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }